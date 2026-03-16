import type { Locale } from "@/i18n/types"

import reportEn from "./report-content.en.json"
import reportZh from "./report-content.json"
import type { ReportContent, ReportGoalId } from "./types"

const reportContentByLocale: Record<Locale, ReportContent> = {
  "zh-CN": reportZh,
  en: reportEn,
}

export const getReportContent = (locale: Locale): ReportContent => reportContentByLocale[locale]

export const getReportGoalLabel = (content: ReportContent, goalId: ReportGoalId) => {
  return content.goalsSection.items.find((goal) => goal.id === goalId)?.label ?? goalId
}
