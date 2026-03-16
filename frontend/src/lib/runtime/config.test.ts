import assert from "node:assert/strict"
import test from "node:test"

async function loadRuntimeConfigModule() {
  try {
    return await import("./config.ts")
  } catch {
    return null
  }
}

test("runtime config parses administrator allowlist and normalizes identities", async () => {
  const runtimeConfig = await loadRuntimeConfigModule()
  assert.ok(runtimeConfig?.parseAdminAllowlist, "parseAdminAllowlist should be implemented")

  const parsed = runtimeConfig.parseAdminAllowlist(" 13800138000,Admin@example.com \n admin@example.com ,  ")

  assert.deepEqual(parsed, ["13800138000", "admin@example.com"])
})

test("runtime config resolves current identity with stored value before fallback", async () => {
  const runtimeConfig = await loadRuntimeConfigModule()
  assert.ok(runtimeConfig?.resolveCurrentIdentity, "resolveCurrentIdentity should be implemented")

  assert.equal(
    runtimeConfig.resolveCurrentIdentity({
      storedIdentity: " 13800138000 ",
      fallbackIdentity: "demo@example.com",
    }),
    "13800138000",
  )

  assert.equal(
    runtimeConfig.resolveCurrentIdentity({
      storedIdentity: "",
      fallbackIdentity: " Demo@example.com ",
    }),
    "demo@example.com",
  )
})

test("runtime config recognizes allowlisted administrators", async () => {
  const runtimeConfig = await loadRuntimeConfigModule()
  assert.ok(runtimeConfig?.isAllowlistedAdmin, "isAllowlistedAdmin should be implemented")

  const allowlist = ["13800138000", "admin@example.com"]

  assert.equal(runtimeConfig.isAllowlistedAdmin(" 13800138000 ", allowlist), true)
  assert.equal(runtimeConfig.isAllowlistedAdmin("guest@example.com", allowlist), false)
})
