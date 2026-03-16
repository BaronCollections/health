"use client"

import { useEffect, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { createExportRequest, fetchExportRequests } from "@/lib/account-api/client"
import { getActiveExportRequest } from "@/lib/account/state"
import type { ExportRequest } from "@/lib/account/types"

export function ExportRequestPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [requests, setRequests] = useState<ExportRequest[]>(content.exportRequests)
  const [scopeSummary, setScopeSummary] = useState(content.exportCenter.defaultScopeSummary)

  useEffect(() => {
    setRequests(content.exportRequests)
    void fetchExportRequests(locale).then((items) => {
      setRequests(items)
    })
  }, [content.exportRequests, locale])

  const activeRequest = getActiveExportRequest(requests)

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_32%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/profile/privacy")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.labels.sections.privacy}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{content.exportCenter.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.exportCenter.subtitle}</p>

        <div className="mt-6 rounded-[24px] bg-[#F6FAF6] p-4">
          <p className="text-xs font-medium text-muted-foreground">{content.exportCenter.scopeLabel}</p>
          <textarea
            value={scopeSummary}
            onChange={(event) => setScopeSummary(event.target.value)}
            placeholder={content.exportCenter.scopePlaceholder}
            rows={4}
            className="mt-3 w-full rounded-[18px] border border-[#DCE9DD] bg-white px-4 py-3 text-sm leading-6 text-foreground outline-none"
          />
          <button
            type="button"
            onClick={() => {
              void createExportRequest(locale, { scopeSummary }).then((request) => {
                setRequests((current) => [request, ...current])
              })
            }}
            className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            {content.exportCenter.requestCta}
          </button>
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {activeRequest ? (
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
            <p className="text-xs font-medium text-muted-foreground">{content.exportCenter.activeLabel}</p>
            <p className="mt-3 text-base font-semibold text-foreground">{content.labels.status[activeRequest.status]}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeRequest.scopeSummary}</p>
          </div>
        ) : null}

        {requests.length ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">{request.id}</p>
                <span className="rounded-full bg-[#F4F7F5] px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {content.labels.status[request.status]}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{request.scopeSummary}</p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">{request.requestedAt}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#CFE2CF] bg-white/85 px-4 py-10 text-center">
            <p className="text-base font-semibold text-foreground">{content.exportCenter.emptyTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.exportCenter.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  )
}
