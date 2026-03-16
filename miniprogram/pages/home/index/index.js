function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    copy: null,
    authStatus: 'anonymous',
    brandName: 'MintBit',
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
    this.getTabBar()?.setActive('/pages/home/index/index');
  },

  onUnload() {
    this.unsubscribeApp?.();
    this.unsubscribeAuth?.();
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      brandName: snapshot.copy.brandName,
      copy: snapshot.copy.home,
    });
  },

  handlePrimaryAction() {
    wx.navigateTo({
      url: '/pages/auth/login/index',
    });
  },

  handleSecondaryAction() {
    wx.switchTab({
      url: '/pages/report/index/index',
    });
  },

  handleCardTap(event) {
    const { id } = event.currentTarget.dataset;

    if (id === 'community') {
      wx.switchTab({
        url: '/pages/community/index/index',
      });
      return;
    }

    if (id === 'plan') {
      wx.switchTab({
        url: '/pages/checkin/index/index',
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/auth/login/index',
    });
  },
});
