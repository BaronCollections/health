import assert from 'node:assert/strict';
import test from 'node:test';

import { createAccountApi } from './api.js';

test('createAccountApi fetches notifications by filter', async () => {
  const calls = [];
  const api = createAccountApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            filter: 'community',
            unreadCount: 1,
            items: [
              {
                id: 'notif-2',
                type: 'community',
              },
            ],
          },
        },
      };
    },
  });

  const response = await api.fetchNotifications('community');

  assert.deepEqual(calls, [
    {
      url: '/account/notifications',
      method: 'GET',
      data: {
        type: 'community',
      },
    },
  ]);
  assert.equal(response.filter, 'community');
  assert.equal(response.items[0].id, 'notif-2');
});

test('createAccountApi marks notifications as read in batch', async () => {
  const calls = [];
  const api = createAccountApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            filter: 'all',
            unreadCount: 0,
            items: [],
          },
        },
      };
    },
  });

  await api.markNotificationsRead(['notif-1', 'notif-2']);

  assert.deepEqual(calls, [
    {
      url: '/account/notifications/read-batch',
      method: 'POST',
      data: {
        ids: ['notif-1', 'notif-2'],
      },
    },
  ]);
});

test('createAccountApi creates feedback, export, and delete requests', async () => {
  const calls = [];
  const api = createAccountApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            id: `ok-${calls.length}`,
          },
        },
      };
    },
  });

  const feedback = await api.createFeedback({
    category: 'OCR 识别',
    subject: 'Need better field sorting',
    description: 'desc',
    screenshotAsset: {
      id: 'shot-1',
      name: 'ocr-order.png',
      tempFilePath: '/tmp/ocr-order.png',
      size: 2048,
      type: 'image',
    },
  });
  const exportRequest = await api.createExportRequest({
    scopeSummary: 'Assessment history',
  });
  const deleteRequest = await api.createDeleteRequest({
    impactSummary: 'Delete my account',
  });

  assert.equal(feedback.id, 'ok-1');
  assert.equal(exportRequest.id, 'ok-2');
  assert.equal(deleteRequest.id, 'ok-3');
  assert.deepEqual(calls.map((call) => call.url), [
    '/account/help/feedback',
    '/account/privacy/export',
    '/account/privacy/delete-request',
  ]);
  assert.equal(calls[0].data.screenshotAsset.name, 'ocr-order.png');
});
