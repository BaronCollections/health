import assert from "node:assert/strict"
import test from "node:test"

import {
  createInitialReleaseChecklistSession,
  loadReleaseChecklistSession,
  saveReleaseChecklistSession,
  toggleReleaseChecklistConfirmation,
  type ReleaseChecklistSessionState,
} from "./session.ts"

function createMemoryStorage(): Storage {
  const store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key) {
      return store.has(key) ? store.get(key)! : null
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key) {
      store.delete(key)
    },
    setItem(key, value) {
      store.set(key, value)
    },
  }
}

test("release checklist session toggles manual confirmations and persists them", () => {
  const storage = createMemoryStorage()
  const initialState = createInitialReleaseChecklistSession()

  const confirmedState = toggleReleaseChecklistConfirmation(
    initialState,
    "allowlist-reviewed",
    true,
    new Date("2026-03-16T12:00:00.000Z"),
  )

  saveReleaseChecklistSession(confirmedState, storage)
  const restoredState = loadReleaseChecklistSession(storage)

  assert.equal(restoredState?.confirmations["allowlist-reviewed"]?.confirmedAt, "2026-03-16T12:00:00.000Z")

  const clearedState = toggleReleaseChecklistConfirmation(confirmedState, "allowlist-reviewed", false)
  assert.deepEqual(clearedState, { confirmations: {} })
})

test("release checklist session clears invalid serialized state", () => {
  const storage = createMemoryStorage()
  storage.setItem("mintbit-release-checklist-session", "{bad json")

  const restoredState = loadReleaseChecklistSession(storage)

  assert.equal(restoredState, null)
  assert.equal(storage.getItem("mintbit-release-checklist-session"), null)
})
