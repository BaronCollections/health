"use client"

import { useState } from "react"

import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { createFeedbackRecord } from "@/lib/account-api/client"
import type { FeedbackRecord } from "@/lib/account/types"

export function FeedbackFormPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [category, setCategory] = useState(content.feedbackForm.categories[0] ?? "")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [screenshotName, setScreenshotName] = useState("")
  const [submittedRecord, setSubmittedRecord] = useState<FeedbackRecord | null>(null)

  if (submittedRecord) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_34%,#F8FBF8_100%)] px-4 pb-12 pt-20">
        <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 text-center shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF8F0] text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">{content.feedbackForm.successTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.feedbackForm.successBody}</p>
          <div className="mt-6 rounded-[22px] bg-[#F6FAF6] px-4 py-4 text-left">
            <p className="text-xs font-medium text-muted-foreground">{content.labels.status[submittedRecord.status]}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{submittedRecord.subject}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/profile/help/records")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            {content.helpCenter.feedbackRecordsCta}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_32%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/profile/help")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.helpCenter.backCta}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{content.feedbackForm.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.feedbackForm.subtitle}</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void createFeedbackRecord(locale, {
              category,
              subject,
              description,
              contact,
              screenshotName: screenshotName || undefined,
            }).then((record) => {
              setSubmittedRecord(record)
            })
          }}
        >
          <label className="block">
            <span className="text-sm font-semibold text-foreground">{content.feedbackForm.categoryLabel}</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-[20px] border border-[#DCE9DD] bg-[#FBFDFC] px-4 py-3 text-sm text-foreground outline-none"
            >
              {content.feedbackForm.categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">{content.feedbackForm.subjectLabel}</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder={content.feedbackForm.subjectPlaceholder}
              className="mt-2 w-full rounded-[20px] border border-[#DCE9DD] bg-[#FBFDFC] px-4 py-3 text-sm text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">{content.feedbackForm.descriptionLabel}</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={content.feedbackForm.descriptionPlaceholder}
              rows={5}
              className="mt-2 w-full rounded-[20px] border border-[#DCE9DD] bg-[#FBFDFC] px-4 py-3 text-sm leading-6 text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">{content.feedbackForm.contactLabel}</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder={content.feedbackForm.contactPlaceholder}
              className="mt-2 w-full rounded-[20px] border border-[#DCE9DD] bg-[#FBFDFC] px-4 py-3 text-sm text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">{content.feedbackForm.screenshotLabel}</span>
            <input
              value={screenshotName}
              onChange={(event) => setScreenshotName(event.target.value)}
              placeholder={content.feedbackForm.screenshotPlaceholder}
              className="mt-2 w-full rounded-[20px] border border-[#DCE9DD] bg-[#FBFDFC] px-4 py-3 text-sm text-foreground outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={!subject.trim() || !description.trim()}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#BFD7C1]"
          >
            {content.feedbackForm.submitCta}
          </button>
        </form>
      </section>
    </div>
  )
}
