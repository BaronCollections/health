function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    copy: null,
    phone: '',
    code: '',
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        copy: snapshot.copy.auth,
      });
    });

    this.setData({
      copy: appStore.hydrate().copy.auth,
    });
  },

  onUnload() {
    this.unsubscribe?.();
  },

  handlePhoneInput(event) {
    this.setData({
      phone: event.detail.value,
    });
  },

  handleCodeInput(event) {
    this.setData({
      code: event.detail.value,
    });
  },

  handleSendCode() {
    wx.showToast({
      title: this.data.copy.bindSendCode,
      icon: 'none',
    });
  },

  handleSubmit() {
    if (!this.data.phone || !this.data.code) {
      wx.showToast({
        title: 'Missing fields',
        icon: 'none',
      });
      return;
    }

    getStores().authStore.setAuthenticated({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userProfile: {
        id: 7,
        nickname: this.data.phone,
      },
    });

    wx.switchTab({
      url: '/pages/home/index/index',
    });
  },
});
