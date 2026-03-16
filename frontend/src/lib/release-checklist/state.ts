import type {
  ReleaseChecklistGroup,
  ReleaseChecklistManualState,
  ReleaseChecklistStatus,
  ResolvedReleaseChecklistGroup,
} from "./types.ts"

const statusSeverity: Record<ReleaseChecklistStatus, number> = {
  ready: 0,
  attention: 1,
  blocked: 2,
}

function getMoreSevereStatus(
  left: ReleaseChecklistStatus,
  right: ReleaseChecklistStatus,
): ReleaseChecklistStatus {
  return statusSeverity[left] >= statusSeverity[right] ? left : right
}

export function resolveReleaseChecklistGroups(
  groups: ReleaseChecklistGroup[],
  manualState: ReleaseChecklistManualState,
): ResolvedReleaseChecklistGroup[] {
  return groups.map((group) => {
    const items = group.items.map((item) => {
      const confirmation = manualState[item.id]
      const resolvedStatus = item.checkType === "manual" && confirmation ? "ready" : item.status

      return {
        ...item,
        resolvedStatus,
        confirmedAt: confirmation?.confirmedAt,
      }
    })

    const resolvedStatus = items.reduce<ReleaseChecklistStatus>(
      (current, item) => getMoreSevereStatus(current, item.resolvedStatus),
      "ready",
    )

    return {
      ...group,
      resolvedStatus,
      items,
    }
  })
}

export function getOverallReleaseChecklistStatus(
  groups: ReleaseChecklistGroup[],
  manualState: ReleaseChecklistManualState,
) {
  return resolveReleaseChecklistGroups(groups, manualState).reduce<ReleaseChecklistStatus>(
    (current, group) => getMoreSevereStatus(current, group.resolvedStatus),
    "ready",
  )
}
