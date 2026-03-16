export const OCR_UPLOAD_SESSION_KEY = "mintbit-ocr-upload-session"

export type OcrUploadSession = {
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  assessmentId?: number
  taskId?: string
  syncStatus?: "local-only" | "uploaded" | "sync-failed"
}

function canUseWindow() {
  return typeof window !== "undefined"
}

export function saveOcrUploadSession(session: OcrUploadSession) {
  if (!canUseWindow()) {
    return
  }

  window.localStorage.setItem(OCR_UPLOAD_SESSION_KEY, JSON.stringify(session))
}

export function getOcrUploadSession(): OcrUploadSession | null {
  if (!canUseWindow()) {
    return null
  }

  const rawValue = window.localStorage.getItem(OCR_UPLOAD_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as OcrUploadSession
  } catch {
    window.localStorage.removeItem(OCR_UPLOAD_SESSION_KEY)
    return null
  }
}

export function clearOcrUploadSession() {
  if (!canUseWindow()) {
    return
  }

  window.localStorage.removeItem(OCR_UPLOAD_SESSION_KEY)
}

export function formatOcrFileSize(fileSize: number) {
  if (fileSize < 1024) {
    return `${fileSize} B`
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`
  }

  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
}
