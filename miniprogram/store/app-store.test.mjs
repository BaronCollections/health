import assert from 'node:assert/strict';
import test from 'node:test';

import { createAppStore } from './app-store.js';

function createMemoryStorage(seed = {}) {
  const state = new Map(Object.entries(seed));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
  };
}

test('createAppStore hydrates locale-aware copy and tab labels from storage', () => {
  const storage = createMemoryStorage({
    'mintbit.session.locale': 'en',
  });
  const appStore = createAppStore({ storage });

  const snapshot = appStore.hydrate();

  assert.equal(snapshot.locale, 'en');
  assert.equal(snapshot.copy.home.heroTitle, 'Build a plan that fits your body today');
  assert.deepEqual(
    snapshot.tabBar.map((item) => item.label),
    ['Home', 'Report', 'Check-In', 'Community', 'Profile'],
  );
});

test('createAppStore persists locale changes and updates translated copy', () => {
  const storage = createMemoryStorage();
  const appStore = createAppStore({ storage });

  appStore.hydrate();
  const snapshot = appStore.setLocale('zh-CN');

  assert.equal(snapshot.locale, 'zh-CN');
  assert.equal(snapshot.copy.profile.title, '账户中心');
  assert.equal(storage.getItem('mintbit.session.locale'), 'zh-CN');
});
