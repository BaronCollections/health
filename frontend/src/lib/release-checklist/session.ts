import type { ReleaseChecklistManualState } from "./types.ts"

export const RELEASE_CHECKLIST_SESSION_KEY = "mintbit-release-checklist-session"

export type ReleaseChecklistSessionState = {
  confirmations: ReleaseChecklistManualState
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

export function createInitialReleaseChecklistSession(): ReleaseChecklistSessionState {
  return {
    confirmations: {},
  }
}

export function loadReleaseChecklistSession(storage?: Storage): ReleaseChecklistSessionState | null {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return null
  }

  const rawValue = targetStorage.getItem(RELEASE_CHECKLIST_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as ReleaseChecklistSessionState
  } catch {
    targetStorage.removeItem(RELEASE_CHECKLIST_SESSION_KEY)
    return null
  }
}

export function saveReleaseChecklistSession(state: ReleaseChecklistSessionState, storage?: Storage) {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return
  }

  targetStorage.setItem(RELEASE_CHECKLIST_SESSION_KEY, JSON.stringify(state))
}

export function toggleReleaseChecklistConfirmation(
  state: ReleaseChecklistSessionState,
  itemId: string,
  isConfirmed: boolean,
  date = new Date(),
): ReleaseChecklistSessionState {
  const confirmations = { ...state.confirmations }

  if (isConfirmed) {
    confirmations[itemId] = {
      confirmedAt: date.toISOString(),
    }
  } else {
    delete confirmations[itemId]
  }

  return {
    confirmations,
  }
}
