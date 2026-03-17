import { ASSESSMENT_ROUTES, REPORT_ROUTES } from '../../../config/routes.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';
import { buildReportViewModel } from '../../../services/report/content.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    viewModel: null,
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot);
    });

    this.applySnapshot(appStore.hydrate());
  },

  onShow() {
    this.getTabBar()?.setActive('/pages/report/index/index');
    this.refreshViewModel();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applySnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
    });
    this.refreshViewModel(snapshot.locale);
  },

  refreshViewModel(locale = this.data.locale) {
    const session = assessmentSessionStore.read() || {};
    this.setData({
      viewModel: buildReportViewModel({
        locale,
        session,
      }),
    });
  },

  handleOcrAction() {
    const route =
      this.data.viewModel?.ocrStatus?.state === 'pending' ? REPORT_ROUTES.ocrUpload : REPORT_ROUTES.ocrConfirmation;

    wx.navigateTo({
      url: `${route}?assessmentId=${assessmentSessionStore.read()?.assessmentId || ''}`,
    });
  },

  handleTimelineAction() {
    wx.navigateTo({
      url: REPORT_ROUTES.timeline,
    });
  },

  handlePrimaryAction() {
    wx.switchTab({
      url: '/pages/checkin/index/index',
    });
  },

  handleRetakeAssessment() {
    wx.navigateTo({
      url: ASSESSMENT_ROUTES.questionnaire,
    });
  },
});
