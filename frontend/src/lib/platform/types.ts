import type { RuntimeSnapshot } from "@/lib/runtime/types"

export type WeComCapabilityStatus = "active" | "deferred" | "downgraded"

export type WeComSupportState = {
  status: WeComCapabilityStatus
  supported: boolean
  reason: string
}

export type WeComAuthInput = {
  callbackUrl: string
}

export type WeComShareInput = {
  title: string
  description: string
  url: string
}

export type WeComMenuInput = {
  allowShare: boolean
}

export type WeComMessageInput = {
  topic: string
}

export type WeComOperationResult = WeComSupportState & {
  applied: boolean
}

export type WeComAuthResult = WeComSupportState & {
  redirectUrl: string
}

export type WeComAdapter = {
  snapshot: RuntimeSnapshot
  getSupportState: () => WeComSupportState
  bootstrapSdk: () => WeComOperationResult
  authorize: (input: WeComAuthInput) => WeComAuthResult
  configureShare: (input: WeComShareInput) => WeComOperationResult
  configureMenu: (input: WeComMenuInput) => WeComOperationResult
  bindMessages: (input: WeComMessageInput) => WeComOperationResult
}
