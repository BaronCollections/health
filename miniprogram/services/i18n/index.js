const SUPPORTED_LOCALES = ['zh-CN', 'en'];
const DEFAULT_LOCALE = 'zh-CN';
const LOCALE_STORAGE_KEY = 'mintbit.session.locale';

function getNestedValue(source, keyPath) {
  return keyPath.split('.').reduce((currentValue, key) => {
    if (currentValue && typeof currentValue === 'object' && key in currentValue) {
      return currentValue[key];
    }

    return undefined;
  }, source);
}

export function normalizeLocale(locale) {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  if (locale === 'en' || locale.startsWith('en-')) {
    return 'en';
  }

  if (locale === 'zh-CN' || locale === 'zh' || locale.startsWith('zh-')) {
    return 'zh-CN';
  }

  return DEFAULT_LOCALE;
}

export function createI18nRuntime({
  storage,
  dictionaries,
  defaultLocale = DEFAULT_LOCALE,
  storageKey = LOCALE_STORAGE_KEY,
} = {}) {
  if (!storage) {
    throw new Error('Storage adapter is required');
  }

  const catalog = dictionaries || {};
  let activeLocale = normalizeLocale(storage.getItem(storageKey) || defaultLocale);

  function setLocale(nextLocale) {
    activeLocale = normalizeLocale(nextLocale);
    storage.setItem(storageKey, activeLocale);
    return activeLocale;
  }

  function t(key, locale = activeLocale) {
    const requestedLocale = normalizeLocale(locale);
    const requestedValue = getNestedValue(catalog[requestedLocale], key);

    if (requestedValue !== undefined) {
      return requestedValue;
    }

    const fallbackValue = getNestedValue(catalog[defaultLocale], key);

    if (fallbackValue !== undefined) {
      return fallbackValue;
    }

    return key;
  }

  return {
    getLocale() {
      return activeLocale;
    },
    setLocale,
    t,
  };
}

export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES };
