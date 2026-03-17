import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCommunityStateStore,
  createInitialCommunityState,
} from './session.js';

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

test('createCommunityStateStore persists upserted posts and appended comments', () => {
  const store = createCommunityStateStore({
    storage: createMemoryStorage(),
  });

  const state = store.upsertPost({
    id: 'post-local-301',
    authorName: 'Xiaoya',
    authorAvatar: 'X',
    authorRole: 'Particle assistant user',
    viewerOwned: true,
    circleId: 'gut-balance',
    circleName: 'Gut balance',
    status: 'pending_review',
    relativeTime: 'Just now',
    content: 'Local post',
    tags: ['Fiber'],
    images: [],
    likes: 0,
    saves: 0,
    comments: [],
    moderationReason: 'Queued for review.',
  });

  assert.equal(state.posts.length, 1);

  const next = store.appendComment('post-local-301', {
    id: 'comment-local-301',
    authorName: 'Xiaoya',
    authorAvatar: 'X',
    authorRole: 'Particle assistant user',
    viewerOwned: true,
    status: 'pending_review',
    relativeTime: 'Just now',
    content: 'First comment',
    likes: 0,
    moderationReason: 'Queued for moderation.',
  });

  assert.equal(next.posts[0].comments.length, 1);
  assert.equal(store.read().posts[0].comments[0].id, 'comment-local-301');
});

test('createInitialCommunityState returns an empty local overlay state', () => {
  const state = createInitialCommunityState();

  assert.deepEqual(state, {
    posts: [],
  });
});
