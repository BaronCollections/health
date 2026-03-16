Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    subtitle: {
      type: String,
      value: '',
    },
    showBack: {
      type: Boolean,
      value: false,
    },
    backLabel: {
      type: String,
      value: '',
    },
  },

  methods: {
    handleBack() {
      const pages = getCurrentPages();

      if (pages.length > 1) {
        wx.navigateBack();
        return;
      }

      wx.switchTab({
        url: '/pages/home/index/index',
      });
    },
  },
});
