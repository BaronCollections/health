"use client"

import type React from "react"

import { MonitorSmartphone, ShieldCheck, Waypoints } from "lucide-react"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "@/i18n/use-locale"
import type { RuntimeSnapshot } from "@/lib/runtime/types"

export function DesktopAppShell({
  children,
  runtimeSnapshot,
}: {
  children: React.ReactNode
  runtimeSnapshot: RuntimeSnapshot
}) {
  const { locale } = useLocale()

  return (
    <div className="mintbit-desktop-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-8 px-6 py-6">
        <aside className="hidden min-h-[calc(100vh-3rem)] w-[300px] shrink-0 flex-col justify-between rounded-[40px] border border-white/70 bg-white/75 p-6 shadow-[0_28px_80px_rgba(109,181,120,0.18)] backdrop-blur lg:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {locale === "zh-CN" ? "MintBit Phase 1" : "MintBit Phase 1"}
            </p>
            <h1 className="mt-4 text-[34px] font-semibold leading-tight text-foreground">
              {locale === "zh-CN" ? "桌面双壳层骨架已接入" : "Desktop dual-shell foundation is connected"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {locale === "zh-CN"
                ? "当前桌面端沿用 H5 路由与业务页面，只在外层增加运行时框架、桌面外壳和导航基座。"
                : "Desktop currently reuses the H5 route tree and business pages while adding a runtime frame, desktop shell, and navigation foundation around them."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] bg-[#F5FAF6] p-4">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {locale === "zh-CN" ? "当前平台" : "Current platform"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{runtimeSnapshot.platform}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-[#F5FAF6] p-4">
              <div className="flex items-center gap-3">
                <Waypoints className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {locale === "zh-CN" ? "运行环境" : "Runtime environment"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{runtimeSnapshot.environment}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-[#F5FAF6] p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {locale === "zh-CN" ? "管理员状态" : "Administrator"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {runtimeSnapshot.isAdmin
                      ? locale === "zh-CN"
                        ? "白名单内"
                        : "Allowlisted"
                      : locale === "zh-CN"
                        ? "普通身份"
                        : "Standard identity"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {locale === "zh-CN" ? "语言切换" : "Language"}
              </p>
              <div className="mt-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 justify-center">
          <div className="mintbit-desktop-frame w-full max-w-[430px] overflow-hidden rounded-[40px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(32,74,40,0.18)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
