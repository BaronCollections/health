import type { AccountNotification } from "../account/types"

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
