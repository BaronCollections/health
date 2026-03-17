const ACCOUNT_STATE_STORAGE_KEY = 'mintbit.account.state';

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

export function createInitialAccountState() {
  return {
    readNotificationIds: [],
    feedbackRecords: [],
    exportRequests: [],
    deleteRequests: [],
  };
}

function parseState(rawValue) {
  if (!rawValue) {
    return createInitialAccountState();
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      ...createInitialAccountState(),
      ...parsed,
      readNotificationIds: Array.isArray(parsed?.readNotificationIds) ? parsed.readNotificationIds : [],
      feedbackRecords: Array.isArray(parsed?.feedbackRecords) ? parsed.feedbackRecords : [],
      exportRequests: Array.isArray(parsed?.exportRequests) ? parsed.exportRequests : [],
      deleteRequests: Array.isArray(parsed?.deleteRequests) ? parsed.deleteRequests : [],
    };
  } catch {
    return createInitialAccountState();
  }
}

function saveState(storage, state) {
  storage.setItem(ACCOUNT_STATE_STORAGE_KEY, JSON.stringify(state));
  return state;
}

function upsertById(items, nextItem) {
  return [nextItem, ...items.filter((item) => item.id !== nextItem.id)];
}

export function createAccountStateStore({ storage } = {}) {
  const adapter = createStorageAdapter(storage);

  return {
    read() {
      return parseState(adapter.getItem(ACCOUNT_STATE_STORAGE_KEY));
    },
    save(state) {
      return saveState(adapter, {
        ...createInitialAccountState(),
        ...state,
      });
    },
    markNotificationRead(notificationId) {
      const current = this.read();
      const nextIds = current.readNotificationIds.includes(notificationId)
        ? current.readNotificationIds
        : [...current.readNotificationIds, notificationId];

      return this.save({
        ...current,
        readNotificationIds: nextIds,
      });
    },
    saveFeedbackRecord(record) {
      const current = this.read();
      return this.save({
        ...current,
        feedbackRecords: upsertById(current.feedbackRecords, record),
      });
    },
    saveExportRequest(request) {
      const current = this.read();
      return this.save({
        ...current,
        exportRequests: upsertById(current.exportRequests, request),
      });
    },
    saveDeleteRequest(request) {
      const current = this.read();
      return this.save({
        ...current,
        deleteRequests: upsertById(current.deleteRequests, request),
      });
    },
    clear() {
      adapter.removeItem(ACCOUNT_STATE_STORAGE_KEY);
      return createInitialAccountState();
    },
  };
}

export { ACCOUNT_STATE_STORAGE_KEY };
