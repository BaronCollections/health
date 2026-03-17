import { getAccountContent } from './content.js';

function normalizeIdentity(value) {
  return (value || '').trim().toLowerCase();
}

function cloneNotification(notification) {
  return {
    ...notification,
  };
}

function cloneRecord(record) {
  return {
    ...record,
  };
}

export function mergeAccountNotifications(localNotifications = [], apiNotifications = [], readNotificationIds = []) {
  const localMap = new Map(localNotifications.map((notification) => [notification.id, notification]));
  const readSet = new Set(readNotificationIds);

  return apiNotifications.map((notification) => {
    const local = localMap.get(notification.id);
    const merged = local
      ? {
          ...notification,
          title: local.title,
          preview: local.preview,
          body: local.body,
          relativeTime: local.relativeTime,
        }
      : cloneNotification(notification);

    if (readSet.has(merged.id)) {
      merged.status = 'read';
    }

    return merged;
  });
}

export function parseAdminAllowlist(value) {
  return [...new Set((value || '').split(/[\n,]/).map((entry) => normalizeIdentity(entry)).filter(Boolean))];
}

export function isAllowlistedAdmin(profile, allowlist = []) {
  if (!profile || !allowlist.length) {
    return false;
  }

  const candidates = [profile.phone, profile.nickname, profile.email, String(profile.id || '')]
    .map((entry) => normalizeIdentity(entry))
    .filter(Boolean);

  return candidates.some((entry) => allowlist.includes(entry));
}

export function mergeFeedbackRecords(localRecords = [], apiRecords = []) {
  const localMap = new Map(localRecords.map((record) => [record.id, record]));
  const extraRecords = localRecords
    .filter((record) => !apiRecords.some((entry) => entry.id === record.id))
    .map((record) => cloneRecord(record));

  return [
    ...extraRecords,
    ...apiRecords.map((record) => {
      const local = localMap.get(record.id);
      if (!local) {
        return cloneRecord(record);
      }

      return {
        ...record,
        category: local.category,
        subject: local.subject,
        description: local.description || record.description,
        contact: local.contact || record.contact,
        screenshotName: local.screenshotName || record.screenshotName,
        screenshotAsset: local.screenshotAsset || record.screenshotAsset,
        reply: local.reply || record.reply,
      };
    }),
  ];
}

function mergeExportRequests(localRequests = [], stateRequests = []) {
  const localMap = new Map(localRequests.map((request) => [request.id, request]));
  const extra = stateRequests.filter((request) => !localMap.has(request.id)).map((request) => cloneRecord(request));
  const merged = localRequests.map((request) => {
    const overlay = stateRequests.find((entry) => entry.id === request.id);
    if (!overlay) {
      return cloneRecord(request);
    }

    return {
      ...overlay,
      scopeSummary: request.scopeSummary || overlay.scopeSummary,
      requestedAt: request.requestedAt || overlay.requestedAt,
    };
  });
  return [...extra, ...merged];
}

function mergeDeleteRequests(localRequests = [], stateRequests = []) {
  const localMap = new Map(localRequests.map((request) => [request.id, request]));
  const extra = stateRequests.filter((request) => !localMap.has(request.id)).map((request) => cloneRecord(request));
  const merged = localRequests.map((request) => {
    const overlay = stateRequests.find((entry) => entry.id === request.id);
    if (!overlay) {
      return cloneRecord(request);
    }

    return {
      ...overlay,
      impactSummary: request.impactSummary || overlay.impactSummary,
      submittedAt: request.submittedAt || overlay.submittedAt,
    };
  });
  return [...extra, ...merged];
}

function countOpenFeedbackRecords(records = []) {
  return records.filter((record) => record.status !== 'closed').length;
}

function getLatestByDate(items = [], field) {
  return [...items].sort((left, right) => new Date(right[field]).getTime() - new Date(left[field]).getTime())[0] || null;
}

