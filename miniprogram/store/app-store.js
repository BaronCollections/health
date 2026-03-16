import { TAB_BAR_ROUTES } from '../config/routes.js';
import { createI18nRuntime } from '../services/i18n/index.js';
import { MINTBIT_COPY } from '../i18n/runtime.js';

const TAB_BAR_IDS = ['home', 'report', 'checkin', 'community', 'profile'];

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
  };
}

function getByPath(source, keyPath) {
  return keyPath.split('.').reduce((currentValue, key) => {
    if (currentValue && typeof currentValue === 'object' && key in currentValue) {
      return currentValue[key];
    }

    return undefined;
  }, source);
}

function buildTabBar(locale) {
  const copy = MINTBIT_COPY[locale] || MINTBIT_COPY['zh-CN'];

  return TAB_BAR_ROUTES.map((route, index) => ({
    id: TAB_BAR_IDS[index],
    path: route,
    label: copy.tabBar[TAB_BAR_IDS[index]],
  }));
}

export function createAppStore({ storage } = {}) {
  const adapter = createStorageAdapter(storage);
  const i18nRuntime = createI18nRuntime({
    storage: adapter,
    dictionaries: MINTBIT_COPY,
  });
  const listeners = new Set();
  let snapshot = {
    locale: i18nRuntime.getLocale(),
    copy: MINTBIT_COPY[i18nRuntime.getLocale()],
    tabBar: buildTabBar(i18nRuntime.getLocale()),
  };

  function notify() {
    listeners.forEach((listener) => listener(snapshot));
  }

  function rebuild() {
    snapshot = {
      locale: i18nRuntime.getLocale(),
      copy: MINTBIT_COPY[i18nRuntime.getLocale()],
      tabBar: buildTabBar(i18nRuntime.getLocale()),
    };
    return snapshot;
  }

  return {
    getSnapshot() {
      return snapshot;
    },
    hydrate() {
      rebuild();
      notify();
      return snapshot;
    },
    setLocale(nextLocale) {
      i18nRuntime.setLocale(nextLocale);
      rebuild();
      notify();
      return snapshot;
    },
    getText(keyPath) {
      return getByPath(snapshot.copy, keyPath);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
