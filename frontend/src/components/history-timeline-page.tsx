"use client"

import { ArrowLeft, ChevronRight, Clock3, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getTimelineContent } from "@/lib/timeline"

import { SharedNav } from "./shared-nav"

export function HistoryTimelinePage() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const content = getTimelineContent(locale)

  return (
    <div className="min-h-screen bg-[#F6FAF4] flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            aria-label={content.actions.secondary}
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">{content.overview.eyebrow}</p>
              <h1 className="text-lg font-bold text-foreground mt-1">{content.overview.title}</h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.header.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.overview.body}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-[#F7FBF6] border border-[#E0EBDD] p-4">
              <p className="text-xs text-muted-foreground">{content.overview.scoreLabel}</p>
              <p className="text-2xl font-bold text-foreground mt-2">{content.overview.scoreValue}</p>
            </div>
            <div className="rounded-2xl bg-[#F7FBF6] border border-[#E0EBDD] p-4">
              <p className="text-xs text-muted-foreground">{content.overview.deltaLabel}</p>
              <p className="text-2xl font-bold text-primary mt-2">{content.overview.deltaValue}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">{content.trendSection.title}</h2>
          </div>

          <div className="space-y-3">
            {content.trendSection.items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#FAFCF9] border border-[#E8EEE7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <span className="text-sm font-bold text-primary">{item.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock3 className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">{content.snapshotsSection.title}</h2>
          </div>

          <div className="space-y-4">
            {content.snapshotsSection.items.map((item, index) => (
              <div key={item.id} className="relative pl-6">
                {index !== content.snapshotsSection.items.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-16px] w-px bg-primary/20" />
                )}
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-primary/15 border border-primary/30" />

                <div className={`rounded-3xl border border-white/70 bg-gradient-to-br ${item.gradient} p-4 shadow-sm`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{item.dateLabel}</p>
                      <h3 className="text-base font-bold text-foreground mt-1">{item.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{item.delta}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{item.score}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-white/80 text-xs font-medium text-foreground">{item.primaryGoal}</span>
                    <span className="px-3 py-1 rounded-full bg-white/80 text-xs font-medium text-foreground">{item.habit}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">{item.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">{content.milestonesSection.title}</h2>
          </div>

          <div className="space-y-3">
            {content.milestonesSection.items.map((item) => (
              <div key={item} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 bg-white border-t border-border px-4 py-4 space-y-3">
        <button
          onClick={() => router.push("/questionnaire")}
          className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
        >
          {content.actions.primary}
        </button>
        <button
          onClick={() => router.push("/report")}
          className="w-full py-3.5 rounded-full border border-border text-foreground font-medium bg-white flex items-center justify-center gap-2"
        >
          {content.actions.secondary}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <SharedNav />
    </div>
  )
}
