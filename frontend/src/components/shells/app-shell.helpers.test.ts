import assert from "node:assert/strict"
import test from "node:test"

import { createRuntimeSnapshot } from "../../lib/runtime/runtime.ts"

async function loadAppShellHelpers() {
  try {
    return await import("./app-shell.helpers.ts")
  } catch {
    return null
  }
}

test("app-shell helpers choose desktop shell for desktop web snapshots", async () => {
  const helpers = await loadAppShellHelpers()
  assert.ok(helpers?.resolveShellVariant, "resolveShellVariant should be implemented")

  const snapshot = createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 Chrome/123.0 Safari/537.36",
    viewportWidth: 1440,
    configuredEnvironment: "prod",
    apiBaseUrl: "/api",
  })

  assert.equal(helpers.resolveShellVariant(snapshot), "desktop")
})

test("app-shell helpers keep WeCom and mobile H5 in the mobile shell", async () => {
  const helpers = await loadAppShellHelpers()
  assert.ok(helpers?.resolveShellVariant, "resolveShellVariant should be implemented")

  const wecomSnapshot = createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 wxwork/4.1.28 MicroMessenger/7.0.1",
    viewportWidth: 1280,
    configuredEnvironment: "staging",
    apiBaseUrl: "/api",
  })
  const mobileSnapshot = createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 Safari/537.36",
    viewportWidth: 390,
    configuredEnvironment: "prod",
    apiBaseUrl: "/api",
  })

  assert.equal(helpers.resolveShellVariant(wecomSnapshot), "mobile")
  assert.equal(helpers.resolveShellVariant(mobileSnapshot), "mobile")
})
