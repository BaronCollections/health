import { REPORT_ROUTES } from '../../../config/routes.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

Page({
  data: {
    shell: null,
    common: null,
    actionText: '',
    actionRoute: '',
    actionAssessmentId: null,
  },

  onLoad() {
    const appStore = getStores().appStore;

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        shell: snapshot.copy.shells.report,
        common: snapshot.copy.common,
      });
      this.refreshAction();
    });

    const snapshot = appStore.hydrate();
    this.setData({
      shell: snapshot.copy.shells.report,
      common: snapshot.copy.common,
    });
    this.refreshAction();
  },

  onShow() {
    this.getTabBar()?.setActive('/pages/report/index/index');
    this.refreshAction();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  refreshAction() {
    const session = assessmentSessionStore.read();
    const assessmentId = session?.assessmentId || null;
    const hasOcrUpload = Boolean(session?.ocrUpload);

    if (!assessmentId || !this.data.shell) {
      this.setData({
        actionText: '',
        actionRoute: '',
        actionAssessmentId: null,
      });
      return;
    }

    this.setData({
      actionText: hasOcrUpload ? this.data.shell.reviewCta || '' : this.data.shell.uploadCta || '',
      actionRoute: hasOcrUpload ? REPORT_ROUTES.ocrConfirmation : REPORT_ROUTES.ocrUpload,
      actionAssessmentId: assessmentId,
    });
  },

  handleAction() {
    if (!this.data.actionRoute) {
      return;
    }

    wx.navigateTo({
      url: `${this.data.actionRoute}?assessmentId=${this.data.actionAssessmentId || ''}`,
    });
  },
});
