function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    shell: null,
    common: null,
  },

  onLoad() {
    const appStore = getStores().appStore;

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        shell: snapshot.copy.shells.report,
        common: snapshot.copy.common,
      });
    });

    const snapshot = appStore.hydrate();
    this.setData({
      shell: snapshot.copy.shells.report,
      common: snapshot.copy.common,
    });
  },

  onShow() {
    this.getTabBar()?.setActive('/pages/report/index/index');
  },

  onUnload() {
    this.unsubscribe?.();
  },
});
