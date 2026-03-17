import { PROFILE_ROUTES } from '../../../../config/routes.js';
import { getAccountContent, buildNotificationsViewModel } from '../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore } from '../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    filter: 'all',
    viewModel: null,
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();
    this.accountApi = createAccountClient(appStore, authStore);
    this.setData({
      filter: query.filter || 'all',
    });

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        backLabel: snapshot.copy.common.back,
      });
      void this.refreshViewModel(snapshot.locale);
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      backLabel: snapshot.copy.common.back,
    });
  },

  onShow() {
    void this.refreshViewModel();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  async refreshViewModel(locale = this.data.locale) {
    const content = getAccountContent(locale);
    const stateSnapshot = accountStateStore.read();
    let notifications = content.notifications;

    try {
      const response = await this.accountApi.fetchNotifications(this.data.filter);
      notifications = response.items;
    } catch {
      notifications = content.notifications;
    }

    this.setData({
      viewModel: buildNotificationsViewModel({
        locale,
        filter: this.data.filter,
        notifications,
        readNotificationIds: stateSnapshot.readNotificationIds,
      }),
    });
  },

  handleFilterTap(event) {
    this.setData(
      {
        filter: event.currentTarget.dataset.filter,
      },
      () => {
        void this.refreshViewModel();
      },
    );
  },

  async handleBatchRead() {
    const unreadIds = this.data.viewModel?.unreadIds || [];
    if (!unreadIds.length) {
      return;
    }

    unreadIds.forEach((id) => {
      accountStateStore.markNotificationRead(id);
    });

    try {
      await this.accountApi.markNotificationsRead(unreadIds);
    } catch {
      // local state already updated
    }

    void this.refreshViewModel();
  },

  handleOpenDetail(event) {
    wx.navigateTo({
      url: `${PROFILE_ROUTES.notificationDetail}?id=${event.currentTarget.dataset.id}`,
    });
  },
});
