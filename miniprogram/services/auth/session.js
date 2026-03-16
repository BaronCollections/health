export const SESSION_STORAGE_KEYS = Object.freeze({
  accessToken: 'mintbit.session.accessToken',
  refreshToken: 'mintbit.session.refreshToken',
  bindToken: 'mintbit.session.bindToken',
  locale: 'mintbit.session.locale',
  userProfile: 'mintbit.session.userProfile',
});

export const DEFAULT_LOCALE = 'zh-CN';

function normalizeStorage(storage) {
  if (storage) {
    return storage;
  }

  if (globalThis.wx) {
    return {
      getItem(key) {
        return wx.getStorageSync(key) || null;
      },
      setItem(key, value) {
        wx.setStorageSync(key, value);
      },
      removeItem(key) {
        wx.removeStorageSync(key);
      },
    };
  }

  throw new Error('Storage adapter is required');
}

function normalizeProfile(rawProfile) {
  if (!rawProfile) {
    return null;
  }

  if (typeof rawProfile === 'string') {
    try {
      return JSON.parse(rawProfile);
    } catch {
      return null;
    }
  }

  return rawProfile;
}

function normalizeValue(value) {
  return value || '';
}

function resolveStatus(snapshot) {
  if (snapshot.accessToken) {
    return 'authenticated';
  }

  if (snapshot.bindToken) {
    return 'bind_required';
  }

  return 'anonymous';
}

export function createSessionStore({ storage, defaultLocale = DEFAULT_LOCALE } = {}) {
  const adapter = normalizeStorage(storage);

  function read() {
    const accessToken = normalizeValue(adapter.getItem(SESSION_STORAGE_KEYS.accessToken));
    const refreshToken = normalizeValue(adapter.getItem(SESSION_STORAGE_KEYS.refreshToken));
    const bindToken = normalizeValue(adapter.getItem(SESSION_STORAGE_KEYS.bindToken));
    const locale = normalizeValue(adapter.getItem(SESSION_STORAGE_KEYS.locale)) || defaultLocale;
    const userProfile = normalizeProfile(adapter.getItem(SESSION_STORAGE_KEYS.userProfile));

    const snapshot = {
      accessToken,
      refreshToken,
      bindToken,
      locale,
      userProfile,
    };

    return {
      status: resolveStatus(snapshot),
      ...snapshot,
    };
  }

  function save(snapshot = {}) {
    const values = {
      accessToken: normalizeValue(snapshot.accessToken),
      refreshToken: normalizeValue(snapshot.refreshToken),
      bindToken: normalizeValue(snapshot.bindToken),
      locale: normalizeValue(snapshot.locale) || defaultLocale,
      userProfile: snapshot.userProfile || null,
    };

    Object.entries(SESSION_STORAGE_KEYS).forEach(([field, key]) => {
      const value = values[field];

      if (field === 'userProfile') {
        if (value) {
          adapter.setItem(key, JSON.stringify(value));
        } else {
          adapter.removeItem(key);
        }
        return;
      }

      if (value) {
        adapter.setItem(key, value);
      } else {
        adapter.removeItem(key);
      }
    });

    return read();
  }

  function clear() {
    Object.values(SESSION_STORAGE_KEYS).forEach((key) => {
      adapter.removeItem(key);
    });
  }

  return {
    clear,
    read,
    save,
  };
}
