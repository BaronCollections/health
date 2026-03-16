"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getOcrConfirmationContent } from "@/lib/ocr"
import { formatOcrFileSize, getOcrUploadSession, type OcrUploadSession } from "@/lib/ocr/session"
import type { OcrFieldConfidence } from "@/lib/ocr/types"

import { SharedNav } from "./shared-nav"

const confidenceBadgeStyles: Record<OcrFieldConfidence, string> = {
  high: "bg-[#E9F8EF] text-[#2E7D4F]",
  medium: "bg-[#FFF6E4] text-[#AA6A00]",
  low: "bg-[#FDEBEC] text-[#B23A48]",
}

export function OcrConfirmationPage() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const content = getOcrConfirmationContent(locale)
  const confidenceBadges = content.confidenceBadges as Record<OcrFieldConfidence, string>
  const [uploadSession, setUploadSession] = useState<OcrUploadSession | null>(null)

  useEffect(() => {
    setUploadSession(getOcrUploadSession())
  }, [])

  const getConfidenceLabel = (confidence: OcrFieldConfidence) => {
    return confidenceBadges[confidence]
  }

  const uploadMeta = useMemo(() => {
    if (!uploadSession) {
      return null
    }

    const dateFormatter = new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    return `${formatOcrFileSize(uploadSession.fileSize)} · ${dateFormatter.format(new Date(uploadSession.uploadedAt))}`
  }, [locale, uploadSession])

  return (
    <div className="min-h-screen bg-[#F6FAF4] flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            aria-label={content.actions.returnLabel}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-white"
            onClick={() => router.push("/report")}
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{content.header.title}</p>
            <p className="text-xs text-muted-foreground truncate">{t("brand.name")}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4 pb-24">
        <section className="rounded-3xl bg-white p-5 border border-[#DDECDC] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">{content.statusCard.eyebrow}</p>
              <h1 className="text-lg font-bold text-foreground mt-1">{content.statusCard.title}</h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.header.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.statusCard.description}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{content.fileMeta.label}</p>
              <p className="text-sm font-medium text-foreground mt-1">{uploadSession?.fileName ?? content.fileMeta.value}</p>
              {uploadMeta && <p className="text-xs text-muted-foreground mt-1">{uploadMeta}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{content.fileMeta.confidenceLabel}</p>
              <span className="inline-flex mt-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FFF6E4] text-[#AA6A00]">
                {content.fileMeta.confidenceValue}
              </span>
            </div>
          </div>
        </section>

        {content.sections.map((section) => (
          <section key={section.id} className="rounded-3xl bg-white p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-foreground">{section.title}</h2>
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            </div>

            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.id} className="rounded-2xl border border-[#E8EEE7] bg-[#FAFCF9] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{field.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{field.value}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium ${confidenceBadgeStyles[field.confidence]}`}>
                      {getConfidenceLabel(field.confidence)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{field.note}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">{content.auditTrail.title}</h2>
          </div>
          <div className="space-y-3">
            {content.auditTrail.items.map((item) => (
              <div key={item} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-4">{content.footnote}</p>
        </section>
      </main>

      <div className="sticky bottom-0 bg-white border-t border-border px-4 py-4 space-y-3">
        <button
          onClick={() => router.push("/report")}
          className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
        >
          {content.actions.primary}
        </button>
        <button
          onClick={() => router.push("/report")}
          className="w-full py-3.5 rounded-full border border-border text-foreground font-medium bg-white"
        >
          {content.actions.secondary}
        </button>
      </div>

      <SharedNav />
    </div>
  )
}
