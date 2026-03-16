"use client"

import { useEffect, useMemo, useState } from "react"

import { BellDot, CheckCheck, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchAccountNotifications, markAccountNotificationsRead } from "@/lib/account-api/client"
import type { NotificationFilter } from "@/lib/account-api/types"
import { summarizeUnreadNotifications } from "@/lib/account/state"
import type { AccountNotification } from "@/lib/account/types"

const FILTER_ORDER: NotificationFilter[] = ["all", "system", "community", "checkin"]

export function NotificationsPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [notifications, setNotifications] = useState<AccountNotification[]>(content.notifications)
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")

  useEffect(() => {
    setNotifications(content.notifications)
    void fetchAccountNotifications(locale, "all").then((response) => {
      setNotifications(response.items)
    })
  }, [content.notifications, locale])

  const visibleNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications
    }

    return notifications.filter((notification) => notification.type === activeFilter)
  }, [activeFilter, notifications])

  const unreadSummary = summarizeUnreadNotifications(notifications)
  const visibleUnreadIds = visibleNotifications
    .filter((notification) => notification.status === "unread")
    .map((notification) => notification.id)

  const filterLabels = content.notificationsView.filters

  const filterCounts: Record<NotificationFilter, number> = {
    all: unreadSummary.all,
    system: unreadSummary.system,
    community: unreadSummary.community,
    checkin: unreadSummary.checkin,
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.2),_transparent_40%),linear-gradient(180deg,_#F3FAF3_0%,_#FFFFFF_38%,_#F7FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.16)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <BellDot className="h-3.5 w-3.5" />
            {content.notificationsView.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.notificationsView.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.notificationsView.subtitle}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {FILTER_ORDER.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-[22px] border px-4 py-4 text-left transition ${
                  activeFilter === filter
                    ? "border-primary bg-[#F2FAF3] shadow-[0_14px_24px_rgba(109,181,120,0.12)]"
                    : "border-[#E3EEE3] bg-[#FAFDFC]"
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">{filterLabels[filter]}</p>
                <p className="mt-3 text-2xl font-semibold text-foreground">{filterCounts[filter]}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/90 px-4 py-3 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
          <div>
            <p className="text-sm font-semibold text-foreground">{filterLabels[activeFilter]}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {visibleUnreadIds.length} / {visibleNotifications.length}
            </p>
          </div>
          <button
            type="button"
            disabled={!visibleUnreadIds.length}
            onClick={() => {
              void markAccountNotificationsRead(locale, visibleUnreadIds).then((response) => {
                setNotifications(response.items)
              })
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#BFD7C1]"
          >
            <CheckCheck className="h-4 w-4" />
            {content.notificationsView.batchRead}
          </button>
        </div>

        <section className="mt-5 space-y-4">
          {visibleNotifications.length ? (
            visibleNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => router.push(`/profile/notifications/${notification.id}`)}
                className="w-full rounded-[28px] border border-white/70 bg-white/90 p-4 text-left shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#EFF8F0] px-3 py-1 text-[11px] font-semibold text-primary">
                        {content.labels.notificationTypes[notification.type]}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          notification.status === "unread"
                            ? "bg-[#E8F6EA] text-primary"
                            : "bg-[#F3F4F6] text-muted-foreground"
                        }`}
                      >
                        {content.labels.notificationStatus[notification.status]}
                      </span>
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-foreground">{notification.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.preview}</p>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{notification.relativeTime}</p>
              </button>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#CFE2CF] bg-white/80 px-4 py-10 text-center">
              <p className="text-base font-semibold text-foreground">{content.notificationsView.emptyTitle}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.notificationsView.emptyBody}</p>
            </div>
          )}
        </section>
      </main>

      <SharedNav />
    </div>
  )
}
