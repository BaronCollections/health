"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchFeedbackRecords } from "@/lib/account-api/client"
import type { FeedbackRecord, FeedbackStatus } from "@/lib/account/types"

const FEEDBACK_STATUS_ORDER: FeedbackStatus[] = ["submitted", "in_review", "responded", "closed", "draft"]

export function FeedbackRecordsPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [records, setRecords] = useState<FeedbackRecord[]>(content.feedbackRecords)

  useEffect(() => {
    setRecords(content.feedbackRecords)
    void fetchFeedbackRecords(locale).then((items) => {
      setRecords(items)
    })
  }, [content.feedbackRecords, locale])

  const groupedRecords = useMemo(() => {
    const groups = new Map<FeedbackStatus, FeedbackRecord[]>()
    for (const status of FEEDBACK_STATUS_ORDER) {
      groups.set(status, [])
    }
    for (const record of records) {
      groups.get(record.status)?.push(record)
    }
    return FEEDBACK_STATUS_ORDER.filter((status) => (groups.get(status)?.length ?? 0) > 0).map((status) => ({
      status,
      title: content.feedbackRecordsView.groupTitles[status],
      records: groups.get(status) ?? [],
    }))
  }, [content.feedbackRecordsView.groupTitles, records])

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_30%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/profile/help")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.helpCenter.backCta}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{content.feedbackRecordsView.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.feedbackRecordsView.subtitle}</p>
      </section>

      <section className="mt-5 space-y-5">
        {groupedRecords.length ? (
          groupedRecords.map((group) => (
            <div key={group.status} className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">{group.title}</h2>
              {group.records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-[#EFF8F0] px-3 py-1 text-[11px] font-semibold text-primary">
                        {record.category}
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-foreground">{record.subject}</h3>
                    </div>
                    <span className="rounded-full bg-[#F4F7F5] px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                      {content.labels.status[record.status]}
                    </span>
                  </div>
                  {record.description ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.description}</p>
                  ) : null}
                  <p className="mt-3 text-xs font-medium text-muted-foreground">{record.submittedAt}</p>
                  {record.reply ? (
                    <div className="mt-4 rounded-[22px] bg-[#F6FAF6] p-4">
                      <p className="text-xs font-medium text-muted-foreground">{content.labels.status.responded}</p>
                      <p className="mt-2 text-sm leading-6 text-foreground">{record.reply}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#CFE2CF] bg-white/85 px-4 py-10 text-center">
            <p className="text-base font-semibold text-foreground">{content.feedbackRecordsView.emptyTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.feedbackRecordsView.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  )
}
