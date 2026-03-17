import { buildNotificationDetailViewModel, getAccountContent } from '../../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore, openAppRoute } from '../../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    viewModel: null,
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();
    this.notificationId = query.id;
    this.accountApi = createAccountClient(appStore, authStore);

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
    let notifications = content.notifications;

    accountStateStore.markNotificationRead(this.notificationId);

    try {
      await this.accountApi.markNotificationRead(this.notificationId);
    } catch {
      // local state remains the fallback
    }

    try {
      const response = await this.accountApi.fetchNotifications('all');
      notifications = response.items;
    } catch {
      notifications = content.notifications;
    }

    this.setData({
      viewModel: buildNotificationDetailViewModel({
        locale,
        notificationId: this.notificationId,
        notifications,
        readNotificationIds: accountStateStore.read().readNotificationIds,
      }),
    });
  },

  handleOpenRelated() {
    const href = this.data.viewModel?.notification?.actionHref;
    if (!href) {
      return;
    }
    openAppRoute(href);
  },
});
