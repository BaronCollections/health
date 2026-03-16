export const SAVED_PLAN_SESSION_KEY = "mintbit-saved-plan-session"

export type SavedPlanCard = {
  id: string
  category: string
  name: string
  benefit: string
  color: string
  type: string
}

export type SavedPlanSnapshot = {
  goalId: string
  savedAt: string
  cards: SavedPlanCard[]
}

function canUseWindow() {
  return typeof window !== "undefined"
}

function resolveStorage(storage?: Storage) {
  if (storage) {
    return storage
  }

  if (!canUseWindow()) {
    return null
  }

  return window.localStorage
}

export function saveSavedPlanSession(snapshot: SavedPlanSnapshot, storage?: Storage) {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return
  }

  targetStorage.setItem(SAVED_PLAN_SESSION_KEY, JSON.stringify(snapshot))
}

export function loadSavedPlanSession(storage?: Storage): SavedPlanSnapshot | null {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return null
  }

  const rawValue = targetStorage.getItem(SAVED_PLAN_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as SavedPlanSnapshot
  } catch {
    targetStorage.removeItem(SAVED_PLAN_SESSION_KEY)
    return null
  }
}
