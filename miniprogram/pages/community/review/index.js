import { COMMUNITY_ROUTES, PROFILE_ROUTES } from '../../../../config/routes.js';
import { resolveAdminState } from '../../../../services/account/runtime.js';
import { createCommunityApi } from '../../../../services/community/api.js';
import {
  buildCommunityReviewViewModel,
  getCommunityContent,
  mergeModerationQueue,
} from '../../../../services/community/index.js';
import { createCommunityStateStore } from '../../../../services/community/session.js';
import { createRequestClient } from '../../../../services/request/client.js';

const communityStateStore = createCommunityStateStore();
const NEXT_STATUS_BY_ACTION = {
  approve: 'approved',
  reject: 'rejected',
  flag: 'flagged',
  restore: 'pending_review',
};

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    activeStatus: 'pending_review',
    isAdmin: false,
    busyTargetId: '',
    viewModel: null,
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();
    this.communityApi = createCommunityApi({
      request: createRequestClient({
        getLocale: () => appStore.getSnapshot().locale,
        getSession: () => authStore.getSnapshot(),
      }),
    });

    this.setData({
      activeStatus: query.status || 'pending_review',
    });

    this.unsubscribeApp = appStore.subscribe((snapshot) => {
      this.applyAppSnapshot(snapshot);
    });
    this.unsubscribeAuth = authStore.subscribe((snapshot) => {
      this.applyAuthSnapshot(snapshot);
    });

    this.applyAppSnapshot(appStore.hydrate());
    this.applyAuthSnapshot(authStore.hydrate());
  },

  onShow() {
    if (!this.guardAdminAccess()) {
      return;
    }

    void this.refreshQueue();
  },

  onUnload() {
    this.unsubscribeApp?.();
    this.unsubscribeAuth?.();
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
    });

    const seedItems = mergeModerationQueue(
      getCommunityContent(snapshot.locale).reviewQueue,
      communityStateStore.read().reviewQueue,
    );
    this.sourceItems = seedItems;
    this.applyViewModel(snapshot.locale);
  },

  applyAuthSnapshot(snapshot) {
    const { isAdmin } = resolveAdminState(snapshot.userProfile);
    this.authSnapshot = snapshot;
    this.setData({ isAdmin });
  },

  guardAdminAccess() {
    if (this.data.isAdmin) {
      return true;
    }

    wx.showToast({
      icon: 'none',
      title: this.data.locale === 'zh-CN' ? '仅管理员可访问' : 'Admin access only',
    });
    wx.switchTab({
      url: PROFILE_ROUTES.index,
    });
    return false;
  },

  applyViewModel(locale = this.data.locale) {
    this.setData({
      viewModel: buildCommunityReviewViewModel({
        locale,
        items: this.sourceItems,
        activeStatus: this.data.activeStatus,
      }),
    });
  },

  async refreshQueue(locale = this.data.locale) {
    const seedItems = mergeModerationQueue(
      getCommunityContent(locale).reviewQueue,
      communityStateStore.read().reviewQueue,
    );

    try {
      const response = await this.communityApi.fetchModerationQueue(this.data.activeStatus);
      this.sourceItems = mergeModerationQueue(seedItems, response.items || []);
    } catch {
      this.sourceItems = seedItems;
    }

    this.applyViewModel(locale);
  },

  handleTabChange(event) {
    this.setData(
      {
        activeStatus: event.currentTarget.dataset.status,
      },
      () => {
        void this.refreshQueue();
      },
    );
  },

  async handleModerationAction(event) {
    const { targetId, targetType, action } = event.currentTarget.dataset;
    const locale = this.data.locale;
    const reviewerId =
      this.authSnapshot?.userProfile?.phone ||
      this.authSnapshot?.userProfile?.nickname ||
      String(this.authSnapshot?.userProfile?.id || 'ops-mini');
    const nextStatus = NEXT_STATUS_BY_ACTION[action];
    const fallbackPosts = getCommunityContent(locale).seedPosts;
    const fallbackQueue = this.sourceItems || getCommunityContent(locale).reviewQueue;
    const currentItem = (this.sourceItems || []).find((item) => item.targetId === targetId);

    if (!nextStatus || !currentItem) {
      return;
    }

    this.setData({
      busyTargetId: targetId,
    });

    const optimisticState = communityStateStore.applyModerationDecision({
      targetType,
      targetId,
      nextStatus,
      moderationReason: currentItem.moderationReason,
      fallbackPosts,
      fallbackQueue,
    });
    this.sourceItems = mergeModerationQueue(fallbackQueue, optimisticState.reviewQueue);
    this.applyViewModel(locale);

    try {
      const updated = await this.communityApi.moderateItem(targetType, targetId, action, {
        reason: currentItem.moderationReason,
        reviewerId,
      });
      const syncedState = communityStateStore.applyModerationDecision({
        targetType,
        targetId,
        nextStatus: updated.currentStatus || nextStatus,
        moderationReason: updated.moderationReason || currentItem.moderationReason,
        fallbackPosts,
        fallbackQueue: mergeModerationQueue(fallbackQueue, optimisticState.reviewQueue),
      });
      this.sourceItems = mergeModerationQueue(fallbackQueue, syncedState.reviewQueue);
      this.applyViewModel(locale);
    } catch {
      // Keep the optimistic local state when the backend contract is unavailable.
    } finally {
      this.setData({
        busyTargetId: '',
      });
    }
  },

  handleOpenCommunity() {
    wx.switchTab({
      url: COMMUNITY_ROUTES.index,
    });
  },
});
