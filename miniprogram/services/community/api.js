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

export function createCommunityApi({ request } = {}) {
  if (!request) {
    throw new Error('Request function is required');
  }

  return {
    async fetchFeed() {
      return unwrapResult(await request({
        url: '/community/feed',
        method: 'GET',
      }));
    },

    async getPostDetail(postId) {
      return unwrapResult(await request({
        url: `/community/post/${postId}`,
        method: 'GET',
      }));
    },

    async fetchMyPosts() {
      return unwrapResult(await request({
        url: '/community/me/posts',
        method: 'GET',
      }));
    },

    async createPost(payload) {
      return unwrapResult(await request({
        url: '/community/post',
        method: 'POST',
        data: payload,
      }));
    },

    async createComment(postId, payload) {
      return unwrapResult(await request({
        url: `/community/post/${postId}/comment`,
        method: 'POST',
        data: payload,
      }));
    },

    async likePost(postId) {
      return unwrapResult(await request({
        url: `/community/post/${postId}/like`,
        method: 'POST',
      }));
    },

    async savePost(postId) {
      return unwrapResult(await request({
        url: `/community/post/${postId}/save`,
        method: 'POST',
      }));
    },

    async fetchModerationQueue(status) {
      return unwrapResult(await request({
        url: '/community/moderation/queue',
        method: 'GET',
        data: status ? { status } : undefined,
      }));
    },

    async moderateItem(targetType, targetId, action, payload) {
      return unwrapResult(await request({
        url: `/community/moderation/${targetType}/${targetId}/${action}`,
        method: 'POST',
        data: payload,
      }));
    },
  };
}
