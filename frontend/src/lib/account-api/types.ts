import type { AccountNotification, AccountNotificationType } from "../account/types"

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
