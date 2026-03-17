import { resolveEnvConfig } from '../../config/env.js';

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '');
}

function trimLeadingSlash(value = '') {
  return value.replace(/^\/+/, '');
}

export function buildApiUrl(baseUrl, path) {
  return `${trimTrailingSlash(baseUrl)}/${trimLeadingSlash(path)}`;
}

export function createRequestClientConfig({
  env,
  session = {},
  locale = 'zh-CN',
  appId = '',
} = {}) {
  const resolvedEnv = resolveEnvConfig(env);
  const headers = {
    Accept: 'application/json',
    'Accept-Language': locale,
    'Content-Type': 'application/json',
    'X-App-Version': resolvedEnv.appVersion,
    'X-Client-Platform': 'wechat-miniprogram',
    'X-Wechat-AppId': appId,
  };

  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return {
    baseUrl: trimTrailingSlash(resolvedEnv.apiBaseUrl),
    timeout: resolvedEnv.requestTimeout,
    headers,
  };
}

export function createRequestClient({
  env,
  getLocale = () => 'zh-CN',
  getSession = () => ({}),
  locale,
  session,
  appId = '',
  requestAdapter,
} = {}) {
  const adapter = requestAdapter || globalThis.wx?.request?.bind(globalThis.wx);

  if (!adapter) {
    throw new Error('Request adapter is required');
  }

  return function request({ url, method = 'GET', data, headers = {} }) {
    const resolvedSession = typeof getSession === 'function' ? getSession() : session || {};
    const resolvedLocale = typeof getLocale === 'function' ? getLocale() : locale || 'zh-CN';
    const config = createRequestClientConfig({
      env,
      session: resolvedSession,
      locale: resolvedLocale,
      appId,
    });

    return new Promise((resolve, reject) => {
      adapter({
        url: buildApiUrl(config.baseUrl, url),
        method,
        data,
        timeout: config.timeout,
        header: {
          ...config.headers,
          ...headers,
        },
        success: resolve,
        fail: (error) => reject(new Error(error?.errMsg || 'Request failed')),
      });
    });
  };
}
