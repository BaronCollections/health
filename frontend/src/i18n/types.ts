export const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type MessageKey =
  | 'nav.home'
  | 'nav.plan'
  | 'nav.checkIn'
  | 'nav.community'
  | 'nav.me'
  | 'language.switchToEnglish'
  | 'language.switchToChinese'
  | 'shell.eyebrow'
  | 'shell.foundationTitle'
  | 'shell.tagline'
  | 'home.badge'
  | 'home.heading'
  | 'home.body'
  | 'home.primaryCta'
  | 'home.secondaryCta'
  | 'home.card1'
  | 'home.card2'
  | 'home.card3'
  | 'screen.planTitle'
  | 'screen.planBody'
  | 'screen.checkInTitle'
  | 'screen.checkInBody'
  | 'screen.communityTitle'
  | 'screen.communityBody'
  | 'screen.meTitle'
  | 'screen.meCard1'
  | 'screen.meCard2'
  | 'screen.meCard3';

export type MessageDictionary = Record<MessageKey, string>;
