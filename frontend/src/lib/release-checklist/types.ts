export type ReleaseChecklistStatus = "blocked" | "attention" | "ready"

export type ReleaseChecklistCheckType = "auto" | "manual" | "document"

export type ReleaseChecklistItem = {
  id: string
  title: string
  description: string
  checkType: ReleaseChecklistCheckType
  status: ReleaseChecklistStatus
  href?: string
}

export type ReleaseChecklistManualState = Record<
  string,
  {
    confirmedAt: string
  }
>

export type ResolvedReleaseChecklistItem = ReleaseChecklistItem & {
  resolvedStatus: ReleaseChecklistStatus
  confirmedAt?: string
}

export type ReleaseChecklistGroup = {
  id: string
  title: string
  summary: string
  items: ReleaseChecklistItem[]
}

export type ResolvedReleaseChecklistGroup = Omit<ReleaseChecklistGroup, "items"> & {
  resolvedStatus: ReleaseChecklistStatus
  items: ResolvedReleaseChecklistItem[]
}

export type ReleaseChecklistLink = {
  label: string
  href: string
}

export type ReleaseChecklistWarning = {
  id: string
  title: string
  body: string
}

export type ReleaseChecklistContent = {
  view: {
    eyebrow: string
    title: string
    subtitle: string
    adminOnlyHint: string
    overallStatusLabel: string
    diagnosticsTitle: string
    warningsTitle: string
    groupsTitle: string
    actionsTitle: string
    backCta: string
    markReadyCta: string
    resetManualCta: string
    manualConfirmedLabel: string
    redirectingTitle: string
    redirectingBody: string
    loadingTitle: string
    loadingBody: string
    emptyAllowlistLabel: string
  }
  labels: {
    status: Record<ReleaseChecklistStatus, string>
    checkType: Record<ReleaseChecklistCheckType, string>
    runtime: {
      platform: string
      environment: string
      apiBaseUrl: string
      identity: string
      allowlist: string
    }
  }
  diagnostics: {
    actionLinks: ReleaseChecklistLink[]
    knownWarnings: ReleaseChecklistWarning[]
  }
  groups: ReleaseChecklistGroup[]
}
