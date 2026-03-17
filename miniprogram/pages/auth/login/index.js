function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    copy: null,
    isSubmitting: false,
    errorMessage: '',
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

  async handleContinue() {
    this.setData({
      isSubmitting: true,
      errorMessage: '',
    });

    try {
      const snapshot = await getStores().authStore.loginWithWeChat();

      if (snapshot.status === 'bind_required') {
        wx.navigateTo({
          url: '/pages/auth/bind-phone/index',
        });
        return;
      }

      wx.switchTab({
        url: '/pages/home/index/index',
      });
    } catch (error) {
      this.setData({
        errorMessage: error?.message || 'Login failed',
      });
    } finally {
      this.setData({
        isSubmitting: false,
      });
    }
  },
});
