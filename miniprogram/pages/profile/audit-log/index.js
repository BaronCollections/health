import { buildAuditViewModel } from '../../../../services/account/index.js';

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
    const { appStore } = getStores();
    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        backLabel: snapshot.copy.common.back,
        viewModel: buildAuditViewModel({
          locale: snapshot.locale,
        }),
      });
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      backLabel: snapshot.copy.common.back,
      viewModel: buildAuditViewModel({
        locale: snapshot.locale,
      }),
    });
  },

  onUnload() {
    this.unsubscribe?.();
  },
});
