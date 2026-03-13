import { enMessages } from './en';
import { zhCNMessages } from './zh-CN';

import type { Locale, MessageDictionary } from '../types';

export const messagesByLocale: Record<Locale, MessageDictionary> = {
  'zh-CN': zhCNMessages,
  en: enMessages,
};
