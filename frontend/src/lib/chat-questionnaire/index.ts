import type { Locale } from "@/i18n/types"

import enContent from "./chat-questionnaire.en.json"
import zhContent from "./chat-questionnaire.json"
import type { ChatQuestionnaireContent } from "./types"

const contentByLocale: Record<Locale, ChatQuestionnaireContent> = {
  "zh-CN": zhContent,
  en: enContent,
}

export const getChatQuestionnaireContent = (locale: Locale): ChatQuestionnaireContent => contentByLocale[locale]
