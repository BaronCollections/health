import { buildExportRequestsViewModel, getAccountContent } from '../../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore } from '../../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    scopeSummary: '',
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
    let requests = [...stateSnapshot.exportRequests, ...content.exportRequests];

    try {
      const response = await this.accountApi.fetchExportRequests();
      requests = [...stateSnapshot.exportRequests, ...response];
    } catch {
      requests = [...stateSnapshot.exportRequests, ...content.exportRequests];
    }

    this.setData({
      viewModel: buildExportRequestsViewModel({
        locale,
        exportRequests: requests,
      }),
      scopeSummary: this.data.scopeSummary || content.exportCenter.defaultScopeSummary,
    });
  },

  handleInput(event) {
    this.setData({
      scopeSummary: event.detail.value,
    });
  },

  async handleSubmit() {
    const payload = {
      scopeSummary: this.data.scopeSummary.trim(),
    };

    let createdRequest;

    try {
      createdRequest = await this.accountApi.createExportRequest(payload);
    } catch {
      createdRequest = {
        id: `export-local-${Date.now()}`,
        requestedAt: new Date().toISOString(),
        status: 'requested',
        scopeSummary: payload.scopeSummary,
      };
    }

    accountStateStore.saveExportRequest(createdRequest);
    void this.refreshViewModel();
  },
});
