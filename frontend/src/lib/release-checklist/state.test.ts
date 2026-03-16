import assert from "node:assert/strict"
import test from "node:test"

import type { ReleaseChecklistGroup, ReleaseChecklistManualState } from "./types.ts"

async function loadReleaseChecklistStateModule() {
  try {
    return await import("./state.ts")
  } catch {
    return null
  }
}

const groups: ReleaseChecklistGroup[] = [
  {
    id: "build",
    title: "Build",
    summary: "Build checks",
    items: [
      {
        id: "build-pass",
        title: "Build passes",
        description: "Frontend build passes.",
        checkType: "auto",
        status: "ready",
      },
      {
        id: "allowlist-reviewed",
        title: "Allowlist reviewed",
        description: "Admin allowlist reviewed.",
        checkType: "manual",
        status: "attention",
      },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    summary: "Platform checks",
    items: [
      {
        id: "wecom-callback",
        title: "WeCom callback",
        description: "WeCom callback route exists.",
        checkType: "auto",
        status: "blocked",
      },
    ],
  },
]

test("release checklist resolves manual confirmations before aggregating group status", async () => {
  const releaseChecklistState = await loadReleaseChecklistStateModule()
  assert.ok(releaseChecklistState?.resolveReleaseChecklistGroups, "resolveReleaseChecklistGroups should be implemented")

  const manualState: ReleaseChecklistManualState = {
    "allowlist-reviewed": {
      confirmedAt: "2026-03-16T12:00:00.000Z",
    },
  }

  const resolvedGroups = releaseChecklistState.resolveReleaseChecklistGroups(groups, manualState)
  const buildGroup = resolvedGroups.find((group: { id: string }) => group.id === "build")
  const manualItem = buildGroup?.items.find((item: { id: string }) => item.id === "allowlist-reviewed")

  assert.equal(buildGroup?.resolvedStatus, "ready")
  assert.equal(manualItem?.resolvedStatus, "ready")
  assert.equal(manualItem?.confirmedAt, "2026-03-16T12:00:00.000Z")
})

test("release checklist overall status keeps the most severe unresolved state", async () => {
  const releaseChecklistState = await loadReleaseChecklistStateModule()
  assert.ok(releaseChecklistState?.getOverallReleaseChecklistStatus, "getOverallReleaseChecklistStatus should be implemented")

  assert.equal(releaseChecklistState.getOverallReleaseChecklistStatus(groups, {}), "blocked")

  const withoutBlockedGroup = groups.filter((group) => group.id !== "platform")
  assert.equal(releaseChecklistState.getOverallReleaseChecklistStatus(withoutBlockedGroup, {}), "attention")
  assert.equal(
    releaseChecklistState.getOverallReleaseChecklistStatus(withoutBlockedGroup, {
      "allowlist-reviewed": { confirmedAt: "2026-03-16T12:00:00.000Z" },
    }),
    "ready",
  )
})
