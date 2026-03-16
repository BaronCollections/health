"use client"

import type React from "react"

import { LanguageSwitcher } from "@/components/language-switcher"

export function MobileAppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-md justify-end px-4">
        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </div>
      {children}
    </>
  )
}
