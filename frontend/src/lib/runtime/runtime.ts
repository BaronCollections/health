import {
  isAllowlistedAdmin,
  parseAdminAllowlist,
  resolveCurrentIdentity,
  resolveRuntimeEnvironment,
  RUNTIME_IDENTITY_STORAGE_KEY,
} from "./config.ts"
import type { RuntimeSnapshot, RuntimeSnapshotInput } from "./types.ts"

function isEmbeddedWeComUserAgent(userAgent: string) {
  const normalizedUserAgent = userAgent.toLowerCase()
  return normalizedUserAgent.includes("wxwork") || normalizedUserAgent.includes("wecom")
}

export function createRuntimeSnapshot(input: RuntimeSnapshotInput): RuntimeSnapshot {
  const userAgent = input.userAgent ?? ""
  const viewportWidth = input.viewportWidth ?? 390
  const adminAllowlist = parseAdminAllowlist(input.allowlistValue)
  const currentIdentity = resolveCurrentIdentity({
    storedIdentity: input.storedIdentity,
    fallbackIdentity: input.fallbackIdentity,
  })
  const isEmbeddedWeCom = isEmbeddedWeComUserAgent(userAgent)
  const isDesktopViewport = viewportWidth >= 1024

  return {
    platform: isEmbeddedWeCom ? "wecom" : isDesktopViewport ? "web" : "h5",
    environment: resolveRuntimeEnvironment({
      configuredEnvironment: input.configuredEnvironment,
      hostname: input.hostname,
    }),
    currentIdentity,
    isAdmin: isAllowlistedAdmin(currentIdentity, adminAllowlist),
    isEmbeddedWeCom,
    isDesktopViewport,
    apiBaseUrl: input.apiBaseUrl ?? "/api",
    adminAllowlist,
  }
}

export function readBrowserRuntimeSnapshot() {
  const storedIdentity =
    typeof window === "undefined" ? "" : window.localStorage.getItem(RUNTIME_IDENTITY_STORAGE_KEY)

  return createRuntimeSnapshot({
    userAgent: typeof window === "undefined" ? "" : window.navigator.userAgent,
    viewportWidth: typeof window === "undefined" ? 390 : window.innerWidth,
    configuredEnvironment: process.env.NEXT_PUBLIC_RUNTIME_ENV,
    allowlistValue: process.env.NEXT_PUBLIC_ADMIN_ALLOWLIST,
    storedIdentity,
    fallbackIdentity: process.env.NEXT_PUBLIC_DEFAULT_ACCOUNT_IDENTITY,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    hostname: typeof window === "undefined" ? "localhost" : window.location.hostname,
  })
}

export function persistRuntimeIdentity(identity: string) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(RUNTIME_IDENTITY_STORAGE_KEY, identity.trim().toLowerCase())
}
