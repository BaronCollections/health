import assert from 'node:assert/strict';
import test from 'node:test';

import { createCommunityApi } from './api.js';

test('createCommunityApi fetches the community feed', async () => {
  const calls = [];
  const api = createCommunityApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            circles: [
              {
                id: 'gut-balance',
              },
            ],
            posts: [
              {
                id: 'post-101',
              },
            ],
          },
        },
      };
    },
  });

  const response = await api.fetchFeed();

  assert.deepEqual(calls, [
    {
      url: '/community/feed',
      method: 'GET',
    },
  ]);
  assert.deepEqual(response, {
    circles: [
      {
        id: 'gut-balance',
      },
    ],
    posts: [
      {
        id: 'post-101',
      },
    ],
  });
});

test('createCommunityApi creates a community post and submits a comment', async () => {
  const calls = [];
  const api = createCommunityApi({
    request: async (payload) => {
      calls.push(payload);

      return {
        data: {
          code: 200,
          data: payload.url.includes('/comment')
            ? {
                id: 'comment-301',
                content: payload.data.content,
              }
            : {
                id: 'post-301',
                content: payload.data.content,
              },
        },
      };
    },
  });

  const post = await api.createPost({
    circleId: 'stress-reset',
    content: 'Testing local API wrapper',
    tags: ['Magnesium'],
    images: [],
  });
  const comment = await api.createComment('post-301', {
    content: 'Following this thread',
  });

  assert.deepEqual(calls, [
    {
      url: '/community/post',
      method: 'POST',
      data: {
        circleId: 'stress-reset',
        content: 'Testing local API wrapper',
        tags: ['Magnesium'],
        images: [],
      },
    },
    {
      url: '/community/post/post-301/comment',
      method: 'POST',
      data: {
        content: 'Following this thread',
      },
    },
  ]);
  assert.equal(post.id, 'post-301');
  assert.equal(comment.id, 'comment-301');
});

test('createCommunityApi fetches moderation queue items by status and submits moderation actions', async () => {
  const calls = [];
  const api = createCommunityApi({
    request: async (payload) => {
      calls.push(payload);

      return {
        data: {
          code: 200,
          data: payload.url.includes('/moderation/post/')
            ? {
                id: 'queue-201',
                targetId: 'post-102',
                targetType: 'post',
                currentStatus: 'approved',
              }
            : {
                status: 'pending_review',
                items: [
                  {
                    id: 'queue-201',
                    targetId: 'post-102',
                    targetType: 'post',
                    currentStatus: 'pending_review',
                  },
                ],
              },
        },
      };
    },
  });

  const queue = await api.fetchModerationQueue('pending_review');
  const decision = await api.moderateItem('post', 'post-102', 'approve', {
    reason: 'Looks compliant',
    reviewerId: 'ops-mini',
  });

  assert.deepEqual(calls, [
    {
      url: '/community/moderation/queue',
      method: 'GET',
      data: {
        status: 'pending_review',
      },
    },
    {
      url: '/community/moderation/post/post-102/approve',
      method: 'POST',
      data: {
        reason: 'Looks compliant',
        reviewerId: 'ops-mini',
      },
    },
  ]);
  assert.equal(queue.items[0].targetId, 'post-102');
  assert.equal(decision.currentStatus, 'approved');
});
