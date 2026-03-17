const REPORT_CONTENT = {
  'zh-CN': {
    profile: {
      userName: 'baron',
    },
    header: {
      ownerSuffix: '的',
      posterTitle: '个人营养画报',
      swipeHint: '左滑查看详细建议',
    },
    metrics: {
      bmi: 48.5,
      totalScore: 49,
      scores: {
        diet: 57,
        physical: 60,
        mental: 73,
        exercise: 10,
      },
    },
    bmi: {
      label: 'BMI 指数',
      description:
        '你的身体质量指数 BMI = 48.5 kg/m²，属于肥胖范围，会提高心血管疾病、糖代谢异常和关节负担风险。建议通过均衡饮食、稳定作息和逐步增加活动量来做长期体重管理。',
    },
    scoreSummary: {
      label: '你的健康测评综合得分：',
      footnote: '*报告结果基于 FFQ 营养测评和 4 大维度专业健康评估',
    },
    dimensions: [
      { id: 'diet', label: '饮食' },
      { id: 'physical', label: '体质' },
      { id: 'mental', label: '心理' },
      { id: 'exercise', label: '运动' },
    ],
    goalsSection: {
      label: '本次改善目标：',
      primaryLabel: '首要目标：',
      primaryGoalId: 'stress',
      items: [
        { id: 'immunity', label: '免疫力' },
        { id: 'gut', label: '胃肠道功能' },
        { id: 'stress', label: '情绪/压力' },
      ],
    },
    dailyGoalSection: {
      title: '每日小目标',
      icon: '💧',
      itemTitle: '换个大水杯喝水吧',
      description:
        '多喝水有助于维持代谢和消化状态。你可以准备一个更顺手的大容量水杯，把补水变成随手就能完成的小动作。',
    },
    specialRemindersSection: {
      title: '特殊提醒',
      items: [
        '痛风或尿酸偏高人群应避免高嘌呤海鱼、动物内脏、浓肉汤和酒精，以免诱发或加重不适。',
        '备孕期女性建议从孕前 3 个月开始每日补充 400 μg 叶酸，并持续至孕早期。',
        '长期使用部分非甾体抗炎药时，维生素 C 消耗可能增加，应留意额外补充。',
      ],
    },
    dietAdviceSection: {
      title: '饮食建议',
      items: [
        {
          id: 'diet-01',
          number: '01',
          title: '增加富含铁的天然食物',
          content: '如果日常偏素食，建议优先增加谷物、豆类、坚果和深色蔬菜，同时搭配富含维生素 C 的食物，帮助铁吸收。',
        },
        {
          id: 'diet-02',
          number: '02',
          title: '维生素 C 缺口优先从饮食补齐',
          content: '增加橙柑、猕猴桃、彩椒、土豆和绿叶蔬菜摄入；如果饮食执行困难，再考虑使用补剂作为补充。',
        },
        {
          id: 'diet-03',
          number: '03',
          title: '每周至少吃 3 次深海鱼',
          content: '三文鱼、沙丁鱼等富含 Omega-3 的深海鱼有助于血脂管理和心血管健康，可作为优先蛋白来源。',
        },
      ],
    },
    exerciseAdviceSection: {
      title: '运动与作息',
      items: [
        {
          id: 'exercise-01',
          number: '01',
          title: '每周运动时长不少于 150 分钟',
          content: '久坐会增加代谢和心血管负担。建议用快走、骑行、力量训练等方式，把每周活动量稳定提升到 150 分钟以上。',
        },
      ],
      footnote: '*以上建议结合你的营养目标、饮食、运动和作息情况综合生成，用于帮助你建立更均衡的长期习惯。',
    },
    nutritionSection: {
      title: '改善目标营养方案',
      description: '根据你的改善目标，推荐以下营养补充方案',
      historyEntry: {
        title: '查看历史画报时间轴',
        body: '把每次评估、OCR 增补和打卡变化放到一条连续轨迹里。',
        cta: '进入时间轴',
      },
      cards: {
        immunity: [
          {
            id: 'vitamin-c',
            category: '免疫',
            name: '维生素 C',
            benefit: '增强免疫细胞活性，帮助身体建立更稳定的防护能力。',
          },
          {
            id: 'zinc',
            category: '免疫',
            name: '锌元素',
            benefit: '支持免疫系统发育与修复，也有助于伤口愈合和黏膜保护。',
          },
          {
            id: 'vitamin-d3',
            category: '阳光',
            name: '维生素 D3',
            benefit: '帮助调节免疫反应，也参与钙吸收和骨骼支持。',
          },
        ],
        gut: [
          {
            id: 'probiotics',
            category: '肠道',
            name: '益生菌',
            benefit: '帮助调节肠道菌群平衡，改善腹胀、排便和消化舒适度。',
          },
          {
            id: 'fiber',
            category: '肠道',
            name: '膳食纤维',
            benefit: '促进肠道蠕动并提升饱腹感，是改善日常饮食结构的基础。',
          },
          {
            id: 'glutamine',
            category: '修复',
            name: '谷氨酰胺',
            benefit: '支持肠道黏膜修复，帮助维持更稳定的肠道屏障。',
          },
        ],
        stress: [
          {
            id: 'magnesium',
            category: '压力',
            name: '镁元素',
            benefit: '帮助缓解紧张感，支持肌肉放松和睡眠质量。',
          },
          {
            id: 'b-complex',
            category: '脑力',
            name: 'B 族维生素',
            benefit: '支持神经系统与能量代谢，帮助改善疲劳和脑力负担。',
          },
          {
            id: 'omega-3',
            category: '稳态',
            name: 'Omega-3',
            benefit: '支持情绪稳定和大脑健康，是长期调节压力的常见基础营养。',
          },
        ],
      },
    },
    closingSection: {
      icon: '💡',
      note: '由于身体状态、生活习惯和营养目标会变化，建议每 3 个月重新完成一次评估问卷，并对比历史画报变化。',
      secondaryCta: '上传体检报告',
      primaryCta: '查看打卡计划',
    },
    actions: {
      retake: '重新开始测评',
    },
    ocrStates: {
      pending: {
        title: '补充 OCR 体检数据',
        body: '上传最近的体检报告后，营养解释链会更完整。',
        actionLabel: '去做 OCR 上传',
      },
      uploaded: {
        title: '继续确认 OCR 字段',
        body: '系统已识别关键指标，建议你先完成字段确认再看报告细节。',
        actionLabel: '继续 OCR 确认',
      },
      confirmed: {
        title: 'OCR 数据已确认',
        body: '这次报告已经吸收了结构化指标，可以继续查看历史变化和执行建议。',
        actionLabel: '重新查看 OCR',
      },
    },
  },
  en: {
    profile: {
      userName: 'baron',
    },
    header: {
      ownerSuffix: "'s",
      posterTitle: 'Nutrition Snapshot',
      swipeHint: 'Swipe left for detailed guidance',
    },
    metrics: {
      bmi: 48.5,
      totalScore: 49,
      scores: {
        diet: 57,
        physical: 60,
        mental: 73,
        exercise: 10,
      },
    },
    bmi: {
      label: 'BMI',
      description:
        'Your body mass index is 48.5 kg/m², which falls in the obesity range and raises long-term cardiometabolic and joint-health risk. A balanced diet, steadier routine, and gradual activity increases are the healthiest path to weight management.',
    },
    scoreSummary: {
      label: 'Your overall assessment score:',
      footnote: '*Generated from the FFQ nutrition assessment and four core health dimensions.',
    },
    dimensions: [
      { id: 'diet', label: 'Diet' },
      { id: 'physical', label: 'Body' },
      { id: 'mental', label: 'Mind' },
      { id: 'exercise', label: 'Activity' },
    ],
    goalsSection: {
      label: 'Priority improvement goals:',
      primaryLabel: 'Primary goal:',
      primaryGoalId: 'stress',
      items: [
        { id: 'immunity', label: 'Immunity' },
        { id: 'gut', label: 'Gut health' },
        { id: 'stress', label: 'Stress / Mood' },
      ],
    },
    dailyGoalSection: {
      title: 'Daily micro-goal',
      icon: '💧',
      itemTitle: 'Switch to a larger water bottle',
      description: 'Better hydration supports digestion and metabolic balance. Keeping a bottle you like within reach makes the habit much easier to repeat.',
    },
    specialRemindersSection: {
      title: 'Special reminders',
      items: [
        'If you have gout or elevated uric acid, avoid high-purine fish, organ meats, concentrated broths, and alcohol to reduce flare risk.',
        'If you are preparing for pregnancy, consider 400 μg of folic acid daily starting three months before conception and continuing into early pregnancy.',
        'Some long-term anti-inflammatory medicines can increase vitamin C depletion, so extra attention to intake may be helpful.',
      ],
    },
    dietAdviceSection: {
      title: 'Nutrition guidance',
      items: [
        {
          id: 'diet-01',
          number: '01',
          title: 'Increase naturally iron-rich foods',
          content: 'If your diet leans plant-based, prioritize grains, beans, nuts, and dark greens, and pair them with vitamin C-rich foods to improve iron absorption.',
        },
        {
          id: 'diet-02',
          number: '02',
          title: 'Close vitamin C gaps through food first',
          content: 'Add oranges, kiwi, peppers, potatoes, and leafy greens more consistently, then use supplements only if food intake stays difficult.',
        },
        {
          id: 'diet-03',
          number: '03',
          title: 'Eat deep-sea fish at least three times a week',
          content: 'Salmon, sardines, and other omega-3-rich fish support lipid balance and cardiovascular health and can be a preferred protein choice.',
        },
      ],
    },
    exerciseAdviceSection: {
      title: 'Movement and recovery',
      items: [
        {
          id: 'exercise-01',
          number: '01',
          title: 'Aim for at least 150 minutes of activity each week',
          content: 'Sedentary time increases metabolic and cardiovascular burden. Brisk walking, cycling, and light strength work are practical ways to build a steadier weekly baseline.',
        },
      ],
      footnote: '*These suggestions combine your goals, nutrition habits, movement, and routine to support a more balanced long-term lifestyle.',
    },
    nutritionSection: {
      title: 'Goal-based nutrition plan',
      description: 'Recommended nutrients based on your current improvement goals',
      historyEntry: {
        title: 'View poster history timeline',
        body: 'Place each assessment, OCR enhancement, and check-in change on one continuous track.',
        cta: 'Open timeline',
      },
      cards: {
        immunity: [
          {
            id: 'vitamin-c',
            category: 'Immune',
            name: 'Vitamin C',
            benefit: 'Supports immune-cell activity and helps the body maintain a steadier defense response.',
          },
          {
            id: 'zinc',
            category: 'Immune',
            name: 'Zinc',
            benefit: 'Supports immune development and repair while helping with tissue recovery and mucosal protection.',
          },
          {
            id: 'vitamin-d3',
            category: 'Sunlight',
            name: 'Vitamin D3',
            benefit: 'Helps regulate immune responses and also supports calcium absorption and bone health.',
          },
        ],
        gut: [
          {
            id: 'probiotics',
            category: 'Gut',
            name: 'Probiotics',
            benefit: 'Helps balance the gut microbiome and improve bloating, digestion, and bowel comfort.',
          },
          {
            id: 'fiber',
            category: 'Gut',
            name: 'Dietary Fiber',
            benefit: 'Supports bowel movement and satiety and is a core part of improving everyday diet quality.',
          },
          {
            id: 'glutamine',
            category: 'Repair',
            name: 'L-Glutamine',
            benefit: 'Supports gut-lining repair and helps maintain a stronger intestinal barrier.',
          },
        ],
        stress: [
          {
            id: 'magnesium',
            category: 'Stress',
            name: 'Magnesium',
            benefit: 'Supports muscle relaxation, calmer stress response, and better sleep quality.',
          },
          {
            id: 'b-complex',
            category: 'Focus',
            name: 'Vitamin B Complex',
            benefit: 'Supports the nervous system and energy metabolism and can help reduce fatigue load.',
          },
          {
            id: 'omega-3',
            category: 'Balance',
            name: 'Omega-3',
            benefit: 'Supports mood steadiness and brain health and is a common baseline nutrient for long-term stress care.',
          },
        ],
      },
    },
    closingSection: {
      icon: '💡',
      note: 'Because health status, habits, and goals change over time, retake the assessment every three months and compare the result with your poster history.',
      secondaryCta: 'Upload a health report',
      primaryCta: 'Open check-in plan',
    },
    actions: {
      retake: 'Retake assessment',
    },
    ocrStates: {
      pending: {
        title: 'Add OCR lab data',
        body: 'Upload a recent health report to make the recommendation evidence chain more complete.',
        actionLabel: 'Start OCR upload',
      },
      uploaded: {
        title: 'Continue OCR review',
        body: 'Key biomarkers have been extracted. Review them before you rely on the report details.',
        actionLabel: 'Continue OCR review',
      },
      confirmed: {
        title: 'OCR data confirmed',
        body: 'This report already includes structured biomarkers, so you can move on to trends and execution.',
        actionLabel: 'Review OCR again',
      },
    },
  },
};

