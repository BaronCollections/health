import { createAssessmentSessionStore } from '../../../services/assessment/session.js';
import {
  applyDailyCheckIn,
  buildCheckInViewModel,
  createCheckInStateStore,
  createInitialCheckInState,
} from '../../../services/checkin/index.js';
import { buildReportViewModel } from '../../../services/report/content.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();
const checkInStateStore = createCheckInStateStore();

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    viewModel: null,
    checkedInToday: false,
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot);
    });

    this.applySnapshot(appStore.hydrate());
  },

  onShow() {
    this.getTabBar()?.setActive('/pages/checkin/index/index');
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
    const assessmentSession = assessmentSessionStore.read() || {};
    const checkInState = checkInStateStore.read() || createInitialCheckInState();
    const reportViewModel = assessmentSession.assessmentId
      ? buildReportViewModel({
          locale,
          session: assessmentSession,
        })
      : null;
    const viewModel = buildCheckInViewModel({
      locale,
      reportViewModel,
      checkInState,
      now: new Date(),
    });

    this.setData({
      viewModel,
      checkedInToday: viewModel.checkedInToday,
    });
  },

  handleCheckIn() {
    const currentState = checkInStateStore.read() || createInitialCheckInState();
    const nextState = applyDailyCheckIn(currentState, new Date());
    checkInStateStore.save(nextState);
    this.refreshViewModel();
  },

  handleOpenReport() {
    wx.switchTab({
      url: '/pages/report/index/index',
    });
  },

  handleOpenCommunity() {
    wx.switchTab({
      url: '/pages/community/index/index',
    });
  },
});
