"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchDeleteRequests, fetchExportRequests, fetchFeedbackRecords } from "@/lib/account-api/client"
import type { DeleteRequest, ExportRequest, FeedbackRecord } from "@/lib/account/types"

type AuditItem = {
  id: string
  title: string
  body: string
  timestamp: string
}

export function AuditLogPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>(content.exportRequests)
  const [deleteRequests, setDeleteRequests] = useState<DeleteRequest[]>(content.deleteRequests)
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>(content.feedbackRecords)

  useEffect(() => {
    void Promise.all([
      fetchExportRequests(locale),
      fetchDeleteRequests(locale),
      fetchFeedbackRecords(locale),
    ]).then(([exports, deletes, feedback]) => {
      setExportRequests(exports)
      setDeleteRequests(deletes)
      setFeedbackRecords(feedback)
    })
  }, [locale])

  const auditItems = useMemo<AuditItem[]>(() => {
    return [
      ...exportRequests.map((request) => ({
        id: request.id,
        title: content.exportCenter.title,
        body: `${content.labels.status[request.status]} · ${request.scopeSummary}`,
        timestamp: request.requestedAt,
      })),
      ...deleteRequests.map((request) => ({
        id: request.id,
        title: content.deleteCenter.title,
        body: `${content.labels.status[request.status]} · ${request.impactSummary}`,
        timestamp: request.submittedAt,
      })),
      ...feedbackRecords.map((record) => ({
        id: record.id,
        title: content.feedbackRecordsView.title,
        body: `${content.labels.status[record.status]} · ${record.subject}`,
        timestamp: record.submittedAt,
      })),
    ].sort((left, right) => right.timestamp.localeCompare(left.timestamp))
  }, [content, deleteRequests, exportRequests, feedbackRecords])

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_30%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/profile/privacy")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.labels.sections.data}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{content.auditView.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.auditView.subtitle}</p>
      </section>

      <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
        <h2 className="text-base font-semibold text-foreground">{content.documents.auditLog.title}</h2>
        <div className="mt-3 space-y-2">
          {content.documents.auditLog.body.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">{content.auditView.trailTitle}</h2>
        {auditItems.map((item) => (
          <div
            key={item.id}
            className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs font-medium text-muted-foreground">{item.timestamp}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
