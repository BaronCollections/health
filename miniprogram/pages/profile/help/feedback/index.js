import { PROFILE_ROUTES } from '../../../../../config/routes.js';
import { getAccountContent } from '../../../../../services/account/index.js';
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
    selectedCategory: '',
    subject: '',
    description: '',
    contact: '',
    screenshotName: '',
    errorMessage: '',
  },

  onLoad() {
    const { appStore, authStore } = getStores();
    this.accountApi = createAccountClient(appStore, authStore);

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        backLabel: snapshot.copy.common.back,
      });
      this.applyViewModel(snapshot.locale);
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      backLabel: snapshot.copy.common.back,
    });
    this.applyViewModel(snapshot.locale);
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applyViewModel(locale = this.data.locale) {
    const content = getAccountContent(locale);
    const selectedCategory = this.data.selectedCategory || content.feedbackForm.categories[0];

    this.setData({
      selectedCategory,
      viewModel: {
        ...content.feedbackForm,
        categoryOptions: content.feedbackForm.categories.map((category) => ({
          id: category,
          label: category,
          selected: category === selectedCategory,
        })),
      },
    });
  },

  handleCategoryTap(event) {
    this.setData(
      {
        selectedCategory: event.currentTarget.dataset.category,
      },
      () => this.applyViewModel(),
    );
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [field]: event.detail.value,
    });
  },

  async handleSubmit() {
    if (!this.data.subject.trim() || !this.data.description.trim()) {
      this.setData({
        errorMessage: this.data.locale === 'zh-CN' ? '请先填写主题和详细描述。' : 'Please complete subject and description first.',
      });
      return;
    }

    const payload = {
      category: this.data.selectedCategory,
      subject: this.data.subject.trim(),
      description: this.data.description.trim(),
      contact: this.data.contact.trim(),
      screenshotName: this.data.screenshotName.trim(),
    };

    let createdRecord;

    try {
      createdRecord = await this.accountApi.createFeedback(payload);
    } catch {
      createdRecord = {
        id: `fb-local-${Date.now()}`,
        ...payload,
        status: 'submitted',
        submittedAt: this.data.locale === 'zh-CN' ? '刚刚' : 'Just now',
      };
    }

    accountStateStore.saveFeedbackRecord(createdRecord);
    wx.showToast({
      title: this.data.locale === 'zh-CN' ? '已提交' : 'Submitted',
      icon: 'success',
    });
    setTimeout(() => {
      wx.redirectTo({
        url: PROFILE_ROUTES.feedbackRecords,
      });
    }, 300);
  },
});
