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
  description?: string
  contact?: string
  screenshotName?: string
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

export type AccountSecurity = {
  accountBinding: AccountBindingStatus
  ocrAuthorization: OcrAuthorizationStatus
  notificationPreferences: Record<AccountNotificationType, boolean>
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
  helpCenter: {
    eyebrow: string
    title: string
    subtitle: string
    faqTitle: string
    backCta: string
    supportLabel: string
    supportValue: string
    feedbackCta: string
    feedbackRecordsCta: string
  }
  feedbackForm: {
    title: string
    subtitle: string
    categoryLabel: string
    subjectLabel: string
    subjectPlaceholder: string
    descriptionLabel: string
    descriptionPlaceholder: string
    contactLabel: string
    contactPlaceholder: string
    screenshotLabel: string
    screenshotPlaceholder: string
    submitCta: string
    successTitle: string
    successBody: string
    categories: string[]
  }
  feedbackRecordsView: {
    title: string
    subtitle: string
    emptyTitle: string
    emptyBody: string
    groupTitles: Record<FeedbackStatus, string>
  }
  feedbackRecords: FeedbackRecord[]
  exportRequests: ExportRequest[]
  deleteRequests: DeleteRequest[]
  privacyCenter: {
    title: string
    subtitle: string
    notificationPrefsLabel: string
    securityCta: string
    exportCta: string
    deleteCta: string
    auditCta: string
  }
  exportCenter: {
    title: string
    subtitle: string
    scopeLabel: string
    scopePlaceholder: string
    requestCta: string
    activeLabel: string
    emptyTitle: string
    emptyBody: string
    defaultScopeSummary: string
  }
  deleteCenter: {
    title: string
    subtitle: string
    impactLabel: string
    impactPlaceholder: string
    requestCta: string
    emptyTitle: string
    emptyBody: string
    withdrawLabel: string
  }
  securityView: {
    title: string
    subtitle: string
    bindingLabel: string
    ocrLabel: string
    notificationLabel: string
    enabledLabel: string
    disabledLabel: string
  }
  auditView: {
    title: string
    subtitle: string
    trailTitle: string
  }
  faqCategories: AccountFaqCategory[]
  documents: {
    privacyPolicy: AccountDocument
    userAgreement: AccountDocument
    ocrUsage: AccountDocument
    communityVisibility: AccountDocument
    auditLog: AccountDocument
  }
  security: AccountSecurity
  labels: {
    status: Record<FeedbackStatus | ExportRequestStatus | DeleteRequestStatus, string>
    notificationTypes: Record<AccountNotificationType, string>
    notificationStatus: Record<AccountNotificationStatus, string>
    accountBindingStatus: Record<AccountBindingStatus, string>
    ocrAuthorizationStatus: Record<OcrAuthorizationStatus, string>
    sections: {
      messages: string
      help: string
      privacy: string
      data: string
      preferences: string
    }
  }
}
