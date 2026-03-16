import type {
  AccountSecurity,
  AccountNotification,
  DeleteRequest,
  ExportRequest,
  FeedbackRecord,
} from "./types"

export function summarizeUnreadNotifications(notifications: AccountNotification[]) {
  return notifications.reduce(
    (summary, notification) => {
      if (notification.status !== "unread") {
        return summary
      }

      summary.all += 1
      summary[notification.type] += 1
      return summary
    },
    {
      all: 0,
      system: 0,
      community: 0,
      checkin: 0,
    },
  )
}

export function countOpenFeedbackRecords(records: FeedbackRecord[]) {
  return records.filter((record) => record.status !== "draft" && record.status !== "closed").length
}

export function getActiveExportRequest(requests: ExportRequest[]) {
  const candidates = requests
    .filter((request) => request.status !== "idle" && request.status !== "expired" && request.status !== "failed")
    .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt))

  return candidates[0] ?? null
}

export function canWithdrawDeleteRequest(request: DeleteRequest | null | undefined) {
  if (!request) {
    return false
  }

  return request.status === "submitted" || request.status === "cooling_off"
}

export function getLatestDeleteRequest(requests: DeleteRequest[]) {
  return [...requests].sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))[0] ?? null
}

export function summarizeAccountPreferences(security: AccountSecurity) {
  return {
    enabledNotifications: Object.values(security.notificationPreferences).filter(Boolean).length,
    bindingStatus: security.accountBinding,
    ocrAuthorization: security.ocrAuthorization,
  }
}
