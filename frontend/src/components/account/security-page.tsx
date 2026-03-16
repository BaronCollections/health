"use client"

import { useEffect, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchAccountSecuritySnapshot } from "@/lib/account-api/client"
import { summarizeAccountPreferences } from "@/lib/account/state"
import type { AccountSecurity } from "@/lib/account/types"

export function SecurityPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [security, setSecurity] = useState<AccountSecurity>(content.security)

  useEffect(() => {
    setSecurity(content.security)
    void fetchAccountSecuritySnapshot(locale).then((snapshot) => {
      setSecurity(snapshot)
    })
  }, [content.security, locale])

  const summary = summarizeAccountPreferences(security)

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_32%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/profile/privacy")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.labels.sections.preferences}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{content.securityView.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.securityView.subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-[#F6FAF6] p-4">
            <p className="text-xs font-medium text-muted-foreground">{content.securityView.bindingLabel}</p>
            <p className="mt-3 text-base font-semibold text-foreground">
              {content.labels.accountBindingStatus[summary.bindingStatus]}
            </p>
          </div>
          <div className="rounded-[24px] bg-[#F6FAF6] p-4">
            <p className="text-xs font-medium text-muted-foreground">{content.securityView.ocrLabel}</p>
            <p className="mt-3 text-base font-semibold text-foreground">
              {content.labels.ocrAuthorizationStatus[summary.ocrAuthorization]}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
        <p className="text-sm font-semibold text-foreground">{content.securityView.notificationLabel}</p>
        <p className="mt-2 text-sm text-muted-foreground">{summary.enabledNotifications}</p>
        <div className="mt-4 space-y-3">
          {Object.entries(security.notificationPreferences).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between rounded-[20px] bg-[#F7FAF7] px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                {content.labels.notificationTypes[key as keyof typeof content.labels.notificationTypes]}
              </span>
              <span className={`text-sm font-semibold ${enabled ? "text-primary" : "text-muted-foreground"}`}>
                {enabled ? content.securityView.enabledLabel : content.securityView.disabledLabel}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
