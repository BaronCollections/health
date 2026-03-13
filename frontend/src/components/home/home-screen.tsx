'use client';

import Link from 'next/link';

import { AppShell } from '@/components/app-shell/app-shell';
import { useLocale } from '@/i18n/use-locale';

export function HomeScreen() {
  const { t } = useLocale();

  return (
    <AppShell currentPath="/" title={t('shell.foundationTitle')}>
      <section className="space-y-5">
        <div className="rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(232,245,233,0.85))] p-6 shadow-[0_18px_34px_rgba(109,181,120,0.1)] ring-1 ring-white/70">
          <p className="text-sm font-medium text-mint-700">{t('home.badge')}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-mint-ink">
            {t('home.heading')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-mint-ink/72">
            {t('home.body')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/plan"
              className="rounded-full bg-mint-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(109,181,120,0.28)] transition hover:bg-mint-600"
            >
              {t('home.primaryCta')}
            </Link>
            <Link
              href="/me"
              className="rounded-full border border-mint-line bg-white px-5 py-3 text-sm font-semibold text-mint-700 transition hover:border-mint-300 hover:text-mint-800"
            >
              {t('home.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {[t('home.card1'), t('home.card2'), t('home.card3')].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-mint-line/70 bg-white/88 p-4 text-sm leading-6 text-mint-ink/75 shadow-[0_14px_28px_rgba(109,181,120,0.08)]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
