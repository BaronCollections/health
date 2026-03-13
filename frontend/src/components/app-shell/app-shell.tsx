import type { ReactNode } from 'react';

import { APP_NAME, APP_TAGLINE } from '@/config/app';

import { AppNav } from './app-nav';
import { XiaoyaOrb } from './xiaoya-orb';

type AppShellProps = {
  children: ReactNode;
  currentPath: string;
  title: string;
  eyebrow?: string;
};

export function AppShell({
  children,
  currentPath,
  title,
  eyebrow = APP_NAME,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-mint-canvas text-mint-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="px-5 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4 rounded-[28px] bg-white/88 px-5 py-5 shadow-[0_20px_40px_rgba(109,181,120,0.12)] ring-1 ring-white/65 backdrop-blur-xl">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint-600">
                {eyebrow}
              </p>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-mint-ink">
                  {title}
                </h1>
                <p className="text-sm leading-6 text-mint-ink/70">{APP_TAGLINE}</p>
              </div>
            </div>
            <XiaoyaOrb />
          </div>
        </header>

        <main className="flex-1 px-5 pb-6">{children}</main>

        <AppNav currentPath={currentPath} />
      </div>
    </div>
  );
}
