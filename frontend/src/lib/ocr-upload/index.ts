import type { Locale } from "@/i18n/types"

import uploadEn from "./ocr-upload.en.json"
import uploadZh from "./ocr-upload.json"
import type { OcrUploadContent } from "./types"

const uploadContentByLocale: Record<Locale, OcrUploadContent> = {
  "zh-CN": uploadZh,
  en: uploadEn,
}

export const getOcrUploadContent = (locale: Locale): OcrUploadContent => uploadContentByLocale[locale]
