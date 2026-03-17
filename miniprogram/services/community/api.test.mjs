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
