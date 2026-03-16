"use client"

import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react"

import { getPageStateMeta, type PageStateTone } from "./page-state.helpers"

type PageStateProps = {
  tone: PageStateTone
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
}

export function PageState({ tone, title, body, actionLabel, onAction }: PageStateProps) {
  const meta = getPageStateMeta(tone)

  return (
    <div className={`rounded-[28px] border px-4 py-10 text-center shadow-[0_18px_40px_rgba(109,181,120,0.08)] ${meta.wrapperClassName}`}>
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${meta.iconClassName}`}>
        {meta.icon === "loader" ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : meta.icon === "alert" ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <Inbox className="h-5 w-5" />
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
