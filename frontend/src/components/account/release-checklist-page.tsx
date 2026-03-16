"use client"

import { useEffect, useMemo, useState } from "react"

import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CircleCheckBig,
  ExternalLink,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getReleaseChecklistContent } from "@/lib/release-checklist"
import {
  createInitialReleaseChecklistSession,
  loadReleaseChecklistSession,
  saveReleaseChecklistSession,
  toggleReleaseChecklistConfirmation,
} from "@/lib/release-checklist/session"
import { getOverallReleaseChecklistStatus, resolveReleaseChecklistGroups } from "@/lib/release-checklist/state"
import type { ReleaseChecklistStatus } from "@/lib/release-checklist/types"
import { readBrowserRuntimeSnapshot } from "@/lib/runtime/runtime"
import type { RuntimeSnapshot } from "@/lib/runtime/types"

const statusStyles: Record<ReleaseChecklistStatus, string> = {
  blocked: "bg-[#FFF1F0] text-[#B42318]",
  attention: "bg-[#FFF7E6] text-[#B54708]",
  ready: "bg-[#ECFDF3] text-[#027A48]",
}

const statusIcons: Record<ReleaseChecklistStatus, typeof AlertTriangle> = {
  blocked: AlertTriangle,
  attention: AlertTriangle,
  ready: CircleCheckBig,
}

export function ReleaseChecklistPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getReleaseChecklistContent(locale)
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<RuntimeSnapshot | null>(null)
  const [isRuntimeReady, setIsRuntimeReady] = useState(false)
  const [sessionState, setSessionState] = useState(createInitialReleaseChecklistSession())

  useEffect(() => {
    const nextRuntimeSnapshot = readBrowserRuntimeSnapshot()
    const restoredSession = loadReleaseChecklistSession() ?? createInitialReleaseChecklistSession()

    setRuntimeSnapshot(nextRuntimeSnapshot)
    setSessionState(restoredSession)
    setIsRuntimeReady(true)

    if (!nextRuntimeSnapshot.isAdmin) {
      router.replace("/profile")
    }
  }, [router])

  const resolvedGroups = useMemo(() => {
    return resolveReleaseChecklistGroups(content.groups, sessionState.confirmations)
  }, [content.groups, sessionState.confirmations])

  const overallStatus = useMemo(() => {
    return getOverallReleaseChecklistStatus(content.groups, sessionState.confirmations)
  }, [content.groups, sessionState.confirmations])

  const runtimeRows = useMemo(() => {
    if (!runtimeSnapshot) {
      return []
    }

    return [
      { label: content.labels.runtime.platform, value: runtimeSnapshot.platform },
      { label: content.labels.runtime.environment, value: runtimeSnapshot.environment },
      { label: content.labels.runtime.apiBaseUrl, value: runtimeSnapshot.apiBaseUrl },
      { label: content.labels.runtime.identity, value: runtimeSnapshot.currentIdentity || "guest" },
      {
        label: content.labels.runtime.allowlist,
        value: runtimeSnapshot.adminAllowlist.length
          ? runtimeSnapshot.adminAllowlist.join(", ")
          : content.view.emptyAllowlistLabel,
      },
    ]
  }, [content.labels.runtime, content.view.emptyAllowlistLabel, runtimeSnapshot])

  function handleToggleConfirmation(itemId: string, isConfirmed: boolean) {
    const nextState = toggleReleaseChecklistConfirmation(sessionState, itemId, isConfirmed)
    setSessionState(nextState)
    saveReleaseChecklistSession(nextState)
  }

  if (!isRuntimeReady || !runtimeSnapshot) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_34%,#F8FBF8_100%)] px-4 pb-12 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            {content.view.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.view.loadingTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.view.loadingBody}</p>
        </section>
      </div>
    )
  }

  if (!runtimeSnapshot.isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_34%,#F8FBF8_100%)] px-4 pb-12 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF7E6] px-3 py-1 text-xs font-semibold text-[#B54708]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {content.view.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.view.redirectingTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.view.redirectingBody}</p>
        </section>
      </div>
    )
  }

  const OverallStatusIcon = statusIcons[overallStatus]

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.18),_transparent_38%),linear-gradient(180deg,_#F3FAF3_0%,_#FFFFFF_40%,_#F8FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {content.view.backCta}
        </button>

        <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {content.view.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.view.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.view.subtitle}</p>
          <p className="mt-3 text-xs font-medium text-muted-foreground">{content.view.adminOnlyHint}</p>

          <div className="mt-5 flex items-center justify-between rounded-[24px] bg-[#F5FAF6] px-4 py-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{content.view.overallStatusLabel}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{content.labels.status[overallStatus]}</p>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${statusStyles[overallStatus]}`}>
              <OverallStatusIcon className="h-4 w-4" />
              {content.labels.status[overallStatus]}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
          <h2 className="text-base font-semibold text-foreground">{content.view.diagnosticsTitle}</h2>
          <div className="mt-4 space-y-3">
            {runtimeRows.map((row) => (
              <div key={row.label} className="rounded-[22px] bg-[#F7FAF7] px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                <p className="mt-2 break-all text-sm font-semibold text-foreground">{row.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-foreground">{content.view.actionsTitle}</h2>
          </div>
          <div className="mt-4 space-y-3">
            {content.diagnostics.actionLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => router.push(link.href)}
                className="flex w-full items-center justify-between rounded-[22px] bg-[#F7FAF7] px-4 py-3 text-left"
              >
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  {link.label}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]">
          <h2 className="text-base font-semibold text-foreground">{content.view.warningsTitle}</h2>
          <div className="mt-4 space-y-3">
            {content.diagnostics.knownWarnings.map((warning) => (
              <div key={warning.id} className="rounded-[22px] bg-[#FFF8E8] px-4 py-4">
                <p className="text-sm font-semibold text-foreground">{warning.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{warning.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">{content.view.groupsTitle}</h2>
          {resolvedGroups.map((group) => {
            const GroupStatusIcon = statusIcons[group.resolvedStatus]

            return (
              <div
                key={group.id}
                className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.summary}</p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[group.resolvedStatus]}`}
                  >
                    <GroupStatusIcon className="h-3.5 w-3.5" />
                    {content.labels.status[group.resolvedStatus]}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {group.items.map((item) => {
                    const ItemStatusIcon = statusIcons[item.resolvedStatus]
                    const isConfirmed = Boolean(item.confirmedAt)

                    return (
                      <div key={item.id} className="rounded-[22px] bg-[#F7FAF7] px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[item.resolvedStatus]}`}
                          >
                            <ItemStatusIcon className="h-3.5 w-3.5" />
                            {content.labels.status[item.resolvedStatus]}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                            {content.labels.checkType[item.checkType]}
                          </span>
                        </div>
                        <h4 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>

                        {item.confirmedAt ? (
                          <p className="mt-3 text-xs font-medium text-primary">
                            {content.view.manualConfirmedLabel} · {item.confirmedAt}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.href ? (
                            <button
                              type="button"
                              onClick={() => router.push(item.href!)}
                              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-foreground shadow-sm"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-primary" />
                              {item.href}
                            </button>
                          ) : null}

                          {item.checkType === "manual" ? (
                            <button
                              type="button"
                              onClick={() => handleToggleConfirmation(item.id, !isConfirmed)}
                              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                                isConfirmed ? "bg-[#FFF1F0] text-[#B42318]" : "bg-primary text-white"
                              }`}
                            >
                              {isConfirmed ? content.view.resetManualCta : content.view.markReadyCta}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
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
