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
