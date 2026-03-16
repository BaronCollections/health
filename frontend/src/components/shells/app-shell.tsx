"use client"

import type React from "react"

import { useEffect, useState } from "react"

import { readBrowserRuntimeSnapshot } from "@/lib/runtime/runtime"
import type { RuntimeSnapshot } from "@/lib/runtime/types"

import { resolveShellVariant } from "./app-shell.helpers"
import { DesktopAppShell } from "./desktop-app-shell"
import { MobileAppShell } from "./mobile-app-shell"

const defaultRuntimeSnapshot: RuntimeSnapshot = {
  platform: "h5",
  environment: "local",
  currentIdentity: "",
  isAdmin: false,
  isEmbeddedWeCom: false,
  isDesktopViewport: false,
  apiBaseUrl: "/api",
  adminAllowlist: [],
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<RuntimeSnapshot>(defaultRuntimeSnapshot)

  useEffect(() => {
    setRuntimeSnapshot(readBrowserRuntimeSnapshot())
  }, [])

  const variant = resolveShellVariant(runtimeSnapshot)

  if (variant === "desktop") {
    return <DesktopAppShell runtimeSnapshot={runtimeSnapshot}>{children}</DesktopAppShell>
  }

  return <MobileAppShell>{children}</MobileAppShell>
}
