import type { Locale } from "@/i18n/types"

import communityTimelineEn from "./community-timeline.en.json"
import communityTimelineZh from "./community-timeline.json"
import type { CommunityTimelineContent } from "./types"

const communityTimelineByLocale: Record<Locale, CommunityTimelineContent> = {
  "zh-CN": communityTimelineZh,
  en: communityTimelineEn,
}

export const getCommunityTimelineContent = (locale: Locale): CommunityTimelineContent =>
  communityTimelineByLocale[locale]
