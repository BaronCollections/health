"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import { FallbackBadge } from "@/components/shared/fallback-badge"
import { PageState } from "@/components/shared/page-state"
import { useLocale } from "@/i18n/use-locale"
import { fetchOcrResult } from "@/lib/ocr-api/client"
import type { OcrResultApiResponse } from "@/lib/ocr-api/types"
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
  const [apiResult, setApiResult] = useState<OcrResultApiResponse | null>(null)
  const [isLoadingResult, setIsLoadingResult] = useState(false)

  useEffect(() => {
    setUploadSession(getOcrUploadSession())
  }, [])

  useEffect(() => {
    if (!uploadSession?.assessmentId) {
      return
    }

    let cancelled = false
    setIsLoadingResult(true)

    fetchOcrResult(uploadSession.assessmentId)
      .then((result) => {
        if (!cancelled) {
          setApiResult(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiResult(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingResult(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [uploadSession?.assessmentId])

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

  const resolvedSections = useMemo(() => {
    if (!apiResult) {
      return content.sections
    }

    const sectionMap = new Map(apiResult.sections.map((section) => [section.id, section]))

    return content.sections.map((section) => {
      const apiSection = sectionMap.get(section.id)

      if (!apiSection) {
        return section
      }

      const fieldMap = new Map(apiSection.fields.map((field) => [field.id, field]))

      return {
        ...section,
        fields: section.fields.map((field) => {
          const apiField = fieldMap.get(field.id)

          if (!apiField) {
            return field
          }

          return {
            ...field,
            value: apiField.value,
            confidence: apiField.confidence,
          }
        }),
      }
    })
  }, [apiResult, content.sections])

  const fallbackNotice =
    !apiResult || uploadSession?.syncStatus !== "uploaded"
      ? locale === "zh-CN"
        ? "当前先展示本地确认模板，接口结果可用后会覆盖字段值。"
        : "The local confirmation template is shown first and will be replaced when API results are available."
      : null

  if (!uploadSession) {
    return (
      <div className="min-h-screen bg-[#F6FAF4] flex flex-col max-w-md mx-auto px-4 py-16">
        <PageState
          tone="error"
          title={locale === "zh-CN" ? "没有可确认的 OCR 记录" : "No OCR record to confirm"}
          body={
            locale === "zh-CN"
              ? "请先返回报告页重新上传体检报告。"
              : "Return to the report page and upload a health report first."
          }
          actionLabel={locale === "zh-CN" ? "返回报告页" : "Back to report"}
          onAction={() => router.push("/report")}
        />
      </div>
    )
  }

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
              {apiResult?.sourceSummary && (
                <p className="text-xs text-muted-foreground mt-3">{apiResult.sourceSummary}</p>
              )}
            </div>
          </div>
        </section>

        {fallbackNotice ? (
          <FallbackBadge label={fallbackNotice} tone={isLoadingResult ? "info" : "warning"} />
        ) : null}

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

        {resolvedSections.map((section) => (
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
