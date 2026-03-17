import { ASSESSMENT_ROUTES, REPORT_ROUTES } from '../../../config/routes.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';
import { buildTimelineViewModel } from '../../../services/report/timeline.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    viewModel: null,
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot);
    });

    this.applySnapshot(appStore.hydrate());
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applySnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
      viewModel: buildTimelineViewModel({
        locale: snapshot.locale,
        session: assessmentSessionStore.read() || {},
      }),
    });
  },

  handlePrimaryAction() {
    wx.navigateTo({
      url: ASSESSMENT_ROUTES.questionnaire,
    });
  },

  handleSecondaryAction() {
    wx.switchTab({
      url: REPORT_ROUTES.index,
    });
  },

  handleCommunityAction() {
    wx.switchTab({
      url: '/pages/community/index/index',
    });
  },
});