export function buildAccountHomeViewModel({
  locale,
  allowAdminTools = false,
  notifications,
  feedbackRecords,
  exportRequests,
  deleteRequests,
  security,
  readNotificationIds = [],
} = {}) {
  const content = getAccountContent(locale);
  const mergedNotifications = mergeAccountNotifications(
    content.notifications,
    notifications || content.notifications,
    readNotificationIds,
  );
  const mergedFeedback = mergeFeedbackRecords(content.feedbackRecords, feedbackRecords || content.feedbackRecords);
  const mergedExports = mergeExportRequests(content.exportRequests, exportRequests || []);
  const mergedDeletes = mergeDeleteRequests(content.deleteRequests, deleteRequests || []);
  const resolvedSecurity = security || content.security;
  const cards = allowAdminTools ? [...content.home.cards, content.home.adminToolsCard] : [...content.home.cards];
  const latestExport = getLatestByDate(mergedExports, 'requestedAt');
  const latestDelete = getLatestByDate(mergedDeletes, 'submittedAt');

  return {
    header: content.home,
    cards,
    summary: {
      unreadLabel: content.home.summary.unreadLabel,
      unreadValue: String(mergedNotifications.filter((notification) => notification.status === 'unread').length),
      feedbackLabel: content.home.summary.feedbackLabel,
      feedbackValue: String(countOpenFeedbackRecords(mergedFeedback)),
      exportLabel: content.home.summary.exportLabel,
      exportStatusLabel: latestExport ? content.labels.status[latestExport.status] : content.labels.status.idle,
      deleteLabel: content.home.summary.deleteLabel,
      deleteStatusLabel: latestDelete ? content.labels.status[latestDelete.status] : content.labels.status.idle,
      deleteWithdrawHint:
        latestDelete && ['submitted', 'cooling_off'].includes(latestDelete.status)
          ? content.home.summary.withdrawHint
          : '',
      securityBindingLabel: content.labels.accountBindingStatus[resolvedSecurity.accountBinding],
      ocrAuthorizationLabel: content.labels.ocrAuthorizationStatus[resolvedSecurity.ocrAuthorization],
    },
  };
}

export function buildNotificationsViewModel({
  locale,
  filter = 'all',
  notifications,
  readNotificationIds = [],
} = {}) {
  const content = getAccountContent(locale);
  const mergedNotifications = mergeAccountNotifications(
    content.notifications,
    notifications || content.notifications,
    readNotificationIds,
  );
  const items = mergedNotifications
    .filter((notification) => filter === 'all' || notification.type === filter)
    .map((notification) => ({
      ...notification,
      typeLabel: content.labels.notificationTypes[notification.type],
      statusLabel: content.labels.notificationStatus[notification.status],
    }));

  return {
    header: content.notificationsView,
    filter,
    filters: Object.entries(content.notificationsView.filters).map(([id, label]) => ({
      id,
      label,
      active: id === filter,
    })),
    items,
    unreadIds: items.filter((notification) => notification.status === 'unread').map((notification) => notification.id),
    emptyState: {
      title: content.notificationsView.emptyTitle,
      body: content.notificationsView.emptyBody,
    },
  };
}

export function buildFeedbackRecordsViewModel({
  locale,
  feedbackRecords,
} = {}) {
  const content = getAccountContent(locale);
  const mergedRecords = mergeFeedbackRecords(content.feedbackRecords, feedbackRecords || content.feedbackRecords);
  const statusOrder = ['in_review', 'responded', 'submitted', 'closed', 'draft'];

  return {
    header: content.feedbackRecordsView,
    attachmentPreviewCta: content.feedbackRecordsView.attachmentPreviewCta,
    groups: statusOrder
      .map((status) => ({
        id: status,
        statusLabel: content.labels.status[status],
        items: mergedRecords.filter((record) => record.status === status),
      }))
      .filter((group) => group.items.length),
    emptyState: {
      title: content.feedbackRecordsView.emptyTitle,
      body: content.feedbackRecordsView.emptyBody,
    },
  };
}

