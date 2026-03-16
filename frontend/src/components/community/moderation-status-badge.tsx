"use client"

import type { CommunityStatus } from "@/lib/community/types"

const statusClasses: Record<CommunityStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  pending_review: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  flagged: "bg-orange-100 text-orange-700",
  hidden: "bg-zinc-200 text-zinc-600",
}

type ModerationStatusBadgeProps = {
  status: CommunityStatus
  labels: Record<CommunityStatus, string>
}

export function ModerationStatusBadge({ status, labels }: ModerationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}
    >
      {labels[status]}
    </span>
  )
}
