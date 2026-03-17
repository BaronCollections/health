function unwrapResult(response) {
  const rawPayload = response?.data;
  const payload = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;

  if (!payload) {
    throw new Error('Empty response payload');
  }

  if (payload.code !== 200) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

export function createAccountApi({ request } = {}) {
  if (!request) {
    throw new Error('Request function is required');
  }

  return {
    async fetchNotifications(filter = 'all') {
      return unwrapResult(
        await request({
          url: '/account/notifications',
          method: 'GET',
          data: filter === 'all' ? undefined : { type: filter },
        }),
      );
    },

    async getNotification(notificationId) {
      return unwrapResult(
        await request({
          url: `/account/notifications/${notificationId}`,
          method: 'GET',
        }),
      );
    },

    async markNotificationRead(notificationId) {
      return unwrapResult(
        await request({
          url: `/account/notifications/${notificationId}/read`,
          method: 'POST',
        }),
      );
    },

    async markNotificationsRead(ids) {
      return unwrapResult(
        await request({
          url: '/account/notifications/read-batch',
          method: 'POST',
          data: { ids },
        }),
      );
    },

    async fetchFaqCategories() {
      return unwrapResult(
        await request({
          url: '/account/help/faq',
          method: 'GET',
        }),
      );
    },

    async fetchFeedbackRecords() {
      return unwrapResult(
        await request({
          url: '/account/help/feedback/records',
          method: 'GET',
        }),
      );
    },

    async createFeedback(payload) {
      return unwrapResult(
        await request({
          url: '/account/help/feedback',
          method: 'POST',
          data: payload,
        }),
      );
    },

    async fetchExportRequests() {
      return unwrapResult(
        await request({
          url: '/account/privacy/export',
          method: 'GET',
        }),
      );
    },

    async createExportRequest(payload) {
      return unwrapResult(
        await request({
          url: '/account/privacy/export',
          method: 'POST',
          data: payload,
        }),
      );
    },

    async fetchDeleteRequests() {
      return unwrapResult(
        await request({
          url: '/account/privacy/delete-request',
          method: 'GET',
        }),
      );
    },

    async createDeleteRequest(payload) {
      return unwrapResult(
        await request({
          url: '/account/privacy/delete-request',
          method: 'POST',
          data: payload,
        }),
      );
    },

    async fetchSecuritySnapshot() {
      return unwrapResult(
        await request({
          url: '/account/security',
          method: 'GET',
        }),
      );
    },
  };
}
