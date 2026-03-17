export const CHECKIN_STORAGE_KEY = 'mintbit.checkin.state';

const CHECKIN_COPY = {
  'zh-CN': {
    title: '每日打卡',
    subtitle: '把今天的营养动作落下来，让改善变成连续轨迹。',
    summary: {
      streak: '连续打卡',
      monthly: '本月完成',
      total: '累计打卡',
      points: '健康积分',
    },
    microGoalTitle: '今日执行重点',
    planTitle: '今日营养方案',
    timelineHint: '完成打卡后，时间轴和社区节点会继续累积。',
    primaryAction: {
      idle: '完成今日打卡',
      done: '今日已打卡',
    },
    secondaryActions: {
      report: '返回报告',
      community: '去社区看看',
    },
    emptyState: {
      title: '暂无打卡方案',
      body: '先完成评估和报告页浏览，再把推荐方案带进每日打卡。',
    },
  },
  en: {
    title: 'Daily check-in',
    subtitle: 'Turn today’s nutrition action into a visible streak of progress.',
    summary: {
      streak: 'Streak',
      monthly: 'This month',
      total: 'Total',
      points: 'Health points',
    },
    microGoalTitle: 'Today’s focus',
    planTitle: 'Today’s nutrition plan',
    timelineHint: 'After check-in, the timeline and community milestones keep accumulating.',
    primaryAction: {
      idle: 'Complete today’s check-in',
      done: 'Checked in today',
    },
    secondaryActions: {
      report: 'Back to report',
      community: 'Open community',
    },
    emptyState: {
      title: 'No plan yet',
      body: 'Finish the assessment and review the report first, then bring the suggested plan into daily check-in.',
    },
  },
};

function createStorageAdapter(storage) {
  if (storage) {
    return storage;
  }

  return {
    getItem(key) {
      return globalThis.wx?.getStorageSync?.(key) || null;
    },
    setItem(key, value) {
      globalThis.wx?.setStorageSync?.(key, value);
    },
    removeItem(key) {
      globalThis.wx?.removeStorageSync?.(key);
    },
  };
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function createInitialCheckInState() {
  return {
    streakDays: 7,
    monthlyCheckins: 25,
    totalCheckins: 180,
    healthPoints: 520,
    lastCheckInDate: null,
  };
}

export function applyDailyCheckIn(state, date = new Date()) {
  const nextDateKey = formatDateKey(date);

  if (state.lastCheckInDate === nextDateKey) {
    return state;
  }

  return {
    ...state,
    streakDays: state.streakDays + 1,
    monthlyCheckins: state.monthlyCheckins + 1,
    totalCheckins: state.totalCheckins + 1,
    healthPoints: state.healthPoints + 10,
    lastCheckInDate: nextDateKey,
  };
}

export function createCheckInStateStore({ storage } = {}) {
  const adapter = createStorageAdapter(storage);

  return {
    read() {
      const rawValue = adapter.getItem(CHECKIN_STORAGE_KEY);

      if (!rawValue) {
        return null;
      }

      try {
        return JSON.parse(rawValue);
      } catch {
        adapter.removeItem(CHECKIN_STORAGE_KEY);
        return null;
      }
    },
    save(snapshot) {
      adapter.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(snapshot));
      return snapshot;
    },
    clear() {
      adapter.removeItem(CHECKIN_STORAGE_KEY);
    },
  };
}

export function buildCheckInViewModel({
  locale = 'zh-CN',
  reportViewModel,
  checkInState = createInitialCheckInState(),
  now = new Date(),
} = {}) {
  const copy = CHECKIN_COPY[locale] || CHECKIN_COPY['zh-CN'];
  const checkedInToday = checkInState.lastCheckInDate === formatDateKey(now);

  return {
    title: copy.title,
    subtitle: copy.subtitle,
    goalLabel: reportViewModel?.primaryGoal?.label || '',
    checkedInToday,
    primaryActionLabel: checkedInToday ? copy.primaryAction.done : copy.primaryAction.idle,
    summary: {
      streakLabel: copy.summary.streak,
      streakValue: String(checkInState.streakDays),
      monthlyLabel: copy.summary.monthly,
      monthlyValue: String(checkInState.monthlyCheckins),
      totalLabel: copy.summary.total,
      totalValue: String(checkInState.totalCheckins),
      pointsLabel: copy.summary.points,
      pointsValue: String(checkInState.healthPoints),
    },
    microGoalTitle: copy.microGoalTitle,
    planTitle: copy.planTitle,
    planCards: reportViewModel?.nutritionCards || [],
    timelineHint: copy.timelineHint,
    secondaryActions: copy.secondaryActions,
    emptyState: copy.emptyState,
  };
}
