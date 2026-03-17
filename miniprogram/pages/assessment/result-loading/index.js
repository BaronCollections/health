Page({
  data: {
    assessmentId: null,
  },

  onLoad(query) {
    this.setData({
      assessmentId: query.assessmentId || null,
    });

    this.timer = setTimeout(() => {
      wx.switchTab({
        url: '/pages/report/index/index',
      });
    }, 1200);
  },

  onUnload() {
    clearTimeout(this.timer);
  },
});
