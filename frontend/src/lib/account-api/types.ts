import type {
  AccountFaqCategory,
  AccountNotification,
  AccountNotificationType,
  FeedbackRecord,
} from "../account/types"

export type ApiResult<T> = {
  code: number
  message: string
  data: T
}

export type NotificationFilter = "all" | AccountNotificationType

export type AccountNotificationApiResponse = AccountNotification

export type NotificationListApiResponse = {
  filter: NotificationFilter
  unreadCount: number
  items: AccountNotificationApiResponse[]
}

export type NotificationReadInput = {
  ids: string[]
}

export type AccountFaqCategoryApiResponse = AccountFaqCategory
export type FeedbackRecordApiResponse = FeedbackRecord

export type FeedbackRecordsApiResponse = {
  records: FeedbackRecordApiResponse[]
}

export type CreateFeedbackInput = {
  category: string
  subject: string
  description: string
  contact: string
  screenshotName?: string
}
