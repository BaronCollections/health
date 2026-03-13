import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  CalendarCheck2,
  Home,
  UserRound,
} from 'lucide-react';

export type AppNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  a11yLabel: string;
};

export const APP_NAME = 'MintBit';
export const APP_TAGLINE = 'Precision nutrition for the one person that matters right now.';

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { href: '/', icon: Home, label: 'Home', a11yLabel: 'Home' },
  { href: '/plan', icon: Activity, label: 'Plan', a11yLabel: 'Plan' },
  {
    href: '/check-in',
    icon: CalendarCheck2,
    label: 'Check-in',
    a11yLabel: 'Check-in',
  },
  {
    href: '/community',
    icon: AppWindow,
    label: 'Community',
    a11yLabel: 'Community',
  },
  { href: '/me', icon: UserRound, label: 'Me', a11yLabel: 'Me' },
];
