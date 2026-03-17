const TIMELINE_CONTENT = {
  'zh-CN': {
    header: {
      title: '历史画报时间轴',
      subtitle: '把每次评估、打卡和改善目标连成一条看得见的变化轨迹。',
    },
    overview: {
      eyebrow: '长期变化',
      title: '过去 6 个月，你的综合得分稳步上升',
      body: '历史画报会把关键得分、主要目标和习惯变化放在同一条时间线上，方便你判断哪些行动真正有效。',
      scoreLabel: '当前综合得分',
      scoreValue: '49 / 100',
      deltaLabel: '较首次评估',
      deltaValue: '+11',
    },
    trendSection: {
      title: '趋势摘要',
      items: [
        {
          id: 'diet',
          label: '饮食维度',
          value: '+8',
          note: '规律补水和早餐稳定后，饮食结构得分持续改善。',
        },
        {
          id: 'stress',
          label: '情绪/压力',
          value: '+5',
          note: '连续打卡和睡眠管理带来更稳定的恢复表现。',
        },
        {
          id: 'movement',
          label: '运动习惯',
          value: '+3',
          note: '目前仍是最薄弱维度，适合下一阶段继续强化。',
        },
      ],
    },
    snapshotsSection: {
      title: '历史快照',
      items: [
        {
          id: '2026-03',
          dateLabel: '2026.03',
          title: '重新建立基础节奏',
          score: '49',
          delta: '+4',
          primaryGoal: '情绪/压力',
          habit: '补水连续 12 天',
          highlight: 'OCR 增补了维生素 D 和铁蛋白数据，解释链更完整。',
        },
        {
          id: '2025-12',
          dateLabel: '2025.12',
          title: '把打卡变成默认动作',
          score: '45',
          delta: '+5',
          primaryGoal: '胃肠道功能',
          habit: '连续打卡 21 天',
          highlight: '益生菌和膳食纤维执行率提升后，胃肠道反馈更稳定。',
        },
        {
          id: '2025-09',
          dateLabel: '2025.09',
          title: '第一次完成完整评估',
          score: '38',
          delta: '起点',
          primaryGoal: '免疫力',
          habit: '建立第一个每日提醒',
          highlight: '首次识别出饮食和运动之间的缺口，开始形成可执行方案。',
        },
      ],
    },
    milestonesSection: {
      title: '关键里程碑',
      items: [
        '完成第一份个人营养画报，建立基准线。',
        '连续打卡 21 天后，方案执行稳定性明显提升。',
        '首次补充 OCR 数据后，报告解释链从主观输入延伸到结构化指标。',
      ],
    },
    communityBridge: {
      eyebrow: '社区陪伴',
      title: '把这段变化带回社区',
      body: '去社区看看正在做相似目标的人如何记录习惯、交流体感变化，并把你的下一次里程碑变成可持续动作。',
      cta: '去社区看看',
    },
    actions: {
      primary: '重新开始测评',
      secondary: '返回当前报告',
    },
  },
  en: {
    header: {
      title: 'Poster history timeline',
      subtitle: 'Turn each assessment, check-in streak, and improvement goal into a visible path of change.',
    },
    overview: {
      eyebrow: 'Long-term change',
      title: 'Your overall score has climbed steadily over the last six months',
      body: 'Poster history places key scores, primary goals, and habit shifts on one line so you can see which actions are actually working.',
      scoreLabel: 'Current overall score',
      scoreValue: '49 / 100',
      deltaLabel: 'vs. first assessment',
      deltaValue: '+11',
    },
    trendSection: {
      title: 'Trend summary',
      items: [
        {
          id: 'diet',
          label: 'Diet dimension',
          value: '+8',
          note: 'Score quality improved after hydration and breakfast rhythm became more consistent.',
        },
        {
          id: 'stress',
          label: 'Stress / mood',
          value: '+5',
          note: 'Check-in consistency and sleep management led to steadier recovery patterns.',
        },
        {
          id: 'movement',
          label: 'Movement habits',
          value: '+3',
          note: 'This is still the weakest dimension and is a strong candidate for the next improvement cycle.',
        },
      ],
    },
    snapshotsSection: {
      title: 'Historical snapshots',
      items: [
        {
          id: '2026-03',
          dateLabel: '2026.03',
          title: 'Rebuilding a stable baseline',
          score: '49',
          delta: '+4',
          primaryGoal: 'Stress / Mood',
          habit: 'Hydration streak: 12 days',
          highlight: 'OCR added vitamin D and ferritin markers, making the explanation chain more complete.',
        },
        {
          id: '2025-12',
          dateLabel: '2025.12',
          title: 'Turning check-in into the default',
          score: '45',
          delta: '+5',
          primaryGoal: 'Gut health',
          habit: '21-day check-in streak',
          highlight: 'More consistent probiotic and fiber execution led to steadier gut feedback.',
        },
        {
          id: '2025-09',
          dateLabel: '2025.09',
          title: 'First full assessment complete',
          score: '38',
          delta: 'Starting point',
          primaryGoal: 'Immunity',
          habit: 'Created the first daily reminder',
          highlight: 'The first report exposed the gap between nutrition and movement and created an executable plan.',
        },
      ],
    },
    milestonesSection: {
      title: 'Key milestones',
      items: [
        'Finished the first personal nutrition poster and established the baseline.',
        'Execution stability improved notably after a 21-day check-in streak.',
        'The first OCR enhancement extended the report from self-reported inputs into structured biomarkers.',
      ],
    },
    communityBridge: {
      eyebrow: 'Community support',
      title: 'Bring this progress back into the community',
      body: 'Head into the community to see how people with similar goals record habits, compare body feedback, and turn the next milestone into a repeatable routine.',
      cta: 'Go to community',
    },
    actions: {
      primary: 'Retake assessment',
      secondary: 'Back to current report',
    },
  },
};

export function getTimelineContent(locale = 'zh-CN') {
  return TIMELINE_CONTENT[locale] || TIMELINE_CONTENT['zh-CN'];
}

export function buildTimelineViewModel({ locale = 'zh-CN', session = {} } = {}) {
  const copy = getTimelineContent(locale);

  return {
    ...copy,
    snapshots: copy.snapshotsSection.items,
    latestMilestoneState: session.ocrResult?.status === 'confirmed' ? 'confirmed' : 'baseline',
  };
}
