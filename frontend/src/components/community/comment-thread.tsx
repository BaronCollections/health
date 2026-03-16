"use client"

import { useState } from "react"

import { Send } from "lucide-react"

import { ModerationStatusBadge } from "./moderation-status-badge"

import type { CommunityComment, CommunityStatus } from "@/lib/community/types"

type CommentThreadProps = {
  comments: CommunityComment[]
  statusLabels: Record<CommunityStatus, string>
  title: string
  placeholder: string
  submitLabel: string
  emptyLabel: string
}

export function CommentThread({
  comments,
  statusLabels,
  title,
  placeholder,
  submitLabel,
  emptyLabel,
}: CommentThreadProps) {
  const [draft, setDraft] = useState("")
  const [threadComments, setThreadComments] = useState(comments)

  const handleSubmit = () => {
    const value = draft.trim()
    if (!value) {
      return
    }

    setThreadComments((previous) => [
      ...previous,
      {
        id: `local-${previous.length + 1}`,
        authorName: "Xiaoya",
        authorAvatar: "X",
        authorRole: "Particle assistant user",
        viewerOwned: true,
        status: "pending_review",
        relativeTime: "Just now",
        content: value,
        likes: 0,
      },
    ])
    setDraft("")
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(109,181,120,0.12)] backdrop-blur">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>

      <div className="mt-4 flex items-end gap-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder={placeholder}
          className="min-h-[96px] flex-1 rounded-3xl border border-[#DCECDC] bg-[#FAFDFB] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_24px_rgba(109,181,120,0.28)] transition hover:opacity-90"
          aria-label={submitLabel}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {threadComments.length ? (
        <div className="mt-5 space-y-4">
          {threadComments.map((comment) => (
            <article key={comment.id} className="rounded-3xl bg-[#F7FBF8] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{comment.authorName}</span>
                    {comment.status !== "approved" ? (
                      <ModerationStatusBadge status={comment.status} labels={statusLabels} />
                    ) : null}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {comment.authorRole} · {comment.relativeTime}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">{comment.likes}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground">{comment.content}</p>
              {comment.moderationReason ? (
                <p className="mt-2 text-xs leading-5 text-[#8C5A13]">{comment.moderationReason}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-3xl bg-[#F7FBF8] px-4 py-5 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </section>
  )
}
