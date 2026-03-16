function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    copy: null,
    authStatus: 'anonymous',
  },

  onLoad() {
    const { appStore, authStore } = getStores();

    this.unsubscribeApp = appStore.subscribe((snapshot) => {
      this.applyAppSnapshot(snapshot);
    });
    this.unsubscribeAuth = authStore.subscribe((snapshot) => {
      this.setData({
        authStatus: snapshot.status,
      });
    });

    this.applyAppSnapshot(appStore.hydrate());
    this.setData({
      authStatus: authStore.hydrate().status,
    });
  },

  onShow() {
    this.getTabBar()?.setActive('/pages/profile/index/index');
  },

  onUnload() {
    this.unsubscribeApp?.();
    this.unsubscribeAuth?.();
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      copy: snapshot.copy.profile,
      switchLanguageLabel: snapshot.copy.common.switchLanguage,
    });
  },

  handleLocaleChange(event) {
    const { locale } = event.detail;
    getStores().appStore.setLocale(locale);
  },

  handleAuthCta() {
    wx.navigateTo({
      url: '/pages/auth/login/index',
    });
  },

  handleCardTap(event) {
    const { href } = event.currentTarget.dataset;

    wx.switchTab({
      url: href,
      fail: () => {
        wx.navigateTo({
          url: href,
        });
      },
    });
  },
});
