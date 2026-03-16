import api from "@/lib/api"

import type { ApiResult, OcrResultApiResponse, OcrUploadApiResponse } from "./types"

export async function uploadOcrReport(assessmentId: number, file: File): Promise<OcrUploadApiResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = (await api.post(
    `/assessment/${assessmentId}/report/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )) as ApiResult<OcrUploadApiResponse>

  if (response.code !== 200 || !response.data) {
    throw new Error(response.message || "OCR upload failed")
  }

  return response.data
}

export async function fetchOcrResult(assessmentId: number): Promise<OcrResultApiResponse> {
  const response = (await api.get(`/assessment/${assessmentId}/report/result`)) as ApiResult<OcrResultApiResponse>

  if (response.code !== 200 || !response.data) {
    throw new Error(response.message || "OCR result fetch failed")
  }

  return response.data
}
