import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCommunityDetailViewModel,
  buildCommunityHomeViewModel,
  buildCommunityMyPostsViewModel,
  buildCommunityReviewViewModel,
  getCommunityContent,
  mergeCommunityPosts,
} from './index.js';

test('buildCommunityHomeViewModel returns localized feed tabs and only public posts', () => {
  const viewModel = buildCommunityHomeViewModel({
    locale: 'en',
  });

  assert.equal(viewModel.header.title, 'Stay consistent with people on the same path');
  assert.equal(viewModel.tabs[0].id, 'recommended');
  assert.equal(viewModel.tabs[0].label, 'Recommended');
  assert.deepEqual(
    viewModel.posts.map((post) => post.id),
    ['post-101'],
  );
  assert.equal(viewModel.timelineBridge.cta, 'Open history timeline');
});

test('mergeCommunityPosts prepends local entries and overlays existing posts by id', () => {
  const basePosts = getCommunityContent('en').seedPosts;
  const merged = mergeCommunityPosts(basePosts, [
    {
      ...basePosts[0],
      id: 'post-local-201',
      content: 'Local pending update',
      status: 'pending_review',
      viewerOwned: true,
      likes: 0,
      saves: 0,
      comments: [],
    },
    {
      ...basePosts[0],
      likes: 88,
    },
  ]);

  assert.equal(merged[0].id, 'post-local-201');
  assert.equal(merged.find((post) => post.id === 'post-101').likes, 88);
});

test('mergeCommunityPosts keeps localized presentation fields when overlaying seeded posts', () => {
  const zhPost = getCommunityContent('zh-CN').seedPosts[0];
  const enPost = {
    ...getCommunityContent('en').seedPosts[0],
    likes: 77,
  };

  const [merged] = mergeCommunityPosts([zhPost], [enPost]);

  assert.equal(merged.authorName, '陈瑜');
  assert.match(merged.content, /早餐/);
  assert.equal(merged.likes, 77);
});

test('buildCommunityDetailViewModel keeps author-visible pending comments on owned posts', () => {
  const viewModel = buildCommunityDetailViewModel({
    locale: 'zh-CN',
    postId: 'post-102',
    posts: getCommunityContent('zh-CN').seedPosts,
  });

  assert.equal(viewModel.post.id, 'post-102');
  assert.equal(viewModel.comments.length, 1);
  assert.match(viewModel.statusLabel, /审核中/);
});

test('buildCommunityMyPostsViewModel groups viewer owned posts by moderation status', () => {
  const viewModel = buildCommunityMyPostsViewModel({
    locale: 'en',
    posts: getCommunityContent('en').seedPosts,
    activeStatus: 'flagged',
  });

  assert.equal(viewModel.header.title, 'My posts');
  assert.equal(viewModel.tabs.find((tab) => tab.id === 'pending_review').count, 1);
  assert.equal(viewModel.tabs.find((tab) => tab.id === 'rejected').count, 1);
  assert.deepEqual(
    viewModel.posts.map((post) => post.id),
    ['post-104'],
  );
});

test('buildCommunityReviewViewModel groups moderation queue items by status and exposes localized actions', () => {
  const content = getCommunityContent('zh-CN');
  const viewModel = buildCommunityReviewViewModel({
    locale: 'zh-CN',
    items: content.reviewQueue,
    activeStatus: 'pending_review',
  });

  assert.equal(viewModel.header.title, '社区审核');
  assert.equal(viewModel.tabs.find((tab) => tab.id === 'pending_review').count, 1);
  assert.equal(viewModel.items[0].targetTypeLabel, '帖子');
  assert.deepEqual(
    viewModel.items[0].actions.map((action) => action.id),
    ['approve', 'reject', 'flag'],
  );
});
