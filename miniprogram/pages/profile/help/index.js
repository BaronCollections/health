import { PROFILE_ROUTES } from '../../../../config/routes.js';
import { buildHelpCenterViewModel, getAccountContent } from '../../../../services/account/index.js';
import { createAccountClient, openAppRoute } from '../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

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
    let faqCategories = content.faqCategories;

    try {
      faqCategories = await this.accountApi.fetchFaqCategories();
    } catch {
      faqCategories = content.faqCategories;
    }

    this.setData({
      viewModel: buildHelpCenterViewModel({
        locale,
        faqCategories,
      }),
    });
  },

  handleOpenFeedback() {
    openAppRoute(PROFILE_ROUTES.feedback);
  },

  handleOpenRecords() {
    openAppRoute(PROFILE_ROUTES.feedbackRecords);
  },
});
