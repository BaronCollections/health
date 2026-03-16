export const MINTBIT_COPY = {
  'zh-CN': {
    brandName: 'MintBit',
    common: {
      comingSoon: '该模块正在迁移到原生小程序',
      continue: '继续',
      switchLanguage: '语言',
    },
    tabBar: {
      home: '首页',
      report: '报告',
      checkin: '打卡',
      community: '社区',
      profile: '我的',
    },
    home: {
      eyebrow: '小雅粒子助手',
      heroTitle: '今天开始，建立更适合你的营养节律',
      heroBody: '完成评估、上传体检报告、保存每日方案，后续会逐步迁移到原生小程序体验。',
      primaryCta: '开始健康评估',
      secondaryCta: '查看营养报告',
      cards: [
        {
          id: 'assessment',
          title: 'AI 评估',
          body: '问卷、OCR、推荐报告会沿用 health 仓库现有后端接口。',
        },
        {
          id: 'plan',
          title: '我的方案',
          body: '打卡、收藏和历史画报会在后续域迁移中接入。',
        },
        {
          id: 'community',
          title: '社区陪伴',
          body: '社区浏览、发帖和互动会迁移为原生页面。',
        },
      ],
    },
    profile: {
      title: '账户中心',
      subtitle: '通知、帮助、隐私与数据操作会从这里统一进入。',
      cards: [
        { id: 'notifications', title: '消息与通知', body: '查看系统通知、社区互动和打卡提醒。', href: '/pages/report/index/index' },
        { id: 'help', title: '帮助与反馈', body: '提交反馈表单并跟踪处理状态。', href: '/pages/community/index/index' },
        { id: 'privacy', title: '隐私与数据', body: '数据导出、删除申请和审计说明入口。', href: '/pages/profile/index/index' },
      ],
      guestTitle: '当前未绑定手机号',
      guestBody: '先通过微信登录，再绑定现有手机号账号。',
      authCta: '去绑定',
    },
    auth: {
      loginTitle: '微信登录',
      loginBody: '使用微信身份进入 MintBit，再通过手机号短信验证绑定现有账号。',
      loginCta: '微信登录并继续',
      bindTitle: '绑定现有账号',
      bindBody: '输入手机号和短信验证码，绑定你已有的 MintBit 账户。',
      bindPhoneLabel: '手机号',
      bindCodeLabel: '验证码',
      bindSendCode: '发送验证码',
      bindSubmit: '完成绑定',
    },
    shells: {
      report: {
        title: '营养报告',
        body: '报告、时间轴和 OCR 流会在下一阶段继续迁移。',
      },
      checkin: {
        title: '每日打卡',
        body: '打卡与方案联动能力将在下一阶段补齐。',
      },
      community: {
        title: '社区',
        body: '社区原生流会在后续域迁移中接入发帖、评论与审核状态。',
      },
    },
  },
  en: {
    brandName: 'MintBit',
    common: {
      comingSoon: 'This area is still being migrated into the native mini program.',
      continue: 'Continue',
      switchLanguage: 'Language',
    },
    tabBar: {
      home: 'Home',
      report: 'Report',
      checkin: 'Check-In',
      community: 'Community',
      profile: 'Profile',
    },
    home: {
      eyebrow: 'Xiaoya Particle Assistant',
      heroTitle: 'Build a plan that fits your body today',
      heroBody: 'Assessment, lab-report upload, and personalized plans will continue to move into the native mini program experience.',
      primaryCta: 'Start assessment',
      secondaryCta: 'Open report',
      cards: [
        {
          id: 'assessment',
          title: 'AI Assessment',
          body: 'Questionnaire, OCR, and report contracts will reuse the current health backend.',
        },
        {
          id: 'plan',
          title: 'My Plan',
          body: 'Check-in, saved plans, and history posters will be wired in later migration domains.',
        },
        {
          id: 'community',
          title: 'Community',
          body: 'Feed browsing, posting, and interactions will move into native pages next.',
        },
      ],
    },
    profile: {
      title: 'Account Center',
      subtitle: 'Notifications, help, privacy, and data actions will all enter from here.',
      cards: [
        { id: 'notifications', title: 'Notifications', body: 'System notices, community interactions, and check-in reminders.', href: '/pages/report/index/index' },
        { id: 'help', title: 'Help & Feedback', body: 'Submit feedback and follow its review status.', href: '/pages/community/index/index' },
        { id: 'privacy', title: 'Privacy & Data', body: 'Data export, deletion requests, and audit disclosures.', href: '/pages/profile/index/index' },
      ],
      guestTitle: 'Your phone account is not bound yet',
      guestBody: 'Sign in with WeChat first, then bind your existing phone-based MintBit account.',
      authCta: 'Bind account',
    },
    auth: {
      loginTitle: 'WeChat Sign In',
      loginBody: 'Use your WeChat identity to enter MintBit, then bind your existing account with phone SMS verification.',
      loginCta: 'Sign in with WeChat',
      bindTitle: 'Bind Existing Account',
      bindBody: 'Enter your phone number and SMS code to bind your existing MintBit account.',
      bindPhoneLabel: 'Phone number',
      bindCodeLabel: 'Verification code',
      bindSendCode: 'Send code',
      bindSubmit: 'Complete binding',
    },
    shells: {
      report: {
        title: 'Nutrition Report',
        body: 'Report, timeline, and OCR flows will continue to migrate in the next domain.',
      },
      checkin: {
        title: 'Daily Check-In',
        body: 'Check-in and saved-plan linkage will be connected in the next migration step.',
      },
      community: {
        title: 'Community',
        body: 'Posting, comments, and moderation states will move into native pages in a later domain.',
      },
    },
  },
};
