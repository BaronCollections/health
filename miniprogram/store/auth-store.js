import { createSessionStore } from '../services/auth/session.js';

function createStorageAdapter(storage) {
  if (storage) {
    return storage;
  }

  return {
    getItem(key) {
      return globalThis.wx?.getStorageSync?.(key) || null;
    },
    setItem(key, value) {
      globalThis.wx?.setStorageSync?.(key, value);
    },
    removeItem(key) {
      globalThis.wx?.removeStorageSync?.(key);
    },
  };
}

export function createAuthStore({ storage } = {}) {
  const sessionStore = createSessionStore({
    storage: createStorageAdapter(storage),
  });
  const listeners = new Set();
  let snapshot = sessionStore.read();

  function notify() {
    listeners.forEach((listener) => listener(snapshot));
  }

  return {
    getSnapshot() {
      return snapshot;
    },
    hydrate() {
      snapshot = sessionStore.read();
      notify();
      return snapshot;
    },
    setBindRequired(bindToken, overrides = {}) {
      snapshot = sessionStore.save({
        ...snapshot,
        ...overrides,
        accessToken: '',
        refreshToken: '',
        bindToken,
      });
      notify();
      return snapshot;
    },
    setAuthenticated(payload) {
      snapshot = sessionStore.save({
        ...snapshot,
        ...payload,
        bindToken: '',
      });
      notify();
      return snapshot;
    },
    clear() {
      sessionStore.clear();
      snapshot = sessionStore.read();
      notify();
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
