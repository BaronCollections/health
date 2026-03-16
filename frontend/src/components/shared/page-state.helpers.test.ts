import assert from "node:assert/strict"
import test from "node:test"

async function loadPageStateHelpers() {
  try {
    return await import("./page-state.helpers.ts")
  } catch {
    return null
  }
}

test("page-state helpers expose tone metadata for loading, empty, and error states", async () => {
  const helpers = await loadPageStateHelpers()
  assert.ok(helpers?.getPageStateMeta, "getPageStateMeta should be implemented")

  assert.deepEqual(helpers.getPageStateMeta("loading"), {
    icon: "loader",
    wrapperClassName: "border-[#DDECDC] bg-white/90",
    iconClassName: "bg-[#EFF8F0] text-primary",
  })

  assert.deepEqual(helpers.getPageStateMeta("error"), {
    icon: "alert",
    wrapperClassName: "border-[#F2D6D6] bg-white/95",
    iconClassName: "bg-[#FFF1F0] text-[#B42318]",
  })
})

test("page-state helpers expose fallback badge tones for info and warning", async () => {
  const helpers = await loadPageStateHelpers()
  assert.ok(helpers?.getFallbackBadgeMeta, "getFallbackBadgeMeta should be implemented")

  assert.deepEqual(helpers.getFallbackBadgeMeta("info"), {
    wrapperClassName: "bg-[#EFF8F0] text-primary",
    dotClassName: "bg-primary",
  })

  assert.deepEqual(helpers.getFallbackBadgeMeta("warning"), {
    wrapperClassName: "bg-[#FFF7E6] text-[#B54708]",
    dotClassName: "bg-[#B54708]",
  })
})
