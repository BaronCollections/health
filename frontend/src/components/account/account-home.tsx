"use client"

import { useEffect, useState } from "react"

import { BellDot, ChevronRight, ClipboardCheck, FileLock2, Headset, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import {
  fetchAccountNotifications,
  fetchDeleteRequests,
  fetchExportRequests,
  fetchFeedbackRecords,
} from "@/lib/account-api/client"
import type { AccountNotification, DeleteRequest, ExportRequest, FeedbackRecord } from "@/lib/account/types"
import {
  canWithdrawDeleteRequest,
  countOpenFeedbackRecords,
  getVisibleHomeCards,
  getActiveExportRequest,
  getLatestDeleteRequest,
  summarizeUnreadNotifications,
} from "@/lib/account/state"
import { readBrowserRuntimeSnapshot } from "@/lib/runtime/runtime"

const sectionIcons = {
  messages: BellDot,
  help: Headset,
  privacy: FileLock2,
  data: ShieldCheck,
  preferences: SlidersHorizontal,
  admin: ClipboardCheck,
}

export function AccountHome() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [notifications, setNotifications] = useState<AccountNotification[]>(content.notifications)
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>(content.feedbackRecords)
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>(content.exportRequests)
  const [deleteRequests, setDeleteRequests] = useState<DeleteRequest[]>(content.deleteRequests)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setNotifications(content.notifications)
    setFeedbackRecords(content.feedbackRecords)
    setExportRequests(content.exportRequests)
    setDeleteRequests(content.deleteRequests)
    setIsAdmin(readBrowserRuntimeSnapshot().isAdmin)
    void fetchAccountNotifications(locale, "all").then((response) => {
      setNotifications(response.items)
    })
    void fetchFeedbackRecords(locale).then((records) => {
      setFeedbackRecords(records)
    })
    void fetchExportRequests(locale).then((requests) => {
      setExportRequests(requests)
    })
    void fetchDeleteRequests(locale).then((requests) => {
      setDeleteRequests(requests)
    })
  }, [content.deleteRequests, content.exportRequests, content.feedbackRecords, content.notifications, locale])

  const unreadSummary = summarizeUnreadNotifications(notifications)
  const openFeedbackCount = countOpenFeedbackRecords(feedbackRecords)
  const activeExportRequest = getActiveExportRequest(exportRequests)
  const activeDeleteRequest = getLatestDeleteRequest(deleteRequests)
  const visibleCards = getVisibleHomeCards(content.home.cards, content.home.adminToolsCard, isAdmin)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.22),_transparent_44%),linear-gradient(180deg,_#F2FAF2_0%,_#FFFFFF_40%,_#F7FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.16)] backdrop-blur">
          <div className="inline-flex items-center rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            {content.home.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.home.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.home.subtitle}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-[#F4FAF5] p-4">
              <p className="text-xs font-medium text-muted-foreground">{content.home.summary.unreadLabel}</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{unreadSummary.all}</p>
            </div>
            <div className="rounded-[24px] bg-[#F4FAF5] p-4">
              <p className="text-xs font-medium text-muted-foreground">{content.home.summary.feedbackLabel}</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{openFeedbackCount}</p>
            </div>
            <div className="rounded-[24px] bg-[#F4FAF5] p-4">
              <p className="text-xs font-medium text-muted-foreground">{content.home.summary.exportLabel}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {activeExportRequest ? content.labels.status[activeExportRequest.status] : content.labels.status.idle}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#F4FAF5] p-4">
              <p className="text-xs font-medium text-muted-foreground">{content.home.summary.deleteLabel}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {activeDeleteRequest ? content.labels.status[activeDeleteRequest.status] : content.labels.status.idle}
              </p>
              {activeDeleteRequest && canWithdrawDeleteRequest(activeDeleteRequest) ? (
                <p className="mt-1 text-[11px] text-primary">{content.home.summary.withdrawHint}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-4">
          {visibleCards.map((card) => {
            const Icon = sectionIcons[card.id as keyof typeof sectionIcons]

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => router.push(card.href)}
                className="w-full rounded-[28px] border border-white/70 bg-white/90 p-4 text-left shadow-[0_20px_60px_rgba(109,181,120,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF8F0] text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">{card.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.body}</p>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-4 inline-flex rounded-full bg-[#F4FAF5] px-3 py-1.5 text-xs font-semibold text-primary">
                  {card.cta}
                </div>
              </button>
            )
          })}
        </section>
      </main>

      <SharedNav />
    </div>
  )
}
