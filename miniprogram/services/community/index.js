import { getCommunityContent } from './content.js';

const POST_STATUSES_BY_AUDIENCE = {
  public: ['approved'],
  author: ['approved', 'pending_review', 'rejected', 'flagged'],
  ops: ['draft', 'pending_review', 'approved', 'rejected', 'flagged', 'hidden'],
};

const COMMENT_STATUSES_BY_AUDIENCE = {
  public: ['approved'],
  author: ['approved', 'pending_review', 'rejected'],
  ops: ['approved', 'pending_review', 'rejected', 'hidden'],
};

const MY_POST_TABS = ['pending_review', 'approved', 'rejected', 'flagged'];

function clonePost(post) {
  return {
    ...post,
    tags: [...(post.tags || [])],
    images: [...(post.images || [])],
    comments: (post.comments || []).map((comment) => ({
      ...comment,
    })),
  };
}

function mergeLocalizedComment(baseComment, overlayComment) {
  if (!baseComment) {
    return {
      ...overlayComment,
    };
  }

  return {
    id: overlayComment.id || baseComment.id,
    authorName: baseComment.authorName || overlayComment.authorName,
    authorAvatar: baseComment.authorAvatar || overlayComment.authorAvatar,
    authorRole: baseComment.authorRole || overlayComment.authorRole,
    viewerOwned: overlayComment.viewerOwned ?? baseComment.viewerOwned,
    status: overlayComment.status || baseComment.status,
    relativeTime: baseComment.relativeTime || overlayComment.relativeTime,
    content: baseComment.content || overlayComment.content,
    likes: overlayComment.likes ?? baseComment.likes,
    moderationReason: baseComment.moderationReason || overlayComment.moderationReason,
  };
}

function mergeLocalizedPost(basePost, overlayPost) {
  if (!basePost) {
    return clonePost(overlayPost);
  }

  const baseComments = basePost.comments || [];
  const overlayComments = overlayPost.comments || [];
  const mergedComments = [
    ...overlayComments
      .filter((comment) => !baseComments.some((entry) => entry.id === comment.id))
      .map((comment) => ({
        ...comment,
      })),
    ...baseComments.map((comment) => {
      const overlayComment = overlayComments.find((entry) => entry.id === comment.id);
      return mergeLocalizedComment(comment, overlayComment || comment);
    }),
  ];

  return {
    id: overlayPost.id || basePost.id,
    authorName: basePost.authorName || overlayPost.authorName,
    authorAvatar: basePost.authorAvatar || overlayPost.authorAvatar,
    authorRole: basePost.authorRole || overlayPost.authorRole,
    viewerOwned: overlayPost.viewerOwned ?? basePost.viewerOwned,
    circleId: overlayPost.circleId || basePost.circleId,
    circleName: basePost.circleName || overlayPost.circleName,
    status: overlayPost.status || basePost.status,
    relativeTime: basePost.relativeTime || overlayPost.relativeTime,
    content: basePost.content || overlayPost.content,
    tags: (basePost.tags && basePost.tags.length ? basePost.tags : overlayPost.tags) || [],
    images: overlayPost.images || basePost.images || [],
    likes: overlayPost.likes ?? basePost.likes,
    saves: overlayPost.saves ?? basePost.saves,
    comments: mergedComments,
    moderationReason: basePost.moderationReason || overlayPost.moderationReason,
  };
}

function filterByStatus(items, allowedStatuses) {
  const allowed = new Set(allowedStatuses);
  return items.filter((item) => allowed.has(item.status));
}

export function filterPostsForAudience(posts, audience) {
  return filterByStatus(posts || [], POST_STATUSES_BY_AUDIENCE[audience] || POST_STATUSES_BY_AUDIENCE.public);
}

export function filterCommentsForAudience(comments, audience) {
  return filterByStatus(comments || [], COMMENT_STATUSES_BY_AUDIENCE[audience] || COMMENT_STATUSES_BY_AUDIENCE.public);
}

