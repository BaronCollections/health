"use client"

import { getFallbackBadgeMeta, type FallbackBadgeTone } from "./page-state.helpers"

type FallbackBadgeProps = {
  label: string
  tone?: FallbackBadgeTone
}

export function FallbackBadge({ label, tone = "info" }: FallbackBadgeProps) {
  const meta = getFallbackBadgeMeta(tone)

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${meta.wrapperClassName}`}>
      <span className={`h-2 w-2 rounded-full ${meta.dotClassName}`} />
      {label}
    </div>
  )
}
