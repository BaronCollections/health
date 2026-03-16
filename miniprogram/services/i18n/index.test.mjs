import assert from 'node:assert/strict';
import test from 'node:test';

import { createI18nRuntime } from './index.js';

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

test('createI18nRuntime uses stored supported locale and persists locale changes', () => {
  const storage = createMemoryStorage({
    'mintbit.session.locale': 'en',
  });
  const runtime = createI18nRuntime({
    storage,
    dictionaries: {
      'zh-CN': {
        brand: '小雅',
      },
      en: {
        brand: 'Xiaoya',
      },
    },
  });

  assert.equal(runtime.getLocale(), 'en');
  assert.equal(runtime.t('brand'), 'Xiaoya');

  runtime.setLocale('zh-CN');

  assert.equal(runtime.getLocale(), 'zh-CN');
  assert.equal(runtime.t('brand'), '小雅');
  assert.equal(storage.getItem('mintbit.session.locale'), 'zh-CN');
});

test('createI18nRuntime falls back to zh-CN when the stored locale is unsupported', () => {
  const runtime = createI18nRuntime({
    storage: createMemoryStorage({
      'mintbit.session.locale': 'fr-FR',
    }),
    dictionaries: {
      'zh-CN': {
        help: {
          title: '帮助中心',
        },
      },
      en: {},
    },
  });

  assert.equal(runtime.getLocale(), 'zh-CN');
  assert.equal(runtime.t('help.title'), '帮助中心');
  assert.equal(runtime.t('missing.key'), 'missing.key');
});
