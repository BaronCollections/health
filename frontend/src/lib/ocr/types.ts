import ocrZh from "./ocr-confirmation.json"

export type OcrConfirmationContent = typeof ocrZh
export type OcrFieldConfidence = OcrConfirmationContent["sections"][number]["fields"][number]["confidence"]
