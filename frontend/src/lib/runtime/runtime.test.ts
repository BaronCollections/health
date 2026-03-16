import assert from "node:assert/strict"
import test from "node:test"

async function loadRuntimeModule() {
  try {
    return await import("./runtime.ts")
  } catch {
    return null
  }
}

test("runtime snapshot identifies embedded WeCom administrators on mobile", async () => {
  const runtime = await loadRuntimeModule()
  assert.ok(runtime?.createRuntimeSnapshot, "createRuntimeSnapshot should be implemented")

  const snapshot = runtime.createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 wxwork/4.1.28 MicroMessenger/7.0.1",
    viewportWidth: 390,
    configuredEnvironment: "staging",
    allowlistValue: "13800138000, admin@example.com",
    storedIdentity: "13800138000",
    fallbackIdentity: "guest@example.com",
    apiBaseUrl: "/api",
  })

  assert.equal(snapshot.platform, "wecom")
  assert.equal(snapshot.environment, "staging")
  assert.equal(snapshot.isEmbeddedWeCom, true)
  assert.equal(snapshot.isDesktopViewport, false)
  assert.equal(snapshot.currentIdentity, "13800138000")
  assert.equal(snapshot.isAdmin, true)
})

test("runtime snapshot defaults to web desktop shell outside WeCom", async () => {
  const runtime = await loadRuntimeModule()
  assert.ok(runtime?.createRuntimeSnapshot, "createRuntimeSnapshot should be implemented")

  const snapshot = runtime.createRuntimeSnapshot({
    userAgent: "Mozilla/5.0 Chrome/123.0 Safari/537.36",
    viewportWidth: 1440,
    configuredEnvironment: undefined,
    allowlistValue: "admin@example.com",
    storedIdentity: "",
    fallbackIdentity: "guest@example.com",
    apiBaseUrl: "https://api.mintbit.test",
    hostname: "localhost",
  })

  assert.equal(snapshot.platform, "web")
  assert.equal(snapshot.environment, "local")
  assert.equal(snapshot.isEmbeddedWeCom, false)
  assert.equal(snapshot.isDesktopViewport, true)
  assert.equal(snapshot.currentIdentity, "guest@example.com")
  assert.equal(snapshot.isAdmin, false)
})
