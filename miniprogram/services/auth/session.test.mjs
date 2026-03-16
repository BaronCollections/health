import assert from 'node:assert/strict';
import test from 'node:test';

import { createSessionStore } from './session.js';

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
    dump() {
      return Object.fromEntries(state.entries());
    },
  };
}

test('createSessionStore persists access token, bind token, locale, and profile', () => {
  const storage = createMemoryStorage();
  const sessionStore = createSessionStore({ storage });

  sessionStore.save({
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
    bindToken: 'bind-token-789',
    locale: 'en',
    userProfile: {
      id: 7,
      nickname: 'Mia',
    },
  });

  assert.deepEqual(sessionStore.read(), {
    status: 'authenticated',
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
    bindToken: 'bind-token-789',
    locale: 'en',
    userProfile: {
      id: 7,
      nickname: 'Mia',
    },
  });

  assert.deepEqual(storage.dump(), {
    'mintbit.session.accessToken': 'access-token-123',
    'mintbit.session.refreshToken': 'refresh-token-456',
    'mintbit.session.bindToken': 'bind-token-789',
    'mintbit.session.locale': 'en',
    'mintbit.session.userProfile': '{"id":7,"nickname":"Mia"}',
  });
});

test('createSessionStore clears persisted session keys and falls back to anonymous state', () => {
  const storage = createMemoryStorage({
    'mintbit.session.accessToken': 'access-token-123',
    'mintbit.session.bindToken': 'bind-token-789',
    'mintbit.session.locale': 'en',
    'mintbit.session.userProfile': '{"id":7,"nickname":"Mia"}',
  });
  const sessionStore = createSessionStore({ storage });

  sessionStore.clear();

  assert.deepEqual(sessionStore.read(), {
    status: 'anonymous',
    accessToken: '',
    refreshToken: '',
    bindToken: '',
    locale: 'zh-CN',
    userProfile: null,
  });

  assert.deepEqual(storage.dump(), {});
});
