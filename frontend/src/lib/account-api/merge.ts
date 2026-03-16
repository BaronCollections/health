import type { AccountNotification, FeedbackRecord } from "../account/types"

const LOCALIZED_NOTIFICATION_FIELDS = ["title", "preview", "body", "relativeTime"] as const

export function mergeAccountNotifications(
  localNotifications: AccountNotification[],
  apiNotifications: AccountNotification[],
) {
  const localById = new Map(localNotifications.map((notification) => [notification.id, notification]))
  const seenIds = new Set<string>()

  const merged = apiNotifications.map((notification) => {
    seenIds.add(notification.id)

    const localizedSeed = localById.get(notification.id)
    if (!localizedSeed) {
      return notification
    }

    const mergedNotification = { ...notification }
    for (const field of LOCALIZED_NOTIFICATION_FIELDS) {
      mergedNotification[field] = localizedSeed[field]
    }

    if (!mergedNotification.actionHref && localizedSeed.actionHref) {
      mergedNotification.actionHref = localizedSeed.actionHref
    }

    return mergedNotification
  })

  for (const notification of localNotifications) {
    if (!seenIds.has(notification.id)) {
      merged.push(notification)
    }
  }

  return merged
}

export function mergeFeedbackRecords(localRecords: FeedbackRecord[], apiRecords: FeedbackRecord[]) {
  const localById = new Map(localRecords.map((record) => [record.id, record]))
  const seenIds = new Set<string>()
  const merged = apiRecords.map((record) => {
    seenIds.add(record.id)

    const localizedSeed = localById.get(record.id)
    if (!localizedSeed) {
      return record
    }

    return {
      ...record,
      category: localizedSeed.category,
      subject: localizedSeed.subject,
      description: localizedSeed.description ?? record.description,
      contact: localizedSeed.contact ?? record.contact,
      screenshotName: localizedSeed.screenshotName ?? record.screenshotName,
      submittedAt: localizedSeed.submittedAt,
      reply: localizedSeed.reply ?? record.reply,
    }
  })

  for (const record of localRecords) {
    if (!seenIds.has(record.id)) {
      merged.push(record)
    }
  }

  return merged
}
