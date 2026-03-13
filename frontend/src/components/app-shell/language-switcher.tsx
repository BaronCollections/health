'use client';

import { useLocale } from '@/i18n/use-locale';

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocale();

  const nextLabel =
    locale === 'zh-CN'
      ? t('language.switchToEnglish')
      : t('language.switchToChinese');

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={nextLabel}
      className="rounded-full border border-mint-line bg-white px-3 py-1.5 text-xs font-semibold text-mint-700 transition hover:border-mint-300 hover:text-mint-800"
    >
      {nextLabel}
    </button>
  );
}
