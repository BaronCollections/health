import assert from "node:assert/strict"
import test from "node:test"

import { applyDailyCheckIn, createInitialCheckInState } from "./session.ts"

test("daily check-in increments once per day and ignores duplicate submissions", () => {
  const now = new Date("2026-03-16T08:00:00.000Z")
  const initialState = createInitialCheckInState(now)

  const firstPass = applyDailyCheckIn(initialState, now)
  const secondPass = applyDailyCheckIn(firstPass, now)

  assert.equal(firstPass.streakDays, initialState.streakDays + 1)
  assert.equal(firstPass.monthlyCheckins, initialState.monthlyCheckins + 1)
  assert.equal(firstPass.totalCheckins, initialState.totalCheckins + 1)
  assert.equal(firstPass.healthPoints, initialState.healthPoints + 10)
  assert.equal(firstPass.lastCheckInDate, "2026-03-16")
  assert.deepEqual(secondPass, firstPass)
})
