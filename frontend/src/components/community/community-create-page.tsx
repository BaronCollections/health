"use client"

import { useMemo, useState } from "react"

import { ArrowLeft, ImagePlus } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getCommunityContent } from "@/lib/community"

export function CommunityCreatePage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getCommunityContent(locale)
  const [circleId, setCircleId] = useState(content.circles[0]?.id ?? "")
  const [body, setBody] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const suggestedTags = useMemo(
    () => Array.from(new Set(content.seedPosts.flatMap((post) => post.tags))).slice(0, 4),
    [content.seedPosts],
  )

  const handleSubmit = () => {
    if (!body.trim()) {
      return
    }

    setSubmitted(true)
    window.setTimeout(() => router.push("/community/me"), 900)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F2FAF2_0%,#FFFFFF_30%,#F7FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.detail.backCta}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[26px] font-semibold leading-8 text-foreground">{content.create.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.create.subtitle}</p>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {content.create.circleLabel}
          </label>
          <div className="mt-3 grid gap-3">
            {content.circles.map((circle) => (
              <button
                key={circle.id}
                type="button"
                onClick={() => setCircleId(circle.id)}
                className={`rounded-[24px] border p-4 text-left ${
                  circleId === circle.id ? "border-primary bg-[#F4FBF4]" : "border-[#E5EFE5] bg-[#FCFEFC]"
                }`}
              >
                <div className={`h-2 rounded-full bg-gradient-to-r ${circle.accent}`} />
                <h2 className="mt-4 text-base font-semibold text-foreground">{circle.name}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{circle.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {content.create.contentLabel}
          </label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={7}
            placeholder={content.create.contentPlaceholder}
            className="mt-3 w-full rounded-[28px] border border-[#DCECDC] bg-[#FAFDFB] px-4 py-4 text-sm leading-6 text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {content.create.tagsLabel}
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#F2F8F2] px-3 py-1.5 text-xs font-semibold text-primary">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-dashed border-[#CCE0CD] bg-[#FAFDFB] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF8EF] text-primary">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{content.create.addImage}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{content.create.imageHint}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-[24px] bg-[#EFF8F0] px-4 py-4">
            <p className="text-sm font-semibold text-primary">{content.create.successTitle}</p>
            <p className="mt-1 text-xs leading-5 text-[#4A7A50]">{content.create.successBody}</p>
          </div>
        ) : null}

        <p className="mt-6 text-xs leading-5 text-muted-foreground">{content.create.pendingHint}</p>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full rounded-full bg-primary px-4 py-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(109,181,120,0.28)] disabled:opacity-50"
          disabled={!body.trim()}
        >
          {content.create.submit}
        </button>
      </section>
    </div>
  )
}
