Component({
  data: {
    items: [],
    selectedPath: '/pages/home/index/index',
  },

  lifetimes: {
    attached() {
      const app = getApp();
      const appStore = app.globalData.appStore;
      this.unsubscribe = appStore.subscribe((snapshot) => {
        this.setData({
          items: snapshot.tabBar,
        });
      });

      this.setData({
        items: appStore.getSnapshot().tabBar,
      });
    },
    detached() {
      this.unsubscribe?.();
    },
  },

  methods: {
    handleSwitchTab(event) {
      const { path } = event.currentTarget.dataset;

      if (!path || path === this.data.selectedPath) {
        return;
      }

      this.setData({
        selectedPath: path,
      });
      wx.switchTab({
        url: path,
      });
    },
    setActive(path) {
      this.setData({
        selectedPath: path,
      });
    },
  },
});
