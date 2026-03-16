"use client"

import { useMemo, useState } from "react"

import { ArrowRight, Clock3, Layers3, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import { SharedNav } from "@/components/shared-nav"
import { useLocale } from "@/i18n/use-locale"
import { getCommunityContent, getPublicCommunityPosts } from "@/lib/community"

import { PostCard } from "./post-card"

export function CommunityHome() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getCommunityContent(locale)
  const publicPosts = getPublicCommunityPosts(locale)

  const [activeTab, setActiveTab] = useState<"recommended" | "circles">("recommended")
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedCircleId) {
      return publicPosts
    }

    return publicPosts.filter((post) => post.circleId === selectedCircleId)
  }, [publicPosts, selectedCircleId])

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(109,181,120,0.22),_transparent_42%),linear-gradient(180deg,_#F4FBF4_0%,_#FFFFFF_38%,_#F8FBF8_100%)]">
      <main className="flex-1 px-4 pb-28 pt-16">
        <section className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.15)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            MintBit Community
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">{content.home.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.home.subtitle}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/community/create")}
              className="rounded-[24px] bg-primary px-4 py-4 text-left text-white shadow-[0_14px_28px_rgba(109,181,120,0.28)]"
            >
              <Plus className="h-4 w-4" />
              <p className="mt-4 text-sm font-semibold">{content.home.createCta}</p>
            </button>
            <button
              type="button"
              onClick={() => router.push("/community/me")}
              className="rounded-[24px] border border-[#DDECDC] bg-[#F8FCF8] px-4 py-4 text-left text-foreground"
            >
              <Clock3 className="h-4 w-4 text-primary" />
              <p className="mt-4 text-sm font-semibold">{content.home.myPostsCta}</p>
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(109,181,120,0.12)] backdrop-blur">
          <div className="flex rounded-full bg-[#F1F6F2] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("recommended")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "recommended" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {content.home.recommendedTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("circles")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "circles" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {content.home.circlesTab}
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCircleId(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                selectedCircleId === null ? "bg-primary text-white" : "bg-[#F4FAF5] text-primary"
              }`}
            >
              {content.home.allCircles}
            </button>
            {content.circles.map((circle) => (
              <button
                key={circle.id}
                type="button"
                onClick={() => setSelectedCircleId(circle.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                  selectedCircleId === circle.id ? "bg-primary text-white" : "bg-[#F4FAF5] text-primary"
                }`}
              >
                {circle.name}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => router.push("/timeline")}
          className="mt-5 w-full rounded-[30px] bg-[linear-gradient(135deg,#F0F7EC_0%,#DCEFD7_48%,#FFFFFF_100%)] p-5 text-left shadow-[0_18px_40px_rgba(109,181,120,0.18)]"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-primary">
            <Layers3 className="h-3.5 w-3.5" />
            {content.home.timelineBridge.eyebrow}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">{content.home.timelineBridge.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.home.timelineBridge.body}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {content.home.timelineBridge.cta}
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        {activeTab === "circles" ? (
          <section className="mt-5 grid gap-3">
            {content.circles.map((circle) => (
              <button
                key={circle.id}
                type="button"
                onClick={() => setSelectedCircleId(circle.id)}
                className={`rounded-[28px] border p-4 text-left transition ${
                  selectedCircleId === circle.id
                    ? "border-primary bg-white shadow-[0_16px_36px_rgba(109,181,120,0.18)]"
                    : "border-white/80 bg-white/85"
                }`}
              >
                <div className={`h-2 rounded-full bg-gradient-to-r ${circle.accent}`} />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{circle.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{circle.description}</p>
                  </div>
                  <span className="rounded-full bg-[#F2F8F2] px-3 py-1 text-xs font-semibold text-primary">
                    {circle.members}
                  </span>
                </div>
              </button>
            ))}
          </section>
        ) : null}

        <section className="mt-5 space-y-4">
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                statusLabels={content.statuses}
                likeLabel={content.detail.like}
                saveLabel={content.detail.save}
                onOpenDetail={() => router.push(`/community/post/${post.id}`)}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#CFE2CF] bg-white/80 px-4 py-10 text-center">
              <p className="text-base font-semibold text-foreground">{content.home.emptyTitle}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.home.emptyBody}</p>
            </div>
          )}
        </section>
      </main>

      <SharedNav />
    </div>
  )
}
