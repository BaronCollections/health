export const CHECKIN_SESSION_KEY = "mintbit-checkin-session"

export type CheckInSessionState = {
  streakDays: number
  monthlyCheckins: number
  totalCheckins: number
  healthPoints: number
  lastCheckInDate: string | null
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

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function createInitialCheckInState(_date = new Date()): CheckInSessionState {
  return {
    streakDays: 7,
    monthlyCheckins: 25,
    totalCheckins: 180,
    healthPoints: 520,
    lastCheckInDate: null,
  }
}

export function applyDailyCheckIn(state: CheckInSessionState, date = new Date()): CheckInSessionState {
  const nextDateKey = formatDateKey(date)

  if (state.lastCheckInDate === nextDateKey) {
    return state
  }

  return {
    ...state,
    streakDays: state.streakDays + 1,
    monthlyCheckins: state.monthlyCheckins + 1,
    totalCheckins: state.totalCheckins + 1,
    healthPoints: state.healthPoints + 10,
    lastCheckInDate: nextDateKey,
  }
}

export function loadCheckInSession(storage?: Storage): CheckInSessionState | null {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return null
  }

  const rawValue = targetStorage.getItem(CHECKIN_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as CheckInSessionState
  } catch {
    targetStorage.removeItem(CHECKIN_SESSION_KEY)
    return null
  }
}

export function saveCheckInSession(state: CheckInSessionState, storage?: Storage) {
  const targetStorage = resolveStorage(storage)

  if (!targetStorage) {
    return
  }

  targetStorage.setItem(CHECKIN_SESSION_KEY, JSON.stringify(state))
}