export function mergeCommunityPosts(basePosts = [], overlayPosts = []) {
  const overlayMap = new Map(overlayPosts.map((post) => [post.id, clonePost(post)]));
  const extraPosts = overlayPosts
    .filter((post) => !basePosts.some((entry) => entry.id === post.id))
    .map((post) => clonePost(post));
  const mergedBase = basePosts.map((post) => {
    const overlayPost = overlayMap.get(post.id);
    return overlayPost ? mergeLocalizedPost(post, overlayPost) : clonePost(post);
  });

  return [...extraPosts, ...mergedBase];
}

function mapCircleChip(circle, locale, selectedCircleId) {
  return {
    ...circle,
    memberLabel: locale === 'zh-CN' ? `${circle.members.toLocaleString()} 人` : `${circle.members.toLocaleString()} members`,
    selected: circle.id === selectedCircleId,
  };
}

function mapPostCard(content, post) {
  return {
    ...post,
    commentCount: (post.comments || []).length,
    statusLabel: content.statuses[post.status],
    tagLine: (post.tags || []).join(' · '),
  };
}

export function getPublicCommunityPosts(locale, posts = getCommunityContent(locale).seedPosts) {
  return filterPostsForAudience(mergeCommunityPosts([], posts), 'public').map((post) => ({
    ...clonePost(post),
    comments: filterCommentsForAudience(post.comments || [], 'public'),
  }));
}

export function getViewerCommunityPosts(locale, posts = getCommunityContent(locale).seedPosts) {
  return filterPostsForAudience(
    mergeCommunityPosts([], posts).filter((post) => post.viewerOwned),
    'author',
  ).map((post) => ({
    ...clonePost(post),
    comments: filterCommentsForAudience(post.comments || [], 'author'),
  }));
}

export function buildCommunityHomeViewModel({
  locale,
  posts,
  selectedCircleId = 'all',
  activeTab = 'recommended',
} = {}) {
  const content = getCommunityContent(locale);
  const feedPosts = getPublicCommunityPosts(locale, posts || content.seedPosts).filter(
    (post) => selectedCircleId === 'all' || post.circleId === selectedCircleId,
  );

  return {
    header: {
      title: content.home.title,
      subtitle: content.home.subtitle,
      createCta: content.home.createCta,
      myPostsCta: content.home.myPostsCta,
    },
    metaLabels: {
      likes: locale === 'zh-CN' ? '点赞' : 'likes',
      comments: locale === 'zh-CN' ? '评论' : 'comments',
      saves: locale === 'zh-CN' ? '收藏' : 'saves',
    },
    tabs: [
      { id: 'recommended', label: content.home.recommendedTab, active: activeTab === 'recommended' },
      { id: 'circles', label: content.home.circlesTab, active: activeTab === 'circles' },
    ],
    activeTab,
    selectedCircleId,
    circles: [
      {
        id: 'all',
        name: content.home.allCircles,
        description: content.home.subtitle,
        memberLabel: '',
        selected: selectedCircleId === 'all',
      },
      ...content.circles.map((circle) => mapCircleChip(circle, locale, selectedCircleId)),
    ],
    circleCards: content.circles.map((circle) => mapCircleChip(circle, locale, selectedCircleId)),
    posts: feedPosts.map((post) => mapPostCard(content, post)),
    emptyState: {
      title: content.home.emptyTitle,
      body: content.home.emptyBody,
    },
    timelineBridge: content.home.timelineBridge,
  };
}

export function buildCommunityCreateViewModel({ locale, selectedCircleId } = {}) {
  const content = getCommunityContent(locale);
  const suggestedTags = Array.from(
    new Set(
      content.seedPosts
        .filter((post) => !selectedCircleId || selectedCircleId === 'all' || post.circleId === selectedCircleId)
        .flatMap((post) => post.tags || []),
    ),
  ).slice(0, 6);

  return {
    header: {
      title: content.create.title,
      subtitle: content.create.subtitle,
    },
    fields: {
      circleLabel: content.create.circleLabel,
      contentLabel: content.create.contentLabel,
      contentPlaceholder: content.create.contentPlaceholder,
      tagsLabel: content.create.tagsLabel,
    },
    actions: {
      submit: content.create.submit,
    },
    tips: {
      imageHint: content.create.imageHint,
      pendingHint: content.create.pendingHint,
    },
    circles: content.circles.map((circle) => ({
      ...circle,
      selected: circle.id === selectedCircleId,
    })),
    tagOptions: suggestedTags.map((tag) => ({
      id: tag,
      label: tag,
    })),
  };
}

