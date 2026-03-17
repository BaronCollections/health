import { buildFeedbackRecordsViewModel, getAccountContent, mergeFeedbackRecords } from '../../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore } from '../../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    viewModel: null,
  },

  onLoad() {
    const { appStore, authStore } = getStores();
    this.accountApi = createAccountClient(appStore, authStore);

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        backLabel: snapshot.copy.common.back,
      });
      void this.refreshViewModel(snapshot.locale);
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      backLabel: snapshot.copy.common.back,
    });
  },

  onShow() {
    void this.refreshViewModel();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  async refreshViewModel(locale = this.data.locale) {
    const content = getAccountContent(locale);
    const stateSnapshot = accountStateStore.read();
    let records = content.feedbackRecords;

    try {
      const response = await this.accountApi.fetchFeedbackRecords();
      records = mergeFeedbackRecords([...stateSnapshot.feedbackRecords, ...content.feedbackRecords], response.records);
    } catch {
      records = [...stateSnapshot.feedbackRecords, ...content.feedbackRecords];
    }

    this.setData({
      viewModel: buildFeedbackRecordsViewModel({
        locale,
        feedbackRecords: records,
      }),
    });
  },

  handlePreviewScreenshot(event) {
    const current = event.currentTarget.dataset.imagePath;

    if (!current) {
      return;
    }

    wx.previewImage({
      current,
      urls: [current],
    });
  },
});
