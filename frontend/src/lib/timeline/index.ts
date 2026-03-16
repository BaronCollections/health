import type { Locale } from "@/i18n/types"

import timelineEn from "./timeline-content.en.json"
import timelineZh from "./timeline-content.json"
import type { TimelineContent } from "./types"

const timelineContentByLocale: Record<Locale, TimelineContent> = {
  "zh-CN": timelineZh,
  en: timelineEn,
}

export const getTimelineContent = (locale: Locale): TimelineContent => timelineContentByLocale[locale]
