import { TAB_BAR_ROUTES } from '../../config/routes.js';
import { resolveEnvConfig } from '../../config/env.js';
import { createRequestClient } from '../request/client.js';
import { createAccountApi } from './api.js';
import { createAccountStateStore } from './state.js';
import { isAllowlistedAdmin, parseAdminAllowlist } from './index.js';

const accountStateStore = createAccountStateStore();

export function createAccountClient(appStore, authStore) {
  return createAccountApi({
    request: createRequestClient({
      getLocale: () => appStore.getSnapshot().locale,
      getSession: () => authStore.getSnapshot(),
    }),
  });
}

export function getAccountStateStore() {
  return accountStateStore;
}

export function openAppRoute(url) {
  if (TAB_BAR_ROUTES.includes(url)) {
    wx.switchTab({ url });
    return;
  }

  wx.navigateTo({ url });
}

export function resolveAdminState(profile) {
  const env = resolveEnvConfig();
  const allowlist = parseAdminAllowlist(env.adminAllowlist);

  return {
    allowlist,
    isAdmin: isAllowlistedAdmin(profile, allowlist),
  };
}
