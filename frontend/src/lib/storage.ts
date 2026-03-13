export function getStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getJsonStorageItem<T>(key: string) {
  const value = getStorageItem(key);

  if (!value) {
    return null as T | null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null as T | null;
  }
}

export function setJsonStorageItem<T>(key: string, value: T) {
  setStorageItem(key, JSON.stringify(value));
}
