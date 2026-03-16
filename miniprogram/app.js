import { createAppStore } from './store/app-store.js';
import { createAuthStore } from './store/auth-store.js';

const appStore = createAppStore();
const authStore = createAuthStore();

App({
  globalData: {
    appStore,
    authStore,
  },

  onLaunch() {
    appStore.hydrate();
    authStore.hydrate();
  },
});
