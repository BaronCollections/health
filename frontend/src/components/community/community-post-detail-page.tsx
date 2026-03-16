"use client"

import { useEffect, useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getCommunityContent } from "@/lib/community"
import { fetchCommunityPostDetail, likeCommunityPost, saveCommunityPost, submitCommunityComment } from "@/lib/community-api/client"
import type { CommunityPost } from "@/lib/community/types"

import { CommentThread } from "./comment-thread"
import { PostCard } from "./post-card"

export function CommunityPostDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { locale } = useLocale()
  const content = getCommunityContent(locale)
  const [post, setPost] = useState<CommunityPost | null>(null)

  useEffect(() => {
    if (!params.id) {
      return
    }

    setPost(null)
    void fetchCommunityPostDetail(locale, params.id).then((response) => setPost(response))
  }, [locale, params.id])

  if (!post) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-[#F8FBF8] px-4 pb-12 pt-20">
        <button
          type="button"
          onClick={() => router.push("/community")}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {content.detail.backCta}
        </button>
        <div className="mt-5 rounded-[28px] bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-base font-semibold text-foreground">{content.home.emptyTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{content.home.emptyBody}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_28%,#F8FBF8_100%)] px-4 pb-12 pt-16">
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.detail.backCta}
      </button>

      <div className="mt-5 space-y-4">
        <PostCard
          post={post}
          statusLabels={content.statuses}
          likeLabel={content.detail.like}
          saveLabel={content.detail.save}
          showStatus={post.viewerOwned}
          onLike={() => {
            setPost((current) => (current ? { ...current, likes: current.likes + 1 } : current))
            void likeCommunityPost(locale, post.id).then((updated) => {
              if (updated) {
                setPost(updated)
              }
            })
          }}
          onSave={() => {
            setPost((current) => (current ? { ...current, saves: current.saves + 1 } : current))
            void saveCommunityPost(locale, post.id).then((updated) => {
              if (updated) {
                setPost(updated)
              }
            })
          }}
        />
        <CommentThread
          comments={post.comments}
          statusLabels={content.statuses}
          title={content.detail.commentsTitle}
          placeholder={content.detail.commentPlaceholder}
          submitLabel={content.detail.submitComment}
          emptyLabel={content.detail.noComments}
          onSubmitComment={(message) => submitCommunityComment(locale, post.id, { content: message })}
        />
      </div>
    </div>
  )
}
