import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildAccountHomeViewModel,
  buildDeleteRequestsViewModel,
  buildFeedbackRecordsViewModel,
  buildNotificationDetailViewModel,
  buildPrivacyViewModel,
  buildExportRequestsViewModel,
  buildSecurityViewModel,
  buildNotificationsViewModel,
  getAccountContent,
  mergeAccountNotifications,
  mergeFeedbackRecords,
} from './index.js';

test('mergeAccountNotifications keeps localized fields while applying server status', () => {
  const localNotification = getAccountContent('zh-CN').notifications.find((entry) => entry.id === 'notif-2');
  const merged = mergeAccountNotifications([localNotification], [
    {
      ...getAccountContent('en').notifications.find((entry) => entry.id === 'notif-2'),
      status: 'read',
    },
  ]);

  assert.equal(merged[0].title, '你的帖子审核状态已更新');
  assert.equal(merged[0].status, 'read');
});

test('mergeFeedbackRecords keeps localized copy while applying server status', () => {
  const localRecord = getAccountContent('zh-CN').feedbackRecords.find((entry) => entry.id === 'fb-1');
  const merged = mergeFeedbackRecords([localRecord], [
    {
      ...getAccountContent('en').feedbackRecords.find((entry) => entry.id === 'fb-1'),
      status: 'responded',
    },
  ]);

  assert.equal(merged[0].subject, '报告页的 OCR 字段想要手动排序');
  assert.equal(merged[0].status, 'responded');
});

test('mergeFeedbackRecords keeps localized screenshot asset metadata when overlaying server records', () => {
  const merged = mergeFeedbackRecords(
    [
      {
        ...getAccountContent('zh-CN').feedbackRecords.find((entry) => entry.id === 'fb-1'),
        screenshotAsset: {
          id: 'shot-1',
          name: 'ocr-order.png',
          tempFilePath: '/tmp/ocr-order.png',
          size: 2048,
          type: 'image',
        },
      },
    ],
    [
      {
        ...getAccountContent('en').feedbackRecords.find((entry) => entry.id === 'fb-1'),
        status: 'responded',
      },
    ],
  );

  assert.equal(merged[0].status, 'responded');
  assert.equal(merged[0].screenshotAsset.name, 'ocr-order.png');
  assert.equal(merged[0].screenshotAsset.tempFilePath, '/tmp/ocr-order.png');
});

test('mergeFeedbackRecords prepends local-only records ahead of seeded records', () => {
  const merged = mergeFeedbackRecords(
    [
      {
        id: 'fb-local-1',
        category: 'OCR 识别',
        subject: 'Local feedback',
        status: 'submitted',
        submittedAt: '刚刚',
      },
      getAccountContent('zh-CN').feedbackRecords.find((entry) => entry.id === 'fb-1'),
    ],
    [getAccountContent('en').feedbackRecords.find((entry) => entry.id === 'fb-1')],
  );

  assert.equal(merged[0].id, 'fb-local-1');
  assert.equal(merged[1].id, 'fb-1');
});

test('buildAccountHomeViewModel summarizes unread, feedback, export, and delete states', () => {
  const viewModel = buildAccountHomeViewModel({
    locale: 'en',
    allowAdminTools: true,
  });

  assert.equal(viewModel.header.title, 'Keep messages, support, and trust controls in one place');
  assert.equal(viewModel.summary.unreadValue, '2');
  assert.equal(viewModel.summary.feedbackValue, '2');
  assert.equal(viewModel.summary.exportStatusLabel, 'Generating');
  assert.equal(viewModel.cards.at(-1).id, 'admin');
});

test('buildNotificationsViewModel filters notifications by type and exposes unread ids', () => {
  const viewModel = buildNotificationsViewModel({
    locale: 'zh-CN',
    filter: 'community',
  });

  assert.equal(viewModel.header.title, '把系统通知、社区互动和打卡提醒分开管理');
  assert.deepEqual(
    viewModel.items.map((item) => item.id),
    ['notif-2'],
  );
  assert.deepEqual(viewModel.unreadIds, ['notif-2']);
});

test('buildFeedbackRecordsViewModel groups records by status labels', () => {
  const viewModel = buildFeedbackRecordsViewModel({
    locale: 'en',
  });

  assert.equal(viewModel.header.title, 'Feedback records');
  assert.equal(viewModel.attachmentPreviewCta, 'Preview');
  assert.equal(viewModel.groups[0].statusLabel, 'In review');
  assert.equal(viewModel.groups[0].items.length, 1);
});

test('buildPrivacyViewModel exposes export and delete request summaries', () => {
  const viewModel = buildPrivacyViewModel({
    locale: 'zh-CN',
  });

  assert.equal(viewModel.header.title, '隐私、权限与数据控制');
  assert.equal(viewModel.exportRequest.statusLabel, '生成中');
  assert.equal(viewModel.deleteRequest.statusLabel, '冷静期中');
});

test('buildSecurityViewModel maps preference toggles and status labels', () => {
  const viewModel = buildSecurityViewModel({
    locale: 'en',
  });

  assert.equal(viewModel.header.title, 'Security and account preferences');
  assert.equal(viewModel.binding.statusLabel, 'Unbound');
  assert.equal(viewModel.preferences.length, 3);
  assert.equal(viewModel.preferences[0].enabledLabel, 'Enabled');
});

test('buildNotificationDetailViewModel returns localized detail with related action label', () => {
  const viewModel = buildNotificationDetailViewModel({
    locale: 'zh-CN',
    notificationId: 'notif-1',
  });

  assert.equal(viewModel.notification.id, 'notif-1');
  assert.equal(viewModel.header.backCta, '返回消息中心');
  assert.equal(viewModel.meta.sourceLabel, '消息来源');
});

test('buildExportRequestsViewModel exposes latest request and localized status labels', () => {
  const viewModel = buildExportRequestsViewModel({
    locale: 'en',
  });

  assert.equal(viewModel.header.title, 'Data export requests');
  assert.equal(viewModel.requests[0].statusLabel, 'Generating');
});

test('buildDeleteRequestsViewModel exposes withdrawable request state', () => {
  const viewModel = buildDeleteRequestsViewModel({
    locale: 'zh-CN',
  });

  assert.equal(viewModel.header.title, '删除申请');
  assert.equal(viewModel.requests[0].statusLabel, '冷静期中');
  assert.equal(viewModel.requests[0].canWithdraw, true);
});
