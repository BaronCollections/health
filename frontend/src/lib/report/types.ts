import reportZh from "./report-content.json"

export type ReportContent = typeof reportZh
export type ReportGoal = ReportContent["goalsSection"]["items"][number]
export type ReportGoalId = ReportGoal["id"]
export type ReportDimension = ReportContent["dimensions"][number]
export type ReportDimensionId = ReportDimension["id"]
