"use client"

import { useEffect, useState } from "react"

import { FileLock2, History, ShieldCheck, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { FallbackBadge } from "@/components/shared/fallback-badge"
import { PageState } from "@/components/shared/page-state"
import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchAccountSecuritySnapshot } from "@/lib/account-api/client"
import type { AccountSecurity } from "@/lib/account/types"

const documentOrder = ["privacyPolicy", "userAgreement", "ocrUsage", "communityVisibility"] as const

export function PrivacyCenterPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [security, setSecurity] = useState<AccountSecurity>(content.security)
  const [isRefreshing, setIsRefreshing] = useState(true)

  const fallbackLabel =
    locale === "zh-CN"
      ? "隐私、OCR 和审计文档内置在应用中，确保接口异常时仍可访问。"
      : "Privacy, OCR, and audit documents are bundled with the app so they stay reachable during API outages."

  useEffect(() => {
    setSecurity(content.security)
    setIsRefreshing(true)
    void fetchAccountSecuritySnapshot(locale)
      .then((snapshot) => {
        setSecurity(snapshot)
      })
      .finally(() => {
        setIsRefreshing(false)
      })
  }, [content.security, locale])

  const notificationEntries = Object.entries(security.notificationPreferences)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.18),_transparent_38%),linear-gradient(180deg,_#F3FAF3_0%,_#FFFFFF_40%,_#F8FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <FileLock2 className="h-3.5 w-3.5" />
            {content.labels.sections.privacy}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.privacyCenter.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.privacyCenter.subtitle}</p>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
          <FallbackBadge label={fallbackLabel} />

          <p className="text-xs font-medium text-muted-foreground">{content.privacyCenter.notificationPrefsLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {notificationEntries.length ? (
              notificationEntries.map(([key, enabled]) => (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    enabled ? "bg-[#E8F6EA] text-primary" : "bg-[#F4F5F7] text-muted-foreground"
                  }`}
                >
                  {content.labels.notificationTypes[key as keyof typeof content.labels.notificationTypes]} ·{" "}
                  {enabled ? content.securityView.enabledLabel : content.securityView.disabledLabel}
                </span>
              ))
            ) : (
              <PageState
                tone={isRefreshing ? "loading" : "empty"}
                title={isRefreshing ? (locale === "zh-CN" ? "权限信息加载中" : "Loading permissions") : locale === "zh-CN" ? "暂无权限信息" : "No permissions available"}
                body={
                  isRefreshing
                    ? locale === "zh-CN"
                      ? "正在同步通知和 OCR 授权状态。"
                      : "Syncing notification and OCR authorization states."
                    : locale === "zh-CN"
                      ? "稍后再试，或从账户设置页重新进入。"
                      : "Try again later, or reopen this page from account settings."
                }
              />
            )}
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile/security")}
            className="rounded-[26px] border border-[#DDECDC] bg-white px-4 py-5 text-left"
          >
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-5 text-sm font-semibold text-foreground">{content.privacyCenter.securityCta}</p>
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile/audit-log")}
            className="rounded-[26px] border border-[#DDECDC] bg-white px-4 py-5 text-left"
          >
            <History className="h-5 w-5 text-primary" />
            <p className="mt-5 text-sm font-semibold text-foreground">{content.privacyCenter.auditCta}</p>
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile/privacy/export")}
            className="rounded-[26px] bg-primary px-4 py-5 text-left text-white shadow-[0_18px_36px_rgba(109,181,120,0.24)]"
          >
            <ShieldCheck className="h-5 w-5" />
            <p className="mt-5 text-sm font-semibold">{content.privacyCenter.exportCta}</p>
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile/privacy/delete-request")}
            className="rounded-[26px] border border-[#DDECDC] bg-white px-4 py-5 text-left"
          >
            <Trash2 className="h-5 w-5 text-primary" />
            <p className="mt-5 text-sm font-semibold text-foreground">{content.privacyCenter.deleteCta}</p>
          </button>
        </div>

        <section className="mt-5 space-y-4">
          {documentOrder.map((documentKey) => {
            const document = content.documents[documentKey]
            return (
              <div
                key={documentKey}
                className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
              >
                <h2 className="text-base font-semibold text-foreground">{document.title}</h2>
                <div className="mt-3 space-y-2">
                  {document.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      </main>

      <SharedNav />
    </div>
  )
}
