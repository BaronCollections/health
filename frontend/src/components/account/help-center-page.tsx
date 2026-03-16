"use client"

import { useEffect, useState } from "react"

import { ChevronRight, Headset, LifeBuoy, MessagesSquare } from "lucide-react"
import { useRouter } from "next/navigation"

import { FallbackBadge } from "@/components/shared/fallback-badge"
import { PageState } from "@/components/shared/page-state"
import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getAccountContent } from "@/lib/account"
import { fetchAccountFaqCategories } from "@/lib/account-api/client"
import type { AccountFaqCategory } from "@/lib/account/types"

export function HelpCenterPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getAccountContent(locale)
  const [faqCategories, setFaqCategories] = useState<AccountFaqCategory[]>(content.faqCategories)
  const [isRefreshing, setIsRefreshing] = useState(true)

  const fallbackLabel =
    locale === "zh-CN"
      ? "FAQ 和支持说明内置在应用包内，接口失败时仍会展示双语 fallback。"
      : "FAQs and support copy are bundled in the app so bilingual fallback stays available if the API fails."

  useEffect(() => {
    setFaqCategories(content.faqCategories)
    setIsRefreshing(true)
    void fetchAccountFaqCategories(locale)
      .then((categories) => {
        setFaqCategories(categories)
      })
      .finally(() => {
        setIsRefreshing(false)
      })
  }, [content.faqCategories, locale])

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.18),_transparent_38%),linear-gradient(180deg,_#F3FAF3_0%,_#FFFFFF_42%,_#F8FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <LifeBuoy className="h-3.5 w-3.5" />
            {content.helpCenter.eyebrow}
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.helpCenter.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.helpCenter.subtitle}</p>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile/help/feedback")}
            className="rounded-[26px] bg-primary px-4 py-5 text-left text-white shadow-[0_18px_36px_rgba(109,181,120,0.24)]"
          >
            <MessagesSquare className="h-5 w-5" />
            <p className="mt-5 text-sm font-semibold">{content.helpCenter.feedbackCta}</p>
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile/help/records")}
            className="rounded-[26px] border border-[#DDECDC] bg-white px-4 py-5 text-left text-foreground"
          >
            <Headset className="h-5 w-5 text-primary" />
            <p className="mt-5 text-sm font-semibold">{content.helpCenter.feedbackRecordsCta}</p>
          </button>
        </div>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(109,181,120,0.1)]">
          <FallbackBadge label={fallbackLabel} />

          <p className="text-xs font-medium text-muted-foreground">{content.helpCenter.supportLabel}</p>
          <p className="mt-2 text-base font-semibold text-foreground">{content.helpCenter.supportValue}</p>
        </section>

        <section className="mt-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">{content.helpCenter.faqTitle}</h2>
          {faqCategories.length ? (
            faqCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(109,181,120,0.1)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground">{category.title}</h3>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-3">
                  {category.items.map((item) => (
                    <div key={item.question} className="rounded-[22px] bg-[#F7FAF7] p-4">
                      <p className="text-sm font-semibold text-foreground">{item.question}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : isRefreshing ? (
            <PageState
              tone="loading"
              title={locale === "zh-CN" ? "帮助内容加载中" : "Loading help content"}
              body={
                locale === "zh-CN"
                  ? "正在同步 FAQ 和支持说明。"
                  : "Syncing FAQ entries and support guidance."
              }
            />
          ) : (
            <PageState
              tone="empty"
              title={locale === "zh-CN" ? "当前没有 FAQ" : "No FAQs yet"}
              body={
                locale === "zh-CN"
                  ? "稍后再来查看帮助内容，或先提交反馈。"
                  : "Check back later for help content, or submit feedback first."
              }
            />
          )}
        </section>
      </main>

      <SharedNav />
    </div>
  )
}
