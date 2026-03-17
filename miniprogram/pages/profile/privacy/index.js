import { PROFILE_ROUTES } from '../../../../config/routes.js';
import { buildPrivacyViewModel, getAccountContent } from '../../../../services/account/index.js';
import { createAccountClient, getAccountStateStore, openAppRoute } from '../../../../services/account/runtime.js';

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
    const [exportResult, deleteResult, securityResult] = await Promise.allSettled([
      this.accountApi.fetchExportRequests(),
      this.accountApi.fetchDeleteRequests(),
      this.accountApi.fetchSecuritySnapshot(),
    ]);

    this.setData({
      viewModel: buildPrivacyViewModel({
        locale,
        exportRequests:
          exportResult.status === 'fulfilled'
            ? [...stateSnapshot.exportRequests, ...exportResult.value]
            : [...stateSnapshot.exportRequests, ...content.exportRequests],
        deleteRequests:
          deleteResult.status === 'fulfilled'
            ? [...stateSnapshot.deleteRequests, ...deleteResult.value]
            : [...stateSnapshot.deleteRequests, ...content.deleteRequests],
        security: securityResult.status === 'fulfilled' ? securityResult.value : content.security,
      }),
    });
  },

  handleOpenSecurity() {
    openAppRoute(PROFILE_ROUTES.security);
  },

  handleOpenExport() {
    openAppRoute(PROFILE_ROUTES.export);
  },

  handleOpenDelete() {
    openAppRoute(PROFILE_ROUTES.deleteRequest);
  },

  handleOpenAudit() {
    openAppRoute(PROFILE_ROUTES.auditLog);
  },
});
