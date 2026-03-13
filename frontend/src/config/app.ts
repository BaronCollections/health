import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  CalendarCheck2,
  Home,
  UserRound,
} from 'lucide-react';

import type { MessageKey } from '@/i18n/types';

export type AppNavItem = {
  href: string;
  icon: LucideIcon;
  labelKey: MessageKey;
};

export const APP_NAME = 'MintBit';

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { href: '/', icon: Home, labelKey: 'nav.home' },
  { href: '/plan', icon: Activity, labelKey: 'nav.plan' },
  {
    href: '/check-in',
    icon: CalendarCheck2,
    labelKey: 'nav.checkIn',
  },
  {
    href: '/community',
    icon: AppWindow,
    labelKey: 'nav.community',
  },
  { href: '/me', icon: UserRound, labelKey: 'nav.me' },
];
