import type { Locale } from "@/i18n/types"

import contentEn from "./mock-content.en.json"
import contentZh from "./mock-content.json"
import type { ReleaseChecklistContent } from "./types.ts"

const contentByLocale: Record<Locale, ReleaseChecklistContent> = {
  "zh-CN": contentZh as ReleaseChecklistContent,
  en: contentEn as ReleaseChecklistContent,
}

export function getReleaseChecklistContent(locale: Locale) {
  return contentByLocale[locale]
}
