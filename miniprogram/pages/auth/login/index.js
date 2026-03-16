function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    copy: null,
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        copy: snapshot.copy.auth,
      });
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      copy: snapshot.copy.auth,
    });
  },

  onUnload() {
    this.unsubscribe?.();
  },

  handleContinue() {
    getStores().authStore.setBindRequired('mock-bind-token', {
      locale: this.data.locale,
    });

    wx.navigateTo({
      url: '/pages/auth/bind-phone/index',
    });
  },
});
