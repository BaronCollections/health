import assert from "node:assert/strict"
import test from "node:test"

import { createRuntimeSnapshot } from "../runtime/runtime.ts"

async function loadWeComModule() {
  try {
    return await import("./wecom.ts")
  } catch {
    return null
  }
}

test("wecom adapter reports deferred skeleton mode inside embedded WeCom", async () => {
  const wecom = await loadWeComModule()
  assert.ok(wecom?.createWeComAdapter, "createWeComAdapter should be implemented")

  const runtimeSnapshot = createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 wxwork/4.1.28 MicroMessenger/7.0.1",
    viewportWidth: 390,
    configuredEnvironment: "staging",
    allowlistValue: "13800138000",
    storedIdentity: "13800138000",
    apiBaseUrl: "/api",
  })

  const adapter = wecom.createWeComAdapter(runtimeSnapshot)
  const supportState = adapter.getSupportState()
  const authResult = adapter.authorize({
    callbackUrl: "https://mintbit.test/auth/wecom/callback",
  })

  assert.equal(supportState.status, "deferred")
  assert.equal(supportState.supported, true)
  assert.equal(authResult.status, "deferred")
  assert.equal(authResult.redirectUrl, "https://mintbit.test/auth/wecom/callback")
})

test("wecom adapter downgrades safely outside embedded WeCom", async () => {
  const wecom = await loadWeComModule()
  assert.ok(wecom?.createWeComAdapter, "createWeComAdapter should be implemented")

  const runtimeSnapshot = createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 Chrome/123.0 Safari/537.36",
    viewportWidth: 1440,
    configuredEnvironment: "prod",
    allowlistValue: "",
    storedIdentity: "guest@example.com",
    apiBaseUrl: "/api",
  })

  const adapter = wecom.createWeComAdapter(runtimeSnapshot)
  const shareResult = adapter.configureShare({
    title: "MintBit report",
    description: "share",
    url: "https://mintbit.test/report",
  })
  const menuResult = adapter.configureMenu({
    allowShare: true,
  })
  const messageResult = adapter.bindMessages({
    topic: "release-checklist",
  })

  assert.equal(adapter.getSupportState().status, "downgraded")
  assert.equal(shareResult.status, "downgraded")
  assert.equal(shareResult.applied, false)
  assert.equal(menuResult.applied, false)
  assert.equal(messageResult.applied, false)
})
