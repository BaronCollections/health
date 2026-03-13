'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { useLocale } from '@/i18n/use-locale';

export function CommunityScreen() {
  const { t } = useLocale();

  return (
    <AppShell currentPath="/community" title={t('screen.communityTitle')}>
      <section className="rounded-[28px] border border-mint-line/70 bg-white/88 p-6 shadow-[0_18px_34px_rgba(109,181,120,0.08)]">
        <p className="text-sm leading-6 text-mint-ink/72">
          {t('screen.communityBody')}
        </p>
      </section>
    </AppShell>
  );
}
