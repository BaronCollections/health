import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createAccountStateStore,
  createInitialAccountState,
} from './state.js';

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

test('createAccountStateStore persists read markers and created records', () => {
  const store = createAccountStateStore({
    storage: createMemoryStorage(),
  });

  store.markNotificationRead('notif-1');
  store.saveFeedbackRecord({
    id: 'fb-local-1',
    category: 'OCR 识别',
    subject: 'Need better OCR ordering',
    status: 'submitted',
    submittedAt: '刚刚',
  });
  store.saveExportRequest({
    id: 'export-local-1',
    requestedAt: '2026-03-17T12:00:00.000Z',
    status: 'requested',
    scopeSummary: 'Assessment history',
  });
  store.saveDeleteRequest({
    id: 'delete-local-1',
    submittedAt: '2026-03-17 12:05',
    status: 'submitted',
    impactSummary: 'Delete profile and records',
  });

  const snapshot = store.read();

  assert.deepEqual(snapshot.readNotificationIds, ['notif-1']);
  assert.equal(snapshot.feedbackRecords.length, 1);
  assert.equal(snapshot.exportRequests.length, 1);
  assert.equal(snapshot.deleteRequests.length, 1);
});

test('createInitialAccountState returns the empty overlay state', () => {
  assert.deepEqual(createInitialAccountState(), {
    readNotificationIds: [],
    feedbackRecords: [],
    exportRequests: [],
    deleteRequests: [],
  });
});
