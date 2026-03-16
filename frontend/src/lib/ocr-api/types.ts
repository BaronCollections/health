export type ApiResult<T> = {
  code: number
  message: string
  data: T
}

export type OcrUploadApiResponse = {
  assessmentId: number
  taskId: string
  status: string
  nextAction: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
}

export type OcrResultField = {
  id: string
  value: string
  confidence: "high" | "medium" | "low"
}

export type OcrResultSection = {
  id: string
  fields: OcrResultField[]
}

export type OcrResultApiResponse = {
  assessmentId: number
  taskId: string
  status: string
  confirmationRequired: boolean
  sourceSummary: string
  sections: OcrResultSection[]
}
