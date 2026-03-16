import api from "@/lib/api"
import type { Locale } from "@/i18n/types"
import { getAccountContent } from "@/lib/account"
import type {
  AccountFaqCategory,
  AccountNotification,
  AccountNotificationStatus,
  FeedbackRecord,
} from "@/lib/account/types"

import { mergeAccountNotifications, mergeFeedbackRecords } from "./merge"
import type {
  ApiResult,
  CreateFeedbackInput,
  FeedbackRecordsApiResponse,
  NotificationFilter,
  NotificationListApiResponse,
  NotificationReadInput,
} from "./types"

const fallbackStatusOverrides = new Map<string, AccountNotificationStatus>()
const fallbackCreatedFeedbackRecords = new Map<string, FeedbackRecord>()

function getFallbackNotifications(locale: Locale) {
  return getAccountContent(locale).notifications.map((notification) => ({
    ...notification,
    status: fallbackStatusOverrides.get(notification.id) ?? notification.status,
  }))
}

function mergeLocalizedNotifications(locale: Locale, notifications: AccountNotification[]) {
  return mergeAccountNotifications(getFallbackNotifications(locale), notifications)
}

function getFallbackFaqCategories(locale: Locale) {
  return getAccountContent(locale).faqCategories
}

function getFallbackFeedbackRecords(locale: Locale) {
  return [
    ...fallbackCreatedFeedbackRecords.values(),
    ...getAccountContent(locale).feedbackRecords,
  ]
}

function mergeLocalizedFeedbackRecords(locale: Locale, records: FeedbackRecord[]) {
  return mergeFeedbackRecords(getFallbackFeedbackRecords(locale), records)
}

function filterNotifications(notifications: AccountNotification[], filter: NotificationFilter) {
  if (filter === "all") {
    return notifications
  }

  return notifications.filter((notification) => notification.type === filter)
}

export async function fetchAccountNotifications(
  locale: Locale,
  filter: NotificationFilter = "all",
): Promise<NotificationListApiResponse> {
  try {
    const response = (await api.get("/account/notifications", {
      params: filter === "all" ? undefined : { type: filter },
    })) as ApiResult<NotificationListApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Account notifications fetch failed")
    }

    return {
      ...response.data,
      items: mergeLocalizedNotifications(locale, response.data.items),
    }
  } catch {
    const items = filterNotifications(getFallbackNotifications(locale), filter)
    return {
      filter,
      unreadCount: items.filter((notification) => notification.status === "unread").length,
      items,
    }
  }
}

export async function fetchAccountNotificationDetail(locale: Locale, notificationId: string) {
  try {
    const response = (await api.get(`/account/notifications/${notificationId}`)) as ApiResult<AccountNotification | null>

    if (response.code !== 200) {
      throw new Error(response.message || "Account notification detail fetch failed")
    }

    if (!response.data) {
      return null
    }

    return mergeLocalizedNotifications(locale, [response.data])[0] ?? null
  } catch {
    return getFallbackNotifications(locale).find((notification) => notification.id === notificationId) ?? null
  }
}

export async function markAccountNotificationRead(locale: Locale, notificationId: string) {
  try {
    const response = (await api.post(`/account/notifications/${notificationId}/read`)) as ApiResult<AccountNotification>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Mark notification read failed")
    }

    return mergeLocalizedNotifications(locale, [response.data])[0] ?? null
  } catch {
    fallbackStatusOverrides.set(notificationId, "read")
    return getFallbackNotifications(locale).find((notification) => notification.id === notificationId) ?? null
  }
}

export async function markAccountNotificationsRead(locale: Locale, ids: string[]) {
  if (!ids.length) {
    return fetchAccountNotifications(locale, "all")
  }

  const payload: NotificationReadInput = { ids }

  try {
    const response = (await api.post("/account/notifications/read-batch", payload)) as ApiResult<NotificationListApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Batch mark notifications read failed")
    }

    return {
      ...response.data,
      items: mergeLocalizedNotifications(locale, response.data.items),
    }
  } catch {
    ids.forEach((id) => fallbackStatusOverrides.set(id, "read"))
    return fetchAccountNotifications(locale, "all")
  }
}

export async function fetchAccountFaqCategories(locale: Locale): Promise<AccountFaqCategory[]> {
  try {
    const response = (await api.get("/account/help/faq")) as ApiResult<AccountFaqCategory[]>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Account FAQ fetch failed")
    }

    const localizedSeed = new Map(getFallbackFaqCategories(locale).map((category) => [category.id, category]))
    return response.data.map((category) => localizedSeed.get(category.id) ?? category)
  } catch {
    return getFallbackFaqCategories(locale)
  }
}

export async function fetchFeedbackRecords(locale: Locale) {
  try {
    const response = (await api.get("/account/help/feedback/records")) as ApiResult<FeedbackRecordsApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Feedback records fetch failed")
    }

    return mergeLocalizedFeedbackRecords(locale, response.data.records)
  } catch {
    return getFallbackFeedbackRecords(locale)
  }
}

export async function createFeedbackRecord(locale: Locale, input: CreateFeedbackInput) {
  try {
    const response = (await api.post("/account/help/feedback", input)) as ApiResult<FeedbackRecord>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Create feedback failed")
    }

    const merged = mergeLocalizedFeedbackRecords(locale, [response.data])
    return merged[0] ?? response.data
  } catch {
    const createdRecord: FeedbackRecord = {
      id: `feedback-local-${Date.now()}`,
      category: input.category,
      subject: input.subject,
      description: input.description,
      contact: input.contact,
      screenshotName: input.screenshotName,
      status: "submitted",
      submittedAt: locale === "zh-CN" ? "刚刚" : "Just now",
    }

    fallbackCreatedFeedbackRecords.set(createdRecord.id, createdRecord)
    return createdRecord
  }
}
