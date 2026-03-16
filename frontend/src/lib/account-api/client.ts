import api from "@/lib/api"
import type { Locale } from "@/i18n/types"
import { getAccountContent } from "@/lib/account"
import type {
  AccountFaqCategory,
  AccountNotification,
  AccountNotificationStatus,
  AccountSecurity,
  DeleteRequest,
  ExportRequest,
  FeedbackRecord,
} from "@/lib/account/types"

import { mergeAccountNotifications, mergeFeedbackRecords } from "./merge"
import type {
  ApiResult,
  AccountSecuritySnapshotApiResponse,
  CreateFeedbackInput,
  CreateDeleteInput,
  CreateExportInput,
  DeleteRequestApiResponse,
  ExportRequestApiResponse,
  FeedbackRecordsApiResponse,
  NotificationFilter,
  NotificationListApiResponse,
  NotificationReadInput,
} from "./types"

const fallbackStatusOverrides = new Map<string, AccountNotificationStatus>()
const fallbackCreatedFeedbackRecords = new Map<string, FeedbackRecord>()
const fallbackCreatedExportRequests = new Map<string, ExportRequest>()
const fallbackCreatedDeleteRequests = new Map<string, DeleteRequest>()

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

function getFallbackExportRequests(locale: Locale) {
  return [
    ...fallbackCreatedExportRequests.values(),
    ...getAccountContent(locale).exportRequests,
  ]
}

function getFallbackDeleteRequests(locale: Locale) {
  return [
    ...fallbackCreatedDeleteRequests.values(),
    ...getAccountContent(locale).deleteRequests,
  ]
}

function getFallbackSecuritySnapshot(locale: Locale) {
  return getAccountContent(locale).security
}

function mergeLocalizedExportRequests(locale: Locale, requests: ExportRequest[]) {
  const localById = new Map(getAccountContent(locale).exportRequests.map((request) => [request.id, request]))
  return requests.map((request) => {
    const localizedSeed = localById.get(request.id)
    if (!localizedSeed) {
      return request
    }

    return {
      ...request,
      scopeSummary: localizedSeed.scopeSummary,
      requestedAt: localizedSeed.requestedAt,
    }
  })
}

function mergeLocalizedDeleteRequests(locale: Locale, requests: DeleteRequest[]) {
  const localById = new Map(getAccountContent(locale).deleteRequests.map((request) => [request.id, request]))
  return requests.map((request) => {
    const localizedSeed = localById.get(request.id)
    if (!localizedSeed) {
      return request
    }

    return {
      ...request,
      impactSummary: localizedSeed.impactSummary,
      submittedAt: localizedSeed.submittedAt,
    }
  })
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

export async function fetchExportRequests(locale: Locale) {
  try {
    const response = (await api.get("/account/privacy/export")) as ApiResult<ExportRequestApiResponse[]>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Export requests fetch failed")
    }

    return mergeLocalizedExportRequests(locale, response.data)
  } catch {
    return getFallbackExportRequests(locale)
  }
}

export async function createExportRequest(locale: Locale, input: CreateExportInput) {
  try {
    const response = (await api.post("/account/privacy/export", input)) as ApiResult<ExportRequestApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Create export request failed")
    }

    return mergeLocalizedExportRequests(locale, [response.data])[0] ?? response.data
  } catch {
    const createdRequest: ExportRequest = {
      id: `export-local-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: "requested",
      scopeSummary: input.scopeSummary,
    }

    fallbackCreatedExportRequests.set(createdRequest.id, createdRequest)
    return createdRequest
  }
}

export async function fetchDeleteRequests(locale: Locale) {
  try {
    const response = (await api.get("/account/privacy/delete-request")) as ApiResult<DeleteRequestApiResponse[]>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Delete requests fetch failed")
    }

    return mergeLocalizedDeleteRequests(locale, response.data)
  } catch {
    return getFallbackDeleteRequests(locale)
  }
}

export async function createDeleteRequest(locale: Locale, input: CreateDeleteInput) {
  try {
    const response = (await api.post("/account/privacy/delete-request", input)) as ApiResult<DeleteRequestApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Create delete request failed")
    }

    return mergeLocalizedDeleteRequests(locale, [response.data])[0] ?? response.data
  } catch {
    const createdRequest: DeleteRequest = {
      id: `delete-local-${Date.now()}`,
      status: "submitted",
      submittedAt: locale === "zh-CN" ? "刚刚" : "Just now",
      impactSummary: input.impactSummary,
    }

    fallbackCreatedDeleteRequests.set(createdRequest.id, createdRequest)
    return createdRequest
  }
}

export async function fetchAccountSecuritySnapshot(locale: Locale): Promise<AccountSecurity> {
  try {
    const response = (await api.get("/account/security")) as ApiResult<AccountSecuritySnapshotApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Security snapshot fetch failed")
    }

    return response.data
  } catch {
    return getFallbackSecuritySnapshot(locale)
  }
}
