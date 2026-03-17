export const ASSESSMENT_SESSION_STORAGE_KEY = 'mintbit.assessment.session';

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

export function createAssessmentSessionStore({ storage } = {}) {
  const adapter = createStorageAdapter(storage);

  function readSnapshot() {
    const rawValue = adapter.getItem(ASSESSMENT_SESSION_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      adapter.removeItem(ASSESSMENT_SESSION_STORAGE_KEY);
      return null;
    }
  }

  function writeSnapshot(snapshot) {
    adapter.setItem(ASSESSMENT_SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    return snapshot;
  }

  return {
    read() {
      return readSnapshot();
    },
    save(snapshot) {
      return writeSnapshot(snapshot);
    },
    saveOcrUpload(ocrUpload) {
      const currentSnapshot = readSnapshot() || {};
      return writeSnapshot({
        ...currentSnapshot,
        ocrUpload,
      });
    },
    saveOcrResult(ocrResult) {
      const currentSnapshot = readSnapshot() || {};
      return writeSnapshot({
        ...currentSnapshot,
        ocrResult,
      });
    },
    clear() {
      adapter.removeItem(ASSESSMENT_SESSION_STORAGE_KEY);
    },
  };
}
