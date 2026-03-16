export type RuntimePlatform = "h5" | "wecom" | "web"
export type RuntimeEnvironment = "local" | "test" | "staging" | "prod"

export type RuntimeSnapshot = {
  platform: RuntimePlatform
  environment: RuntimeEnvironment
  currentIdentity: string
  isAdmin: boolean
  isEmbeddedWeCom: boolean
  isDesktopViewport: boolean
  apiBaseUrl: string
  adminAllowlist: string[]
}

export type RuntimeSnapshotInput = {
  userAgent?: string
  viewportWidth?: number
  configuredEnvironment?: string | null
  allowlistValue?: string | null
  storedIdentity?: string | null
  fallbackIdentity?: string | null
  apiBaseUrl?: string | null
  hostname?: string | null
}
