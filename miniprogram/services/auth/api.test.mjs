import assert from 'node:assert/strict';
import test from 'node:test';

import { createMiniProgramAuthApi } from './api.js';

test('createMiniProgramAuthApi sends wx.login code to the backend login endpoint', async () => {
  const calls = [];
  const api = createMiniProgramAuthApi({
    wxLogin: async () => ({ code: 'wx-code-001' }),
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            bindRequired: true,
            bindToken: 'bind-token-001',
            profile: {
              phoneBound: false,
            },
          },
        },
      };
    },
  });

  const response = await api.loginWithWeChat();

  assert.deepEqual(calls, [
    {
      url: '/miniprogram/auth/login',
      method: 'POST',
      data: {
        code: 'wx-code-001',
      },
    },
  ]);
  assert.deepEqual(response, {
    bindRequired: true,
    bindToken: 'bind-token-001',
    profile: {
      phoneBound: false,
    },
  });
});

test('createMiniProgramAuthApi binds phone with bind token and sms code', async () => {
  const calls = [];
  const api = createMiniProgramAuthApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            accessToken: 'access-token-001',
            refreshToken: 'refresh-token-002',
            profile: {
              id: 7,
              nickname: 'Mia',
            },
          },
        },
      };
    },
  });

  const response = await api.bindPhone({
    phone: '13800138000',
    smsCode: '123456',
    bindToken: 'bind-token-001',
  });

  assert.deepEqual(calls, [
    {
      url: '/miniprogram/auth/bind',
      method: 'POST',
      data: {
        phone: '13800138000',
        smsCode: '123456',
        bindToken: 'bind-token-001',
      },
    },
  ]);
  assert.deepEqual(response, {
    accessToken: 'access-token-001',
    refreshToken: 'refresh-token-002',
    profile: {
      id: 7,
      nickname: 'Mia',
    },
  });
});
