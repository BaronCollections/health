import assert from "node:assert/strict"
import test from "node:test"

import { loadSavedPlanSession, saveSavedPlanSession, type SavedPlanSnapshot } from "./session.ts"

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

test("saved plan session round-trips the active recommendation snapshot", () => {
  const storage = createMemoryStorage()
  const snapshot: SavedPlanSnapshot = {
    goalId: "stress",
    savedAt: "2026-03-16T10:00:00.000Z",
    cards: [
      {
        id: "magnesium",
        category: "Stress",
        name: "Magnesium",
        benefit: "Supports calmer recovery and sleep rhythm.",
        color: "from-[#DDA0DD] to-[#E6E6FA]",
        type: "round",
      },
    ],
  }

  saveSavedPlanSession(snapshot, storage)
  const restored = loadSavedPlanSession(storage)

  assert.deepEqual(restored, snapshot)
})
