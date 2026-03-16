"use client"

import { useEffect, useState } from "react"

import { ArrowLeft, BellDot } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchAccountNotificationDetail, markAccountNotificationRead } from "@/lib/account-api/client"
import type { AccountNotification } from "@/lib/account/types"

export function NotificationDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [notification, setNotification] = useState<AccountNotification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadNotification() {
      if (!params.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const detail = await fetchAccountNotificationDetail(locale, params.id)
      if (cancelled) {
        return
      }

      if (!detail) {
        setNotification(null)
        setLoading(false)
        return
      }

      if (detail.status === "unread") {
        const updated = await markAccountNotificationRead(locale, detail.id)
        if (!cancelled) {
          setNotification(updated ?? detail)
          setLoading(false)
        }
        return
      }

      setNotification(detail)
      setLoading(false)
    }

    void loadNotification()

    return () => {
      cancelled = true
    }
  }, [locale, params.id])

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_30%,#F8FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <button
          type="button"
          onClick={() => router.push("/profile/notifications")}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {content.notificationDetail.backCta}
        </button>

        {loading ? (
          <div className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_rgba(109,181,120,0.1)]">
            <p className="text-sm text-muted-foreground">{content.notificationsView.subtitle}</p>
          </div>
        ) : !notification ? (
          <div className="mt-5 rounded-[28px] border border-dashed border-[#CFE2CF] bg-white/85 px-4 py-10 text-center">
            <p className="text-base font-semibold text-foreground">{content.notificationsView.emptyTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.notificationsView.emptyBody}</p>
          </div>
        ) : (
          <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
              <BellDot className="h-3.5 w-3.5" />
              {content.labels.notificationTypes[notification.type]}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  notification.status === "unread"
                    ? "bg-[#E8F6EA] text-primary"
                    : "bg-[#F3F4F6] text-muted-foreground"
                }`}
              >
                {content.labels.notificationStatus[notification.status]}
              </span>
              <span className="rounded-full bg-[#F5F7F6] px-3 py-1 text-[11px] font-medium text-muted-foreground">
                {content.notificationDetail.timeLabel}: {notification.relativeTime}
              </span>
            </div>

            <h1 className="mt-5 text-[28px] font-semibold leading-9 text-foreground">{notification.title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.notificationDetail.autoReadHint}</p>

            <div className="mt-5 rounded-[24px] bg-[#F6FAF6] p-4">
              <p className="text-xs font-medium text-muted-foreground">{content.notificationDetail.sourceLabel}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {content.labels.notificationTypes[notification.type]}
              </p>
            </div>

            <div className="mt-5 rounded-[28px] border border-[#E5EFE5] bg-white px-4 py-5">
              <p className="text-sm leading-7 text-foreground">{notification.body}</p>
            </div>

            {notification.actionHref ? (
              <button
                type="button"
                onClick={() => router.push(notification.actionHref!)}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(109,181,120,0.24)]"
              >
                {content.notificationDetail.relatedActionCta}
              </button>
            ) : null}
          </section>
        )}
      </main>

      <SharedNav />
    </div>
  )
}
