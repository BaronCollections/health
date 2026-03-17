import assert from 'node:assert/strict';
import test from 'node:test';

import { createAuthStore } from './auth-store.js';

function createMemoryStorage(seed = {}) {
  const state = new Map(Object.entries(seed));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    },
  };
}

test('createAuthStore hydrates bind-required state from persisted bind token', () => {
  const authStore = createAuthStore({
    storage: createMemoryStorage({
      'mintbit.session.bindToken': 'bind-token-001',
      'mintbit.session.locale': 'en',
    }),
  });

  const snapshot = authStore.hydrate();

  assert.deepEqual(snapshot, {
    status: 'bind_required',
    accessToken: '',
    refreshToken: '',
    bindToken: 'bind-token-001',
    locale: 'en',
    userProfile: null,
  });
});

test('createAuthStore promotes bind-required state to authenticated', () => {
  const authStore = createAuthStore({
    storage: createMemoryStorage({
      'mintbit.session.bindToken': 'bind-token-001',
      'mintbit.session.locale': 'zh-CN',
    }),
  });

  authStore.hydrate();
  const snapshot = authStore.setAuthenticated({
    accessToken: 'access-token-001',
    refreshToken: 'refresh-token-002',
    userProfile: {
      id: 7,
      nickname: 'Mia',
    },
  });

  assert.deepEqual(snapshot, {
    status: 'authenticated',
    accessToken: 'access-token-001',
    refreshToken: 'refresh-token-002',
    bindToken: '',
    locale: 'zh-CN',
    userProfile: {
      id: 7,
      nickname: 'Mia',
    },
  });
});

test('createAuthStore maps WeChat login responses into bind-required state', async () => {
  const authStore = createAuthStore({
    storage: createMemoryStorage({
      'mintbit.session.locale': 'en',
    }),
    api: {
      async loginWithWeChat() {
        return {
          bindRequired: true,
          bindToken: 'bind-token-002',
          profile: {
            phoneBound: false,
          },
        };
      },
    },
  });

  const snapshot = await authStore.loginWithWeChat();

  assert.deepEqual(snapshot, {
    status: 'bind_required',
    accessToken: '',
    refreshToken: '',
    bindToken: 'bind-token-002',
    locale: 'en',
    userProfile: {
      phoneBound: false,
    },
  });
});

test('createAuthStore binds a phone account into authenticated state through the auth api', async () => {
  const authStore = createAuthStore({
    storage: createMemoryStorage({
      'mintbit.session.bindToken': 'bind-token-002',
      'mintbit.session.locale': 'zh-CN',
    }),
    api: {
      async bindPhone(payload) {
        assert.deepEqual(payload, {
          phone: '13800138000',
          smsCode: '123456',
          bindToken: 'bind-token-002',
        });

        return {
          accessToken: 'access-token-010',
          refreshToken: 'refresh-token-020',
          profile: {
            id: 9,
            nickname: 'Bound User',
          },
        };
      },
    },
  });

  authStore.hydrate();
  const snapshot = await authStore.bindPhone({
    phone: '13800138000',
    smsCode: '123456',
  });

  assert.deepEqual(snapshot, {
    status: 'authenticated',
    accessToken: 'access-token-010',
    refreshToken: 'refresh-token-020',
    bindToken: '',
    locale: 'zh-CN',
    userProfile: {
      id: 9,
      nickname: 'Bound User',
    },
  });
});
