import type { Locale } from "@/i18n/types"

import ocrEn from "./ocr-confirmation.en.json"
import ocrZh from "./ocr-confirmation.json"
import type { OcrConfirmationContent } from "./types"

const ocrContentByLocale: Record<Locale, OcrConfirmationContent> = {
  "zh-CN": ocrZh,
  en: ocrEn,
}

export const getOcrConfirmationContent = (locale: Locale): OcrConfirmationContent => ocrContentByLocale[locale]
