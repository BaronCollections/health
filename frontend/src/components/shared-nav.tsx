"use client"
import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Calendar, Users, User } from "lucide-react"

import { resolveShellVariant } from "@/components/shells/app-shell.helpers"
import { useLocale } from "@/i18n/use-locale"
import { readBrowserRuntimeSnapshot } from "@/lib/runtime/runtime"

export function SharedNav() {
  const pathname = usePathname()
  const { t } = useLocale()
  const [shellVariant, setShellVariant] = useState<"mobile" | "desktop">("mobile")

  useEffect(() => {
    setShellVariant(resolveShellVariant(readBrowserRuntimeSnapshot()))
  }, [])

  const tabs = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/report", icon: FileText, label: t("nav.plan") },
    { href: "/checkin", icon: Calendar, label: t("nav.checkIn") },
    { href: "/community", icon: Users, label: t("nav.community") },
    { href: "/profile", icon: User, label: t("nav.me") },
  ]

  const isActiveTab = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  if (shellVariant === "desktop") {
    return (
      <nav className="pointer-events-none fixed inset-y-0 left-6 z-40 hidden items-center lg:flex">
        <div className="pointer-events-auto flex w-[96px] flex-col items-center gap-3 rounded-[32px] border border-white/70 bg-white/88 p-3 shadow-[0_24px_70px_rgba(109,181,120,0.18)] backdrop-blur">
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab.href)
            const Icon = tab.icon

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex w-full flex-col items-center gap-1 rounded-[22px] px-2 py-3 text-center transition-all duration-200 ${
                  isActive ? "bg-[#E8FFE8]" : "hover:bg-[#F5F5F5]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className={`text-[11px] ${isActive ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-sm border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.href)
          const Icon = tab.icon
          
          return (
            <Link 
              key={tab.href} 
              href={tab.href} 
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive ? "bg-[#E8FFE8]" : "hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] transition-colors ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
