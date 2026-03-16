export type AccountNotificationType = "system" | "community" | "checkin"
export type AccountNotificationStatus = "unread" | "read" | "archived"
export type FeedbackStatus = "draft" | "submitted" | "in_review" | "responded" | "closed"
export type ExportRequestStatus = "idle" | "requested" | "generating" | "ready" | "expired" | "failed"
export type DeleteRequestStatus = "idle" | "submitted" | "cooling_off" | "confirmed" | "executed" | "rejected"
export type AccountBindingStatus = "bound" | "unbound" | "risk_notice"
export type OcrAuthorizationStatus = "granted" | "revoked"

export type AccountNotification = {
  id: string
  type: AccountNotificationType
  status: AccountNotificationStatus
  title: string
  preview: string
  body: string
  relativeTime: string
  actionHref?: string
}

export type FeedbackRecord = {
  id: string
  category: string
  subject: string
  status: FeedbackStatus
  submittedAt: string
  reply?: string
}

export type ExportRequest = {
  id: string
  requestedAt: string
  status: ExportRequestStatus
  scopeSummary: string
}

export type DeleteRequest = {
  id: string
  status: DeleteRequestStatus
  submittedAt: string
  impactSummary: string
}

export type AccountDocument = {
  title: string
  body: string[]
}

export type AccountFaqItem = {
  question: string
  answer: string
}

export type AccountFaqCategory = {
  id: string
  title: string
  items: AccountFaqItem[]
}

export type AccountHomeCard = {
  id: string
  title: string
  body: string
  cta: string
  href: string
}

export type AccountContent = {
  home: {
    eyebrow: string
    title: string
    subtitle: string
    cards: AccountHomeCard[]
    summary: {
      unreadLabel: string
      feedbackLabel: string
      exportLabel: string
      deleteLabel: string
      withdrawHint: string
    }
  }
  notificationsView: {
    eyebrow: string
    title: string
    subtitle: string
    batchRead: string
    emptyTitle: string
    emptyBody: string
    filters: {
      all: string
      system: string
      community: string
      checkin: string
    }
  }
  notificationDetail: {
    backCta: string
    sourceLabel: string
    timeLabel: string
    relatedActionCta: string
    autoReadHint: string
  }
  notifications: AccountNotification[]
  feedbackRecords: FeedbackRecord[]
  exportRequests: ExportRequest[]
  deleteRequests: DeleteRequest[]
  faqCategories: AccountFaqCategory[]
  documents: {
    privacyPolicy: AccountDocument
    userAgreement: AccountDocument
    ocrUsage: AccountDocument
    communityVisibility: AccountDocument
    auditLog: AccountDocument
  }
  security: {
    accountBinding: AccountBindingStatus
    ocrAuthorization: OcrAuthorizationStatus
    notificationPreferences: Record<AccountNotificationType, boolean>
  }
  labels: {
    status: Record<FeedbackStatus | ExportRequestStatus | DeleteRequestStatus, string>
    notificationTypes: Record<AccountNotificationType, string>
    notificationStatus: Record<AccountNotificationStatus, string>
    sections: {
      messages: string
      help: string
      privacy: string
      data: string
      preferences: string
    }
  }
}
