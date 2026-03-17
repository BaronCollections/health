import { COMMUNITY_ROUTES } from '../../../../../config/routes.js';
import { resolveEnvConfig } from '../../../../../config/env.js';
import { openAppRoute, resolveAdminState } from '../../../../../services/account/runtime.js';

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    backLabel: '返回',
    checklist: null,
  },

  onLoad() {
    const { appStore, authStore } = getStores();
    this.unsubscribeApp = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot, authStore.getSnapshot());
    });
    this.unsubscribeAuth = authStore.subscribe((snapshot) => {
      this.applySnapshot(appStore.getSnapshot(), snapshot);
    });

    this.applySnapshot(appStore.hydrate(), authStore.hydrate());
  },

  onUnload() {
    this.unsubscribeApp?.();
    this.unsubscribeAuth?.();
  },

  applySnapshot(appSnapshot, authSnapshot) {
    const env = resolveEnvConfig();
    const adminState = resolveAdminState(authSnapshot.userProfile);

    this.setData({
      locale: appSnapshot.locale,
      backLabel: appSnapshot.copy.common.back,
      checklist: {
        title: appSnapshot.locale === 'zh-CN' ? '发布检查' : 'Release checklist',
        subtitle:
          appSnapshot.locale === 'zh-CN'
            ? '小程序端的管理员只读检查页，用于确认白名单、接口地址与迁移进度。'
            : 'Read-only admin checks for allowlist, API base URL, and migration progress.',
        items: [
          {
            id: 'admin',
            title: appSnapshot.locale === 'zh-CN' ? '管理员身份' : 'Admin access',
            value: adminState.isAdmin ? 'Yes' : 'No',
          },
          {
            id: 'allowlist',
            title: appSnapshot.locale === 'zh-CN' ? '白名单数量' : 'Allowlist count',
            value: String(adminState.allowlist.length),
          },
          {
            id: 'api',
            title: appSnapshot.locale === 'zh-CN' ? '接口地址' : 'API base URL',
            value: env.apiBaseUrl,
          },
          {
            id: 'progress',
            title: appSnapshot.locale === 'zh-CN' ? '迁移进度' : 'Migration progress',
            value: '98%',
          },
        ],
        actions: [
          {
            id: 'community-review',
            title: appSnapshot.locale === 'zh-CN' ? '社区审核队列' : 'Community moderation queue',
            body:
              appSnapshot.locale === 'zh-CN'
                ? '进入原生小程序审核页，处理待审帖子和评论。'
                : 'Open the native moderation page for pending posts and comments.',
            href: COMMUNITY_ROUTES.review,
          },
        ],
      },
    });
  },

  handleOpenAction(event) {
    openAppRoute(event.currentTarget.dataset.href);
  },
});
