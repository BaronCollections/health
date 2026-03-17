const COMMUNITY_STATE_STORAGE_KEY = 'mintbit.community.state';

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
    clear() {
      adapter.removeItem(COMMUNITY_STATE_STORAGE_KEY);
      return createInitialCommunityState();
    },
  };
}

export { COMMUNITY_STATE_STORAGE_KEY };
