const COMMUNITY_STATE_STORAGE_KEY = 'mintbit.community.state';

function cloneComment(comment) {
  return {
    ...comment,
  };
}

function clonePost(post) {
  return {
    ...post,
    tags: [...(post.tags || [])],
    images: [...(post.images || [])],
    comments: (post.comments || []).map((comment) => cloneComment(comment)),
  };
}

function cloneReviewItem(item) {
  return {
    ...item,
  };
}

function createStorageAdapter(storage) {
  if (storage) {
    return storage;
  }

  return {
    getItem(key) {
      return globalThis.wx?.getStorageSync?.(key) || null;
    },
    setItem(key, value) {
      globalThis.wx?.setStorageSync?.(key, value);
    },
    removeItem(key) {
      globalThis.wx?.removeStorageSync?.(key);
    },
  };
}

export function createInitialCommunityState() {
  return {
    posts: [],
    reviewQueue: [],
  };
}

function parseState(rawValue) {
  if (!rawValue) {
    return createInitialCommunityState();
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      ...createInitialCommunityState(),
      ...parsed,
      posts: Array.isArray(parsed?.posts) ? parsed.posts : [],
      reviewQueue: Array.isArray(parsed?.reviewQueue) ? parsed.reviewQueue : [],
    };
  } catch {
    return createInitialCommunityState();
  }
}

function saveState(storage, state) {
  storage.setItem(COMMUNITY_STATE_STORAGE_KEY, JSON.stringify(state));
  return state;
}

function upsertPost(posts, post) {
  const nextPosts = posts.filter((entry) => entry.id !== post.id);
  return [post, ...nextPosts];
}

function upsertReviewItem(items, item) {
  const nextItems = items.filter((entry) => entry.targetId !== item.targetId);
  return [item, ...nextItems];
}

function findOwningPost(posts, targetType, targetId) {
  if (targetType === 'post') {
    return posts.find((post) => post.id === targetId) || null;
  }

  return (
    posts.find((post) => (post.comments || []).some((comment) => comment.id === targetId)) || null
  );
}

function applyDecisionToPost(post, { targetType, targetId, nextStatus, moderationReason }) {
  if (targetType === 'post') {
    return {
      ...clonePost(post),
      status: nextStatus,
      moderationReason,
    };
  }

  return {
    ...clonePost(post),
    comments: (post.comments || []).map((comment) =>
      comment.id === targetId
        ? {
            ...cloneComment(comment),
            status: nextStatus,
            moderationReason,
          }
        : cloneComment(comment),
    ),
  };
}

export function createCommunityStateStore({ storage } = {}) {
  const adapter = createStorageAdapter(storage);

  return {
    read() {
      return parseState(adapter.getItem(COMMUNITY_STATE_STORAGE_KEY));
    },
    save(state) {
      return saveState(adapter, {
        ...createInitialCommunityState(),
        ...state,
        posts: Array.isArray(state?.posts) ? state.posts : [],
        reviewQueue: Array.isArray(state?.reviewQueue) ? state.reviewQueue : [],
      });
    },
    upsertPost(post) {
      const current = this.read();
      return this.save({
        ...current,
        posts: upsertPost(current.posts, post),
      });
    },
    appendComment(postId, comment) {
      const current = this.read();
      return this.save({
        ...current,
        posts: current.posts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          return {
            ...post,
            comments: [...(post.comments || []), comment],
          };
        }),
      });
    },
    upsertReviewItem(item) {
      const current = this.read();
      return this.save({
        ...current,
        reviewQueue: upsertReviewItem(current.reviewQueue, item),
      });
    },
    applyModerationDecision({
      targetType,
      targetId,
      nextStatus,
      moderationReason,
      fallbackPosts = [],
      fallbackQueue = [],
    }) {
      const current = this.read();
      const fallbackItem = fallbackQueue.find((item) => item.targetId === targetId);
      const queueItem = {
        ...(fallbackItem ? cloneReviewItem(fallbackItem) : {
          id: `queue-local-${targetId}`,
          targetId,
          targetType,
          authorName: '',
          authorAvatar: '',
          circleName: '',
          relativeTime: '',
          contentPreview: '',
          moderationReason: '',
        }),
        currentStatus: nextStatus,
        moderationReason: moderationReason || fallbackItem?.moderationReason || '',
      };
      const basePost = findOwningPost(current.posts, targetType, targetId) || findOwningPost(fallbackPosts, targetType, targetId);
      const nextPosts = basePost
        ? upsertPost(
            current.posts,
            applyDecisionToPost(basePost, {
              targetType,
              targetId,
              nextStatus,
              moderationReason: moderationReason || queueItem.moderationReason,
            }),
          )
        : current.posts;

      return this.save({
        ...current,
        posts: nextPosts,
        reviewQueue: upsertReviewItem(current.reviewQueue, queueItem),
      });
    },
    clear() {
      adapter.removeItem(COMMUNITY_STATE_STORAGE_KEY);
      return createInitialCommunityState();
    },
  };
}

export { COMMUNITY_STATE_STORAGE_KEY };