function resolveOcrState(copy, session = {}) {
  if (session.ocrResult?.status === 'confirmed') {
    return {
      state: 'confirmed',
      ...copy.ocrStates.confirmed,
    };
  }

  if (session.ocrUpload) {
    return {
      state: 'uploaded',
      ...copy.ocrStates.uploaded,
    };
  }

  return {
    state: 'pending',
    ...copy.ocrStates.pending,
  };
}

export function getReportContent(locale = 'zh-CN') {
  return REPORT_CONTENT[locale] || REPORT_CONTENT['zh-CN'];
}

export function buildReportViewModel({ locale = 'zh-CN', session = {} } = {}) {
  const copy = getReportContent(locale);
  const primaryGoal =
    copy.goalsSection.items.find((item) => item.id === copy.goalsSection.primaryGoalId) || copy.goalsSection.items[0];

  return {
    header: copy.header,
    profile: copy.profile,
    ownerLabel: `${copy.profile.userName}${copy.header.ownerSuffix}`,
    metrics: copy.metrics,
    bmi: copy.bmi,
    scoreSummary: copy.scoreSummary,
    dimensions: copy.dimensions.map((dimension) => ({
      ...dimension,
      score: copy.metrics.scores[dimension.id],
    })),
    goalsSection: copy.goalsSection,
    primaryGoal,
    dailyGoal: copy.dailyGoalSection,
    reminders: copy.specialRemindersSection,
    dietAdvice: copy.dietAdviceSection,
    exerciseAdvice: copy.exerciseAdviceSection,
    nutritionSection: copy.nutritionSection,
    nutritionCards: copy.nutritionSection.cards[primaryGoal.id] || [],
    closingSection: copy.closingSection,
    actions: copy.actions,
    ocrStatus: resolveOcrState(copy, session),
  };
}
