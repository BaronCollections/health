import assert from "node:assert/strict"
import test from "node:test"

type NotificationType = "system" | "community" | "checkin"
type NotificationStatus = "unread" | "read" | "archived"
type FeedbackStatus = "draft" | "submitted" | "in_review" | "responded" | "closed"
type ExportStatus = "idle" | "requested" | "generating" | "ready" | "expired" | "failed"
type DeleteStatus = "idle" | "submitted" | "cooling_off" | "confirmed" | "executed" | "rejected"
type AccountBindingStatus = "bound" | "unbound" | "risk_notice"
type OcrAuthorizationStatus = "granted" | "revoked"

type NotificationRecord = {
  id: string
  type: NotificationType
  status: NotificationStatus
}

type FeedbackRecord = {
  id: string
  status: FeedbackStatus
}

type ExportRequestRecord = {
  id: string
  requestedAt: string
  status: ExportStatus
}

type DeleteRequestRecord = {
  id: string
  status: DeleteStatus
  submittedAt: string
}

type SecurityRecord = {
  accountBinding: AccountBindingStatus
  ocrAuthorization: OcrAuthorizationStatus
  notificationPreferences: Record<NotificationType, boolean>
}

async function loadAccountStateModule() {
  try {
    return await import("./state.ts")
  } catch {
    return null
  }
}

test("account state summarizes unread notifications by category", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.summarizeUnreadNotifications, "summarizeUnreadNotifications should be implemented")

  const notifications: NotificationRecord[] = [
    { id: "n1", type: "system", status: "unread" },
    { id: "n2", type: "community", status: "unread" },
    { id: "n3", type: "community", status: "read" },
    { id: "n4", type: "checkin", status: "unread" },
    { id: "n5", type: "checkin", status: "archived" },
  ]

  const summary = accountState.summarizeUnreadNotifications(notifications)

  assert.deepEqual(summary, {
    all: 3,
    system: 1,
    community: 1,
    checkin: 1,
  })
})

test("account state counts only open feedback records", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.countOpenFeedbackRecords, "countOpenFeedbackRecords should be implemented")

  const records: FeedbackRecord[] = [
    { id: "f1", status: "submitted" },
    { id: "f2", status: "in_review" },
    { id: "f3", status: "responded" },
    { id: "f4", status: "closed" },
  ]

  assert.equal(accountState.countOpenFeedbackRecords(records), 3)
})

test("account state returns the latest active export request", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.getActiveExportRequest, "getActiveExportRequest should be implemented")

  const requests: ExportRequestRecord[] = [
    { id: "e1", requestedAt: "2026-03-15T09:00:00.000Z", status: "expired" },
    { id: "e2", requestedAt: "2026-03-16T08:00:00.000Z", status: "ready" },
    { id: "e3", requestedAt: "2026-03-16T10:00:00.000Z", status: "generating" },
  ]

  const activeRequest = accountState.getActiveExportRequest(requests)

  assert.equal(activeRequest?.id, "e3")
  assert.equal(activeRequest?.status, "generating")
})

test("account state exposes whether a deletion request can still be withdrawn", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.canWithdrawDeleteRequest, "canWithdrawDeleteRequest should be implemented")

  const submitted: DeleteRequestRecord = { id: "d1", status: "submitted", submittedAt: "2026-03-16 08:00" }
  const coolingOff: DeleteRequestRecord = { id: "d2", status: "cooling_off", submittedAt: "2026-03-16 09:00" }
  const executed: DeleteRequestRecord = { id: "d3", status: "executed", submittedAt: "2026-03-16 10:00" }

  assert.equal(accountState.canWithdrawDeleteRequest(submitted), true)
  assert.equal(accountState.canWithdrawDeleteRequest(coolingOff), true)
  assert.equal(accountState.canWithdrawDeleteRequest(executed), false)
})

test("account state returns the latest deletion request", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.getLatestDeleteRequest, "getLatestDeleteRequest should be implemented")

  const requests: DeleteRequestRecord[] = [
    { id: "d1", status: "submitted", submittedAt: "2026-03-15 21:00" },
    { id: "d2", status: "cooling_off", submittedAt: "2026-03-16 09:45" },
    { id: "d3", status: "executed", submittedAt: "2026-03-14 08:30" },
  ]

  const activeRequest = accountState.getLatestDeleteRequest(requests)

  assert.equal(activeRequest?.id, "d2")
  assert.equal(activeRequest?.status, "cooling_off")
})

test("account state summarizes account preference toggles", async () => {
  const accountState = await loadAccountStateModule()
  assert.ok(accountState?.summarizeAccountPreferences, "summarizeAccountPreferences should be implemented")

  const security: SecurityRecord = {
    accountBinding: "unbound",
    ocrAuthorization: "granted",
    notificationPreferences: {
      system: true,
      community: true,
      checkin: false,
    },
  }

  assert.deepEqual(accountState.summarizeAccountPreferences(security), {
    enabledNotifications: 2,
    bindingStatus: "unbound",
    ocrAuthorization: "granted",
  })
})
