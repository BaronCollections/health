'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { PRIMARY_NAV_ITEMS } from '@/config/app';
import { cn } from '@/lib/utils';

type AppNavProps = {
  currentPath: string;
};

export function AppNav({ currentPath }: AppNavProps) {
  const normalizedPath = useMemo(
    () => (currentPath === '' ? '/' : currentPath),
    [currentPath]
  );

  return (
    <nav className="sticky bottom-0 z-20 mt-auto border-t border-mint-line/70 bg-white/90 px-4 pb-6 pt-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = normalizedPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.a11yLabel}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors',
                isActive
                  ? 'bg-mint-50 text-mint-700'
                  : 'text-mint-ink/68 hover:bg-mint-50/80 hover:text-mint-700'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2.2 : 1.9} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
