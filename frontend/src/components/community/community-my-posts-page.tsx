"use client"

import { useEffect, useMemo, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getCommunityContent } from "@/lib/community"
import { fetchMyCommunityPosts, likeCommunityPost, saveCommunityPost } from "@/lib/community-api/client"
import type { CommunityPost } from "@/lib/community/types"

import { PostCard } from "./post-card"

const orderedStatuses = ["pending_review", "approved", "rejected", "flagged"] as const

export function CommunityMyPostsPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getCommunityContent(locale)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [activeStatus, setActiveStatus] = useState<(typeof orderedStatuses)[number]>("pending_review")

  useEffect(() => {
    void fetchMyCommunityPosts(locale).then((response) => setPosts(response))
  }, [locale])

  const groupedPosts = useMemo(() => {
    const grouped = new Map<string, CommunityPost[]>()

    for (const post of posts) {
      const current = grouped.get(post.status) ?? []
      current.push(post)
      grouped.set(post.status, current)
    }

    return grouped
  }, [posts])

  const activePosts = groupedPosts.get(activeStatus) ?? []

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F5FBF5_0%,#FFFFFF_30%,#F7FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.detail.backCta}
      </button>

      <section className="mt-5 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <h1 className="text-[26px] font-semibold leading-8 text-foreground">{content.myPosts.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.myPosts.subtitle}</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {orderedStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                activeStatus === status ? "bg-primary text-white" : "bg-[#F4FAF5] text-primary"
              }`}
            >
              {content.myPosts.tabs[status]}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {activePosts.length ? (
          activePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              statusLabels={content.statuses}
              likeLabel={content.detail.like}
              saveLabel={content.detail.save}
              showStatus
              onOpenDetail={() => router.push(`/community/post/${post.id}`)}
              onLike={() => {
                setPosts((previous) =>
                  previous.map((entry) =>
                    entry.id === post.id ? { ...entry, likes: entry.likes + 1 } : entry,
                  ),
                )
                void likeCommunityPost(locale, post.id).then((updated) => {
                  if (!updated) {
                    return
                  }
                  setPosts((previous) =>
                    previous.map((entry) => (entry.id === updated.id ? updated : entry)),
                  )
                })
              }}
              onSave={() => {
                setPosts((previous) =>
                  previous.map((entry) =>
                    entry.id === post.id ? { ...entry, saves: entry.saves + 1 } : entry,
                  ),
                )
                void saveCommunityPost(locale, post.id).then((updated) => {
                  if (!updated) {
                    return
                  }
                  setPosts((previous) =>
                    previous.map((entry) => (entry.id === updated.id ? updated : entry)),
                  )
                })
              }}
              footerSlot={
                activeStatus === "rejected" || activeStatus === "flagged" ? (
                  <button
                    type="button"
                    onClick={() => router.push("/community/create")}
                    className="w-full rounded-full bg-[#F4FAF5] px-4 py-3 text-sm font-semibold text-primary"
                  >
                    {content.myPosts.resubmit}
                  </button>
                ) : undefined
              }
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#CCE0CD] bg-white/85 px-4 py-10 text-center">
            <p className="text-base font-semibold text-foreground">{content.myPosts.emptyTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.myPosts.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  )
}
