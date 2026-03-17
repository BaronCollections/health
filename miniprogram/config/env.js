const DEFAULT_ENV = Object.freeze({
  apiBaseUrl: 'http://127.0.0.1:8080/api',
  requestTimeout: 15000,
  appVersion: 'miniprogram-dev',
  adminAllowlist: '',
});

export function resolveEnvConfig(overrides = {}) {
  return {
    ...DEFAULT_ENV,
    ...(globalThis.__MINTBIT_ENV__ || {}),
    ...overrides,
  };
}

export { DEFAULT_ENV };