export function buildCommunityDetailViewModel({ locale, postId, posts } = {}) {
  const content = getCommunityContent(locale);
  const availablePosts = mergeCommunityPosts([], posts || content.seedPosts);
  const source = availablePosts.find((post) => post.id === postId) || null;

  if (!source) {
    return null;
  }

  const audience = source.viewerOwned ? 'author' : 'public';
  const post = filterPostsForAudience([source], audience)[0];

  if (!post) {
    return null;
  }

  return {
    post: mapPostCard(content, {
      ...clonePost(post),
      comments: filterCommentsForAudience(post.comments || [], audience),
    }),
    statusLabel: content.statuses[post.status],
    comments: filterCommentsForAudience(post.comments || [], audience).map((comment) => ({
      ...comment,
      statusLabel: content.statuses[comment.status] || comment.status,
    })),
    header: {
      backCta: content.detail.backCta,
      commentsTitle: content.detail.commentsTitle,
    },
    actions: {
      like: content.detail.like,
      save: content.detail.save,
      submitComment: content.detail.submitComment,
    },
    metaLabels: {
      likes: locale === 'zh-CN' ? '点赞' : 'likes',
    },
    commentPlaceholder: content.detail.commentPlaceholder,
    emptyComments: content.detail.noComments,
  };
}

export function buildCommunityMyPostsViewModel({ locale, posts, activeStatus = 'pending_review' } = {}) {
  const content = getCommunityContent(locale);
  const viewerPosts = getViewerCommunityPosts(locale, posts || content.seedPosts);
  const counts = Object.fromEntries(MY_POST_TABS.map((status) => [status, 0]));

  for (const post of viewerPosts) {
    counts[post.status] = (counts[post.status] || 0) + 1;
  }

  return {
    header: {
      title: content.myPosts.title,
      subtitle: content.myPosts.subtitle,
    },
    tabs: MY_POST_TABS.map((status) => ({
      id: status,
      label: content.myPosts.tabs[status],
      count: counts[status] || 0,
      active: status === activeStatus,
    })),
    activeStatus,
    posts: viewerPosts
      .filter((post) => post.status === activeStatus)
      .map((post) => mapPostCard(content, post)),
    emptyState: {
      title: content.myPosts.emptyTitle,
      body: content.myPosts.emptyBody,
    },
    resubmitLabel: content.myPosts.resubmit,
  };
}

export function createFallbackCommunityPost(locale, input = {}) {
  const content = getCommunityContent(locale);
  const circle = content.circles.find((entry) => entry.id === input.circleId) || content.circles[0];

  return {
    id: `post-local-${Date.now()}`,
    authorName: input.authorName || (locale === 'zh-CN' ? '小雅' : 'Xiaoya'),
    authorAvatar: input.authorAvatar || (locale === 'zh-CN' ? '雅' : 'X'),
    authorRole: input.authorRole || (locale === 'zh-CN' ? '粒子助手用户' : 'Particle assistant user'),
    viewerOwned: true,
    circleId: circle.id,
    circleName: circle.name,
    status: 'pending_review',
    relativeTime: locale === 'zh-CN' ? '刚刚' : 'Just now',
    content: input.content || '',
    tags: input.tags || [],
    images: input.images || [],
    likes: 0,
    saves: 0,
    comments: [],
    moderationReason: content.create.pendingHint,
  };
}

export function createFallbackCommunityComment(locale, input = {}) {
  return {
    id: `comment-local-${Date.now()}`,
    authorName: input.authorName || (locale === 'zh-CN' ? '小雅' : 'Xiaoya'),
    authorAvatar: input.authorAvatar || (locale === 'zh-CN' ? '雅' : 'X'),
    authorRole: input.authorRole || (locale === 'zh-CN' ? '粒子助手用户' : 'Particle assistant user'),
    viewerOwned: true,
    status: 'pending_review',
    relativeTime: locale === 'zh-CN' ? '刚刚' : 'Just now',
    content: input.content || '',
    likes: 0,
    moderationReason: locale === 'zh-CN' ? '评论已进入审核队列。' : 'Comment queued for moderation.',
  };
}

export { getCommunityContent };
