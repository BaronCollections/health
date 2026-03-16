import assert from 'node:assert/strict';
import test from 'node:test';

import { buildApiUrl, createRequestClientConfig } from './client.js';

test('createRequestClientConfig resolves base URL, timeout, and standard headers', () => {
  const config = createRequestClientConfig({
    env: {
      apiBaseUrl: 'https://api.mintbit.test/v1',
      requestTimeout: 12000,
      appVersion: '0.1.0',
    },
    session: {
      accessToken: 'access-token-123',
    },
    locale: 'en',
    appId: 'wx385f66d562401f3b',
  });

  assert.deepEqual(config, {
    baseUrl: 'https://api.mintbit.test/v1',
    timeout: 12000,
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      Authorization: 'Bearer access-token-123',
      'Content-Type': 'application/json',
      'X-App-Version': '0.1.0',
      'X-Client-Platform': 'wechat-miniprogram',
      'X-Wechat-AppId': 'wx385f66d562401f3b',
    },
  });

  assert.equal(
    buildApiUrl(config.baseUrl, '/miniprogram/auth/login'),
    'https://api.mintbit.test/v1/miniprogram/auth/login',
  );
});
