"use client"

import { Languages } from "lucide-react"

import { useLocale } from "@/i18n/use-locale"

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocale()

  const nextLabel =
    locale === "zh-CN"
      ? t("language.switchToEnglish")
      : t("language.switchToChinese")

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={nextLabel}
      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur transition hover:border-primary/40 hover:bg-white"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{nextLabel}</span>
    </button>
  )
}
