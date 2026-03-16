import type { RuntimeSnapshot } from "@/lib/runtime/types"

import type {
  WeComAdapter,
  WeComAuthInput,
  WeComAuthResult,
  WeComCapabilityStatus,
  WeComMenuInput,
  WeComMessageInput,
  WeComOperationResult,
  WeComShareInput,
  WeComSupportState,
} from "./types.ts"

function createSupportState(snapshot: RuntimeSnapshot): WeComSupportState {
  if (snapshot.platform === "wecom") {
    return {
      status: "deferred",
      supported: true,
      reason: "WeCom container detected. Phase 2 skeleton is active, but the production SDK is not connected yet.",
    }
  }

  return {
    status: "downgraded",
    supported: false,
    reason: "Not running inside WeCom. The adapter returns downgrade-safe placeholders.",
  }
}

function createOperationResult(snapshot: RuntimeSnapshot): WeComOperationResult {
  const supportState = createSupportState(snapshot)

  return {
    ...supportState,
    applied: false,
  }
}

export function createWeComAdapter(snapshot: RuntimeSnapshot): WeComAdapter {
  return {
    snapshot,
    getSupportState() {
      return createSupportState(snapshot)
    },
    bootstrapSdk() {
      return createOperationResult(snapshot)
    },
    authorize(input: WeComAuthInput): WeComAuthResult {
      return {
        ...createSupportState(snapshot),
        redirectUrl: input.callbackUrl,
      }
    },
    configureShare(_input: WeComShareInput) {
      return createOperationResult(snapshot)
    },
    configureMenu(_input: WeComMenuInput) {
      return createOperationResult(snapshot)
    },
    bindMessages(_input: WeComMessageInput) {
      return createOperationResult(snapshot)
    },
  }
}

export function getWeComCapabilityStatus(snapshot: RuntimeSnapshot): WeComCapabilityStatus {
  return createSupportState(snapshot).status
}
