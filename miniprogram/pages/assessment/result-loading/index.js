import { REPORT_ROUTES } from '../../../config/routes.js';

Page({
  data: {
    assessmentId: null,
  },

  onLoad(query) {
    this.setData({
      assessmentId: query.assessmentId || null,
    });

    this.timer = setTimeout(() => {
      wx.navigateTo({
        url: `${REPORT_ROUTES.ocrUpload}?assessmentId=${this.data.assessmentId || ''}`,
      });
    }, 1200);
  },

  onUnload() {
    clearTimeout(this.timer);
  },
});
