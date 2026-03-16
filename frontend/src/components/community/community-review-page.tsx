"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft, CheckCircle2, Flag, MessageSquareWarning, RotateCcw, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { fetchModerationQueue, moderateCommunityItem } from "@/lib/community-api/client"
import type { ModerationAction } from "@/lib/community-api/types"
import { getCommunityContent } from "@/lib/community"
import type { ModerationQueueItem } from "@/lib/community/types"

import { ModerationStatusBadge } from "./moderation-status-badge"

const orderedStatuses = ["pending_review", "approved", "rejected", "flagged"] as const

const actionConfig: Record<
  ModerationAction,
  { icon: typeof CheckCircle2; getLabel: (content: ReturnType<typeof getCommunityContent>) => string }
> = {
  approve: { icon: CheckCircle2, getLabel: (content) => content.review.actions.approve },
  reject: { icon: XCircle, getLabel: (content) => content.review.actions.reject },
  flag: { icon: Flag, getLabel: (content) => content.review.actions.flag },
  restore: { icon: RotateCcw, getLabel: (content) => content.review.actions.restore },
}

const nextStatusByAction: Record<ModerationAction, (typeof orderedStatuses)[number]> = {
  approve: "approved",
  reject: "rejected",
  flag: "flagged",
  restore: "pending_review",
}

export function CommunityReviewPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getCommunityContent(locale)
  const [items, setItems] = useState<ModerationQueueItem[]>(content.reviewQueue)
  const [activeStatus, setActiveStatus] = useState<(typeof orderedStatuses)[number]>("pending_review")
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    void fetchModerationQueue(locale, activeStatus).then((response) => {
      if (response.length) {
        setItems((previous) => {
          const untouched = previous.filter((item) => item.currentStatus !== activeStatus)
          return [...untouched, ...response]
        })
      }
    })
  }, [activeStatus, locale])

  const filteredItems = useMemo(
    () => items.filter((item) => item.currentStatus === activeStatus),
    [activeStatus, items],
  )

  const handleAction = async (item: ModerationQueueItem, action: ModerationAction) => {
    const nextStatus = nextStatusByAction[action]
    setBusyId(item.targetId)
    setItems((previous) =>
      previous.map((entry) =>
        entry.targetId === item.targetId ? { ...entry, currentStatus: nextStatus } : entry,
      ),
    )

    try {
      const updated = await moderateCommunityItem(item.targetType, item.targetId, action, {
        reason: content.review.actions[action],
        reviewerId: "ops-h5",
      })

      setItems((previous) =>
        previous.map((entry) => (entry.targetId === updated.targetId ? updated : entry)),
      )
    } catch {
      // Keep optimistic local state when the mock API is unavailable.
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#EEF7EF_0%,#FFFFFF_26%,#F7FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.detail.backCta}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquareWarning className="h-3.5 w-3.5" />
          Ops H5
        </div>
        <h1 className="mt-4 text-[26px] font-semibold leading-8 text-foreground">{content.review.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.review.subtitle}</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {orderedStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                activeStatus === status ? "bg-primary text-white" : "bg-[#F4FAF5] text-primary"
              }`}
            >
              {content.review.tabs[status]}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[30px] border border-white/80 bg-white/90 p-4 shadow-[0_20px_60px_rgba(109,181,120,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D7F0DE] to-[#6DB578] text-sm font-bold text-white">
                    {item.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-foreground">{item.authorName}</h2>
                      <ModerationStatusBadge status={item.currentStatus} labels={content.statuses} />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.targetType === "post" ? content.review.targetPost : content.review.targetComment} · {item.circleName}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{item.relativeTime}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-foreground">{item.contentPreview}</p>
              <div className="mt-3 rounded-2xl bg-[#FFF7EA] px-3 py-2 text-xs leading-5 text-[#8C5A13]">
                {item.moderationReason}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {(activeStatus === "pending_review"
                  ? (["approve", "reject", "flag"] as const)
                  : activeStatus === "flagged" || activeStatus === "rejected"
                    ? (["restore", "approve"] as const)
                    : (["flag", "restore"] as const)
                ).map((action) => {
                  const { icon: Icon, getLabel } = actionConfig[action]
                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => void handleAction(item, action)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F4FAF5] px-4 py-3 text-sm font-semibold text-primary disabled:opacity-50"
                      disabled={busyId === item.targetId}
                    >
                      <Icon className="h-4 w-4" />
                      {getLabel(content)}
                    </button>
                  )
                })}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#CCE0CD] bg-white/85 px-4 py-10 text-center">
            <p className="text-base font-semibold text-foreground">{content.review.queueEmptyTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.review.queueEmptyBody}</p>
          </div>
        )}
      </section>
    </div>
  )
}
