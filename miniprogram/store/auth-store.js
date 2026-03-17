import { createMiniProgramAuthApi } from '../services/auth/api.js';
import { createRequestClient } from '../services/request/client.js';
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

export function createAuthStore({ storage, api, requestAdapter } = {}) {
    const sessionStore = createSessionStore({
        storage: createStorageAdapter(storage),
    });
    const listeners = new Set();
    let snapshot = sessionStore.read();
    const authApi = api || (
        requestAdapter || globalThis.wx?.request
            ? createMiniProgramAuthApi({
                request: createRequestClient({
                    getLocale: () => snapshot.locale,
                    getSession: () => snapshot,
                    requestAdapter,
                }),
            })
            : null
    );

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
        async loginWithWeChat() {
            if (!authApi) {
                throw new Error('Auth API is not configured');
            }
            const response = await authApi.loginWithWeChat();

            if (response.bindRequired) {
                snapshot = sessionStore.save({
                    ...snapshot,
                    accessToken: '',
                    refreshToken: '',
                    bindToken: response.bindToken,
                    userProfile: response.profile || null,
                });
                notify();
                return snapshot;
            }

            snapshot = sessionStore.save({
                ...snapshot,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                bindToken: '',
                userProfile: response.profile || null,
            });
            notify();
            return snapshot;
        },
        async sendSmsCode(phone) {
            if (!authApi) {
                throw new Error('Auth API is not configured');
            }
            return authApi.sendSmsCode(phone);
        },
        async bindPhone({ phone, smsCode }) {
            if (!authApi) {
                throw new Error('Auth API is not configured');
            }
            const response = await authApi.bindPhone({
                phone,
                smsCode,
                bindToken: snapshot.bindToken,
            });

            snapshot = sessionStore.save({
                ...snapshot,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                bindToken: '',
                userProfile: response.profile || null,
            });
            notify();
            return snapshot;
        },
        async refreshSession() {
            if (!authApi) {
                throw new Error('Auth API is not configured');
            }
            const response = await authApi.refreshSession();

            snapshot = sessionStore.save({
                ...snapshot,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                bindToken: '',
                userProfile: response.profile || null,
            });
            notify();
            return snapshot;
        },
        async loadProfile() {
            if (!authApi) {
                throw new Error('Auth API is not configured');
            }
            const profile = await authApi.getProfile();

            snapshot = sessionStore.save({
                ...snapshot,
                userProfile: profile,
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
