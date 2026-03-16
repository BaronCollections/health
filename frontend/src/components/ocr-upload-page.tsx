"use client"

import { useEffect, useRef, useState } from "react"

import { ArrowLeft, FileText, LoaderCircle, Sparkles, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getOcrUploadContent } from "@/lib/ocr-upload"
import { formatOcrFileSize, saveOcrUploadSession } from "@/lib/ocr/session"

import { SharedNav } from "./shared-nav"

type UploadStatus = "idle" | "ready" | "processing"

export function OcrUploadPage() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const content = getOcrUploadContent(locale)
  const inputRef = useRef<HTMLInputElement>(null)
  const processingTimeoutRef = useRef<number | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current !== null) {
        window.clearTimeout(processingTimeoutRef.current)
      }
    }
  }, [])

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
    setStatus("ready")
  }

  const handleStartRecognition = () => {
    if (!selectedFile) {
      return
    }

    setStatus("processing")
    saveOcrUploadSession({
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
    })

    processingTimeoutRef.current = window.setTimeout(() => {
      router.push("/ocr-confirmation")
    }, 1600)
  }

  return (
    <div className="min-h-screen bg-[#F6FAF4] flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            aria-label={content.idleCard.secondaryCta}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-white"
            onClick={() => router.push("/report")}
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{content.header.title}</p>
            <p className="text-xs text-muted-foreground truncate">{t("brand.name")}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        <section className="rounded-3xl bg-white p-5 border border-[#DDECDC] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">{content.hero.eyebrow}</p>
              <h1 className="text-lg font-bold text-foreground mt-1">{content.hero.title}</h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.header.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.hero.body}</p>
              <p className="text-xs text-muted-foreground mt-3">{content.formatsLabel}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {content.steps.map((step, index) => (
            <div key={step.id} className="rounded-2xl bg-white border border-border p-3 shadow-sm">
              <p className="text-[11px] font-semibold text-primary">0{index + 1}</p>
              <h2 className="text-sm font-medium text-foreground mt-2">{step.title}</h2>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </section>

        <input
          ref={inputRef}
          accept=".pdf,image/png,image/jpeg,image/jpg"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />

        {status === "idle" && (
          <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{content.idleCard.title}</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.idleCard.body}</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <button
                className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
                onClick={openFilePicker}
              >
                {content.idleCard.primaryCta}
              </button>
              <button
                className="w-full py-3.5 rounded-full border border-border text-foreground font-medium bg-white"
                onClick={() => router.push("/report")}
              >
                {content.idleCard.secondaryCta}
              </button>
            </div>
          </section>
        )}

        {selectedFile && status !== "idle" && (
          <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                {status === "processing" ? (
                  <LoaderCircle className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">
                  {status === "ready" ? content.readyCard.title : content.processingCard.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {status === "ready" ? content.readyCard.body : content.processingCard.body}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F7FBF6] border border-[#E0EBDD] p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">{content.readyCard.fileNameLabel}</span>
                <span className="text-sm font-medium text-foreground text-right break-all">{selectedFile.name}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">{content.readyCard.fileSizeLabel}</span>
                <span className="text-sm font-medium text-foreground">{formatOcrFileSize(selectedFile.size)}</span>
              </div>
            </div>

            {status === "ready" && (
              <div className="space-y-3 mt-6">
                <button
                  className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
                  onClick={handleStartRecognition}
                >
                  {content.readyCard.primaryCta}
                </button>
                <button
                  className="w-full py-3.5 rounded-full border border-border text-foreground font-medium bg-white"
                  onClick={openFilePicker}
                >
                  {content.readyCard.replaceCta}
                </button>
              </div>
            )}

            {status === "processing" && (
              <div className="mt-6 space-y-3">
                {content.processingCard.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#FAFCF9] border border-[#E8EEE7] px-4 py-3">
                    <LoaderCircle className="w-4 h-4 text-primary animate-spin shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed text-center px-4">{content.footerNote}</p>
      </main>

      <SharedNav />
    </div>
  )
}
