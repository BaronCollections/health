"use client"

import type { ReactNode } from "react"

import { Bookmark, ChevronRight, Heart, MessageCircle } from "lucide-react"

import { ModerationStatusBadge } from "./moderation-status-badge"

import type { CommunityPost, CommunityStatus } from "@/lib/community/types"

type PostCardProps = {
  post: CommunityPost
  statusLabels: Record<CommunityStatus, string>
  likeLabel: string
  saveLabel: string
  showStatus?: boolean
  onOpenDetail?: () => void
  onLike?: () => void
  onSave?: () => void
  footerSlot?: ReactNode
}

export function PostCard({
  post,
  statusLabels,
  likeLabel,
  saveLabel,
  showStatus = false,
  onOpenDetail,
  onLike,
  onSave,
  footerSlot,
}: PostCardProps) {
  return (
    <article className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(109,181,120,0.12)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D7F0DE] to-[#6DB578] text-sm font-bold text-white">
            {post.authorAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{post.authorName}</h3>
              {showStatus ? <ModerationStatusBadge status={post.status} labels={statusLabels} /> : null}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{post.authorRole}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {post.circleName} · {post.relativeTime}
            </p>
          </div>
        </div>
        {onOpenDetail ? (
          <button
            type="button"
            onClick={onOpenDetail}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F4FAF5] text-primary transition hover:bg-[#E6F5E8]"
            aria-label={post.circleName}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground">{post.content}</p>

      {post.tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F3F9F3] px-2.5 py-1 text-[11px] font-medium text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      {post.moderationReason ? (
        <div className="mt-3 rounded-2xl bg-[#FFF7EA] px-3 py-2 text-xs leading-5 text-[#8C5A13]">
          {post.moderationReason}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onLike}
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent p-0"
          aria-label={likeLabel}
        >
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent p-0"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent p-0"
          aria-label={saveLabel}
        >
          <Bookmark className="h-4 w-4" />
          <span>{post.saves}</span>
        </button>
      </div>

      {footerSlot ? <div className="mt-4">{footerSlot}</div> : null}
    </article>
  )
}
