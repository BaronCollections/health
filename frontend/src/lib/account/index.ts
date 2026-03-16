import type { Locale } from "@/i18n/types"

import accountEn from "./mock-content.en.json"
import accountZh from "./mock-content.json"
import type { AccountContent } from "./types"

const contentByLocale: Record<Locale, AccountContent> = {
  "zh-CN": accountZh as AccountContent,
  en: accountEn as AccountContent,
}

export function getAccountContent(locale: Locale) {
  return contentByLocale[locale]
}
