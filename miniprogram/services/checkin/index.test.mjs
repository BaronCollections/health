import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyDailyCheckIn,
  buildCheckInViewModel,
  createCheckInStateStore,
  createInitialCheckInState,
} from './index.js';

function createMemoryStorage(seed = {}) {
  const state = new Map(Object.entries(seed));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    },
  };
}

test('applyDailyCheckIn increments streak and points only once per day', () => {
  const date = new Date('2026-03-17T08:00:00Z');
  const initial = createInitialCheckInState();

  const next = applyDailyCheckIn(initial, date);
  const duplicate = applyDailyCheckIn(next, date);

  assert.equal(next.streakDays, 8);
  assert.equal(next.healthPoints, 530);
  assert.equal(duplicate.streakDays, 8);
  assert.equal(duplicate.healthPoints, 530);
});

test('createCheckInStateStore persists and clears the mini program check-in state', () => {
  const store = createCheckInStateStore({
    storage: createMemoryStorage(),
  });

  store.save({
    streakDays: 9,
    monthlyCheckins: 27,
    totalCheckins: 182,
    healthPoints: 540,
    lastCheckInDate: '2026-03-17',
  });

  assert.equal(store.read().streakDays, 9);

  store.clear();

  assert.equal(store.read(), null);
});

test('buildCheckInViewModel returns localized plan cards and checked-in state', () => {
  const viewModel = buildCheckInViewModel({
    locale: 'en',
    reportViewModel: {
      primaryGoal: {
        id: 'stress',
        label: 'Stress / Mood',
      },
      nutritionCards: [
        {
          id: 'magnesium',
          category: 'Stress',
          name: 'Magnesium',
          benefit: 'Supports muscle relaxation.',
        },
      ],
    },
    checkInState: {
      streakDays: 8,
      monthlyCheckins: 26,
      totalCheckins: 181,
      healthPoints: 530,
      lastCheckInDate: '2026-03-17',
    },
    now: new Date('2026-03-17T10:00:00Z'),
  });

  assert.equal(viewModel.checkedInToday, true);
  assert.equal(viewModel.goalLabel, 'Stress / Mood');
  assert.equal(viewModel.planCards.length, 1);
  assert.equal(viewModel.summary.streakValue, '8');
  assert.match(viewModel.primaryActionLabel, /Checked in/i);
});

test('buildCheckInViewModel falls back to localized empty guidance when no report plan exists', () => {
  const viewModel = buildCheckInViewModel({
    locale: 'zh-CN',
    reportViewModel: null,
    checkInState: createInitialCheckInState(),
    now: new Date('2026-03-18T10:00:00Z'),
  });

  assert.equal(viewModel.checkedInToday, false);
  assert.equal(viewModel.planCards.length, 0);
  assert.match(viewModel.emptyState.title, /暂无/);
});
