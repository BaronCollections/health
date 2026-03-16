import type { RuntimeEnvironment } from "./types.ts"

export const RUNTIME_IDENTITY_STORAGE_KEY = "mintbit-account-identity"

function normalizeIdentity(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

export function parseAdminAllowlist(value: string | null | undefined) {
  const normalizedEntries = (value ?? "")
    .split(/[\n,]/)
    .map((entry) => normalizeIdentity(entry))
    .filter(Boolean)

  return [...new Set(normalizedEntries)]
}

export function resolveCurrentIdentity({
  storedIdentity,
  fallbackIdentity,
}: {
  storedIdentity?: string | null
  fallbackIdentity?: string | null
}) {
  const normalizedStoredIdentity = normalizeIdentity(storedIdentity)
  if (normalizedStoredIdentity) {
    return normalizedStoredIdentity
  }

  return normalizeIdentity(fallbackIdentity)
}

export function isAllowlistedAdmin(identity: string | null | undefined, allowlist: string[]) {
  const normalizedIdentity = normalizeIdentity(identity)
  if (!normalizedIdentity) {
    return false
  }

  return allowlist.includes(normalizedIdentity)
}

export function resolveRuntimeEnvironment({
  configuredEnvironment,
  hostname,
}: {
  configuredEnvironment?: string | null
  hostname?: string | null
}): RuntimeEnvironment {
  const normalizedEnvironment = (configuredEnvironment ?? "").trim().toLowerCase()

  if (
    normalizedEnvironment === "local" ||
    normalizedEnvironment === "test" ||
    normalizedEnvironment === "staging" ||
    normalizedEnvironment === "prod"
  ) {
    return normalizedEnvironment
  }

  const normalizedHostname = (hostname ?? "").trim().toLowerCase()
  if (!normalizedHostname || normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1") {
    return "local"
  }

  return "prod"
}
