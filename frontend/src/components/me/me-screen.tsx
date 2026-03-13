'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { useLocale } from '@/i18n/use-locale';

export function MeScreen() {
  const { t } = useLocale();

  return (
    <AppShell currentPath="/me" title={t('screen.meTitle')}>
      <section className="grid gap-4">
        {[t('screen.meCard1'), t('screen.meCard2'), t('screen.meCard3')].map(
          (item) => (
          <div
            key={item}
            className="rounded-[24px] border border-mint-line/70 bg-white/88 p-5 text-sm leading-6 text-mint-ink/72 shadow-[0_14px_28px_rgba(109,181,120,0.08)]"
          >
            {item}
          </div>
          )
        )}
      </section>
    </AppShell>
  );
}
