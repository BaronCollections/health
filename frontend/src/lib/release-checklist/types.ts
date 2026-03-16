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

export type ReleaseChecklistGroup = {
  id: string
  title: string
  summary: string
  items: ReleaseChecklistItem[]
}
