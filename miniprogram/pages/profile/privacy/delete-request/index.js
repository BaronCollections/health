import { buildDeleteRequestsViewModel, getAccountContent } from '../../../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore } from '../../../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    impactSummary: '',
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
    let requests = [...stateSnapshot.deleteRequests, ...content.deleteRequests];

    try {
      const response = await this.accountApi.fetchDeleteRequests();
      requests = [...stateSnapshot.deleteRequests, ...response];
    } catch {
      requests = [...stateSnapshot.deleteRequests, ...content.deleteRequests];
    }

    this.setData({
      viewModel: buildDeleteRequestsViewModel({
        locale,
        deleteRequests: requests,
      }),
      impactSummary: this.data.impactSummary || content.deleteCenter.impactPlaceholder,
    });
  },

  handleInput(event) {
    this.setData({
      impactSummary: event.detail.value,
    });
  },

  async handleSubmit() {
    const payload = {
      impactSummary: this.data.impactSummary.trim(),
    };

    let createdRequest;

    try {
      createdRequest = await this.accountApi.createDeleteRequest(payload);
    } catch {
      createdRequest = {
        id: `delete-local-${Date.now()}`,
        submittedAt: this.data.locale === 'zh-CN' ? '刚刚' : 'Just now',
        status: 'submitted',
        impactSummary: payload.impactSummary,
      };
    }

    accountStateStore.saveDeleteRequest(createdRequest);
    void this.refreshViewModel();
  },
});
