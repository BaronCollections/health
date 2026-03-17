import { COMMUNITY_ROUTES, REPORT_ROUTES } from '../../../config/routes.js';
import { createCommunityApi } from '../../../services/community/api.js';
import {
  buildCommunityHomeViewModel,
  getCommunityContent,
  mergeCommunityPosts,
} from '../../../services/community/index.js';
import { createCommunityStateStore } from '../../../services/community/session.js';
import { createRequestClient } from '../../../services/request/client.js';

const communityStateStore = createCommunityStateStore();

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    viewModel: null,
    activeTab: 'recommended',
    selectedCircleId: 'all',
  },

  onLoad() {
    const { appStore, authStore } = getStores();

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
    this.getTabBar()?.setActive(COMMUNITY_ROUTES.index);
    void this.refreshFeed();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applySnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
    });

    if (this.sourcePosts) {
      this.applyViewModel(snapshot.locale);
    }
  },

  async refreshFeed(locale = this.data.locale) {
    const content = getCommunityContent(locale);
    let basePosts = content.seedPosts;

    try {
      const response = await this.communityApi.fetchFeed();
      basePosts = mergeCommunityPosts(content.seedPosts, response.posts || []);
    } catch {
      basePosts = content.seedPosts;
    }

    this.sourcePosts = mergeCommunityPosts(basePosts, communityStateStore.read().posts);
    this.applyViewModel(locale);
  },

  applyViewModel(locale = this.data.locale) {
    this.setData({
      viewModel: buildCommunityHomeViewModel({
        locale,
        posts: this.sourcePosts,
        activeTab: this.data.activeTab,
        selectedCircleId: this.data.selectedCircleId,
      }),
    });
  },

  handleTabChange(event) {
    this.setData(
      {
        activeTab: event.currentTarget.dataset.tab,
      },
      () => {
        this.applyViewModel();
      },
    );
  },

  handleCircleChange(event) {
    this.setData(
      {
        selectedCircleId: event.currentTarget.dataset.circleId,
      },
      () => {
        this.applyViewModel();
      },
    );
  },

  handleOpenCreate() {
    wx.navigateTo({
      url: `${COMMUNITY_ROUTES.create}?circleId=${this.data.selectedCircleId}`,
    });
  },

  handleOpenMyPosts() {
    wx.navigateTo({
      url: COMMUNITY_ROUTES.myPosts,
    });
  },

  handleOpenTimeline() {
    wx.navigateTo({
      url: REPORT_ROUTES.timeline,
    });
  },

  handleOpenPost(event) {
    wx.navigateTo({
      url: `${COMMUNITY_ROUTES.detail}?postId=${event.currentTarget.dataset.postId}`,
    });
  },

  handlePreviewPostImages(event) {
    const postId = event.currentTarget.dataset.postId;
    const current = event.currentTarget.dataset.imagePath;
    const post = this.sourcePosts?.find((entry) => entry.id === postId);
    const urls = (post?.images || []).map((image) => image.tempFilePath).filter(Boolean);

    if (!current || !urls.length) {
      return;
    }

    wx.previewImage({
      current,
      urls,
    });
  },
});
