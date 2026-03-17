import { COMMUNITY_ROUTES } from '../../../../config/routes.js';
import { createCommunityApi } from '../../../../services/community/api.js';
import {
  buildCommunityDetailViewModel,
  createFallbackCommunityComment,
  getCommunityContent,
  mergeCommunityPosts,
} from '../../../../services/community/index.js';
import { createCommunityStateStore } from '../../../../services/community/session.js';
import { createRequestClient } from '../../../../services/request/client.js';

const communityStateStore = createCommunityStateStore();

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    viewModel: null,
    commentValue: '',
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();

    this.postId = query.postId;
    this.communityApi = createCommunityApi({
      request: createRequestClient({
        getLocale: () => appStore.getSnapshot().locale,
        getSession: () => authStore.getSnapshot(),
      }),
    });

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot);
    });

    this.applySnapshot(appStore.hydrate());
  },

  onShow() {
    void this.refreshDetail();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applySnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
    });
  },

  async refreshDetail(locale = this.data.locale) {
    const content = getCommunityContent(locale);
    let basePosts = content.seedPosts;

    try {
      const detail = await this.communityApi.getPostDetail(this.postId);
      if (detail) {
        basePosts = mergeCommunityPosts(content.seedPosts, [detail]);
      }
    } catch {
      basePosts = content.seedPosts;
    }

    this.sourcePosts = mergeCommunityPosts(basePosts, communityStateStore.read().posts);
    this.setData({
      viewModel: buildCommunityDetailViewModel({
        locale,
        postId: this.postId,
        posts: this.sourcePosts,
      }),
    });
  },

  getCurrentPost() {
    return this.sourcePosts?.find((post) => post.id === this.postId) || null;
  },

  handleCommentInput(event) {
    this.setData({
      commentValue: event.detail.value,
    });
  },

  async handleLike() {
    const currentPost = this.getCurrentPost();

    if (!currentPost) {
      return;
    }

    let updatedPost;

    try {
      updatedPost = await this.communityApi.likePost(this.postId);
    } catch {
      updatedPost = {
        ...currentPost,
        likes: currentPost.likes + 1,
      };
    }

    communityStateStore.upsertPost(updatedPost);
    await this.refreshDetail();
  },

  async handleSave() {
    const currentPost = this.getCurrentPost();

    if (!currentPost) {
      return;
    }

    let updatedPost;

    try {
      updatedPost = await this.communityApi.savePost(this.postId);
    } catch {
      updatedPost = {
        ...currentPost,
        saves: currentPost.saves + 1,
      };
    }

    communityStateStore.upsertPost(updatedPost);
    await this.refreshDetail();
  },

  handlePreviewPostImages(event) {
    const current = event.currentTarget.dataset.imagePath;
    const urls = (this.data.viewModel?.post?.images || []).map((image) => image.tempFilePath).filter(Boolean);

    if (!current || !urls.length) {
      return;
    }

    wx.previewImage({
      current,
      urls,
    });
  },

  async handleSubmitComment() {
    const currentPost = this.getCurrentPost();
    const content = this.data.commentValue.trim();

    if (!currentPost || !content) {
      return;
    }

    let comment;

    try {
      comment = await this.communityApi.createComment(this.postId, {
        content,
      });
    } catch {
      comment = createFallbackCommunityComment(this.data.locale, {
        content,
      });
    }

    communityStateStore.upsertPost({
      ...currentPost,
      comments: [...(currentPost.comments || []), comment],
    });
    this.setData({
      commentValue: '',
    });
    await this.refreshDetail();
  },

  handleBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: COMMUNITY_ROUTES.index,
        });
      },
    });
  },
});