export function buildPrivacyViewModel({
  locale,
  exportRequests,
  deleteRequests,
  security,
} = {}) {
  const content = getAccountContent(locale);
  const mergedExports = mergeExportRequests(content.exportRequests, exportRequests || []);
  const mergedDeletes = mergeDeleteRequests(content.deleteRequests, deleteRequests || []);
  const latestExport = getLatestByDate(mergedExports, 'requestedAt');
  const latestDelete = getLatestByDate(mergedDeletes, 'submittedAt');
  const resolvedSecurity = security || content.security;

  return {
    header: content.privacyCenter,
    exportRequest: latestExport
      ? {
          ...latestExport,
          statusLabel: content.labels.status[latestExport.status],
        }
      : null,
    deleteRequest: latestDelete
      ? {
          ...latestDelete,
          statusLabel: content.labels.status[latestDelete.status],
          canWithdraw: ['submitted', 'cooling_off'].includes(latestDelete.status),
        }
      : null,
    notificationPreferences: Object.entries(resolvedSecurity.notificationPreferences).map(([key, enabled]) => ({
      id: key,
      label: content.labels.notificationTypes[key],
      enabled,
      enabledLabel: enabled ? content.securityView.enabledLabel : content.securityView.disabledLabel,
    })),
    documents: [
      content.documents.privacyPolicy,
      content.documents.userAgreement,
      content.documents.ocrUsage,
      content.documents.communityVisibility,
    ],
  };
}

export function buildNotificationDetailViewModel({
  locale,
  notificationId,
  notifications,
  readNotificationIds = [],
} = {}) {
  const content = getAccountContent(locale);
  const mergedNotifications = mergeAccountNotifications(
    content.notifications,
    notifications || content.notifications,
    readNotificationIds,
  );
  const notification = mergedNotifications.find((entry) => entry.id === notificationId) || null;

  if (!notification) {
    return null;
  }

  return {
    header: content.notificationDetail,
    meta: {
      sourceLabel: content.notificationDetail.sourceLabel,
      timeLabel: content.notificationDetail.timeLabel,
      sourceValue: content.labels.notificationTypes[notification.type],
      timeValue: notification.relativeTime,
      statusLabel: content.labels.notificationStatus[notification.status],
    },
    notification,
  };
}

export function buildExportRequestsViewModel({
  locale,
  exportRequests,
} = {}) {
  const content = getAccountContent(locale);
  const requests = mergeExportRequests(content.exportRequests, exportRequests || []).map((request) => ({
    ...request,
    statusLabel: content.labels.status[request.status],
  }));

  return {
    header: content.exportCenter,
    requests,
    activeRequest: getLatestByDate(requests, 'requestedAt'),
    emptyState: {
      title: content.exportCenter.emptyTitle,
      body: content.exportCenter.emptyBody,
    },
  };
}

export function buildDeleteRequestsViewModel({
  locale,
  deleteRequests,
} = {}) {
  const content = getAccountContent(locale);
  const requests = mergeDeleteRequests(content.deleteRequests, deleteRequests || []).map((request) => ({
    ...request,
    statusLabel: content.labels.status[request.status],
    canWithdraw: ['submitted', 'cooling_off'].includes(request.status),
  }));

  return {
    header: content.deleteCenter,
    requests,
    latestRequest: getLatestByDate(requests, 'submittedAt'),
    emptyState: {
      title: content.deleteCenter.emptyTitle,
      body: content.deleteCenter.emptyBody,
    },
  };
}

export function buildSecurityViewModel({
  locale,
  security,
} = {}) {
  const content = getAccountContent(locale);
  const resolvedSecurity = security || content.security;

  return {
    header: content.securityView,
    binding: {
      label: content.securityView.bindingLabel,
      statusLabel: content.labels.accountBindingStatus[resolvedSecurity.accountBinding],
    },
    ocrAuthorization: {
      label: content.securityView.ocrLabel,
      statusLabel: content.labels.ocrAuthorizationStatus[resolvedSecurity.ocrAuthorization],
    },
    preferences: Object.entries(resolvedSecurity.notificationPreferences).map(([key, enabled]) => ({
      id: key,
      label: content.labels.notificationTypes[key],
      enabled,
      enabledLabel: enabled ? content.securityView.enabledLabel : content.securityView.disabledLabel,
    })),
  };
}

export function buildHelpCenterViewModel({ locale, faqCategories } = {}) {
  const content = getAccountContent(locale);
  return {
    header: content.helpCenter,
    faqCategories: faqCategories || content.faqCategories,
  };
}

export function buildAuditViewModel({ locale } = {}) {
  const content = getAccountContent(locale);
  return {
    header: content.auditView,
    trailItems: [
      {
        id: 'export',
        title: content.documents.auditLog.title,
        body: content.documents.auditLog.body[0],
      },
      {
        id: 'delete',
        title: content.deleteCenter.title,
        body: content.documents.auditLog.body[1],
      },
    ],
  };
}

export { getAccountContent };
