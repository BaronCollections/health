import { buildSecurityViewModel, getAccountContent } from '../../../../services/account/index.js';
import { createAccountClient } from '../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    viewModel: null,
  },

  onLoad() {
    const { appStore, authStore } = getStores();
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
    let security = content.security;

    try {
      security = await this.accountApi.fetchSecuritySnapshot();
    } catch {
      security = content.security;
    }

    this.setData({
      viewModel: buildSecurityViewModel({
        locale,
        security,
      }),
    });
  },
});
