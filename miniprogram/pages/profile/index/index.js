import { PROFILE_ROUTES } from '../../../config/routes.js';
import { getAccountContent, buildAccountHomeViewModel } from '../../../services/account/index.js';
import {
  createAccountClient,
  getAccountStateStore,
  openAppRoute,
  resolveAdminState,
} from '../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

const accountStateStore = getAccountStateStore();

Page({
  data: {
    locale: 'zh-CN',
    switchLanguageLabel: '',
    authStatus: 'anonymous',
    authIdentity: '',
    authCopy: null,
    viewModel: null,
  },

  onLoad() {
    const { appStore, authStore } = getStores();
    this.accountApi = createAccountClient(appStore, authStore);

    this.unsubscribeApp = appStore.subscribe((snapshot) => {
      this.applyAppSnapshot(snapshot);
    });
    this.unsubscribeAuth = authStore.subscribe((snapshot) => {
      this.applyAuthSnapshot(snapshot);
    });

    this.applyAppSnapshot(appStore.hydrate());
    this.applyAuthSnapshot(authStore.hydrate());
  },

  onShow() {
    this.getTabBar()?.setActive(PROFILE_ROUTES.index);
    void this.refreshViewModel();
  },

  onUnload() {
    this.unsubscribeApp?.();
    this.unsubscribeAuth?.();
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      switchLanguageLabel: snapshot.copy.common.switchLanguage,
      authCopy: snapshot.locale === 'zh-CN'
        ? {
            guestBody: '微信登录后可查看完整账户数据、通知和隐私控制。',
            memberBody: '已绑定账号，可继续管理消息、反馈、隐私与数据操作。',
            authCta: '去绑定',
          }
        : {
            guestBody: 'Sign in with WeChat to unlock notifications, data controls, and the full account center.',
            memberBody: 'Your account is bound. You can now manage notifications, feedback, privacy, and data requests.',
            authCta: 'Bind account',
          },
    });

    if (this.data.authStatus) {
      void this.refreshViewModel(snapshot.locale);
    }
  },

  applyAuthSnapshot(snapshot) {
    const authIdentity = snapshot.userProfile?.phone || snapshot.userProfile?.nickname || '';

    this.setData({
      authStatus: snapshot.status,
      authIdentity,
    });
    void this.refreshViewModel(this.data.locale, snapshot);
  },

  async refreshViewModel(locale = this.data.locale, authSnapshot = getStores().authStore.getSnapshot()) {
    const stateSnapshot = accountStateStore.read();
    const content = getAccountContent(locale);
    const [{ status: notificationStatus, value: notificationResponse }, { status: feedbackStatus, value: feedbackResponse }, { status: exportStatus, value: exportResponse }, { status: deleteStatus, value: deleteResponse }, { status: securityStatus, value: securityResponse }] =
      await Promise.allSettled([
        this.accountApi.fetchNotifications('all'),
        this.accountApi.fetchFeedbackRecords(),
        this.accountApi.fetchExportRequests(),
        this.accountApi.fetchDeleteRequests(),
        this.accountApi.fetchSecuritySnapshot(),
      ]);

    const { isAdmin } = resolveAdminState(authSnapshot.userProfile);

    this.setData({
      viewModel: buildAccountHomeViewModel({
        locale,
        allowAdminTools: isAdmin,
        notifications: notificationStatus === 'fulfilled' ? notificationResponse.items : content.notifications,
        feedbackRecords:
          feedbackStatus === 'fulfilled'
            ? [...stateSnapshot.feedbackRecords, ...feedbackResponse.records]
            : [...stateSnapshot.feedbackRecords, ...content.feedbackRecords],
        exportRequests:
          exportStatus === 'fulfilled'
            ? [...stateSnapshot.exportRequests, ...exportResponse]
            : [...stateSnapshot.exportRequests, ...content.exportRequests],
        deleteRequests:
          deleteStatus === 'fulfilled'
            ? [...stateSnapshot.deleteRequests, ...deleteResponse]
            : [...stateSnapshot.deleteRequests, ...content.deleteRequests],
        security: securityStatus === 'fulfilled' ? securityResponse : content.security,
        readNotificationIds: stateSnapshot.readNotificationIds,
      }),
    });
  },

  handleLocaleChange(event) {
    getStores().appStore.setLocale(event.detail.locale);
  },

  handleAuthCta() {
    openAppRoute('/pages/auth/login/index');
  },

  handleCardTap(event) {
    openAppRoute(event.currentTarget.dataset.href);
  },
});
