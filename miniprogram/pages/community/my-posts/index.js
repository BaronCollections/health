import { COMMUNITY_ROUTES } from '../../../../config/routes.js';
import { createCommunityApi } from '../../../../services/community/api.js';
import {
  buildCommunityMyPostsViewModel,
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
    activeStatus: 'pending_review',
    viewModel: null,
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();

    this.setData({
      activeStatus: query.status || 'pending_review',
    });
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
    void this.refreshPosts();
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

  async refreshPosts(locale = this.data.locale) {
    const content = getCommunityContent(locale);
    let basePosts = content.seedPosts;

    try {
      const response = await this.communityApi.fetchMyPosts();
      basePosts = mergeCommunityPosts(content.seedPosts, response.posts || []);
    } catch {
      basePosts = content.seedPosts;
    }

    this.sourcePosts = mergeCommunityPosts(basePosts, communityStateStore.read().posts);
    this.applyViewModel(locale);
  },

  applyViewModel(locale = this.data.locale) {
    this.setData({
      viewModel: buildCommunityMyPostsViewModel({
        locale,
        posts: this.sourcePosts,
        activeStatus: this.data.activeStatus,
      }),
    });
  },

  handleTabChange(event) {
    this.setData(
      {
        activeStatus: event.currentTarget.dataset.status,
      },
      () => {
        this.applyViewModel();
      },
    );
  },

  handleOpenPost(event) {
    wx.navigateTo({
      url: `${COMMUNITY_ROUTES.detail}?postId=${event.currentTarget.dataset.postId}`,
    });
  },

  handleOpenCreate() {
    wx.navigateTo({
      url: COMMUNITY_ROUTES.create,
    });
  },
});
