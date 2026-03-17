function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    copy: null,
    phone: '',
    code: '',
    isSendingCode: false,
    isSubmitting: false,
    errorMessage: '',
    noticeMessage: '',
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

  async handleSendCode() {
    if (!this.data.phone) {
      this.setData({
        errorMessage: 'Phone is required',
      });
      return;
    }

    this.setData({
      isSendingCode: true,
      errorMessage: '',
      noticeMessage: '',
    });

    try {
      const response = await getStores().authStore.sendSmsCode(this.data.phone);
      this.setData({
        noticeMessage: `${response.status}: ${response.maskedPhone}`,
      });
    } catch (error) {
      this.setData({
        errorMessage: error?.message || 'Failed to send code',
      });
    } finally {
      this.setData({
        isSendingCode: false,
      });
    }
  },

  async handleSubmit() {
    if (!this.data.phone || !this.data.code) {
      this.setData({
        errorMessage: 'Missing fields',
      });
      return;
    }

    this.setData({
      isSubmitting: true,
      errorMessage: '',
    });

    try {
      await getStores().authStore.bindPhone({
        phone: this.data.phone,
        smsCode: this.data.code,
      });

      wx.switchTab({
        url: '/pages/home/index/index',
      });
    } catch (error) {
      this.setData({
        errorMessage: error?.message || 'Bind failed',
      });
    } finally {
      this.setData({
        isSubmitting: false,
      });
    }
  },
});
