"use client"

import type React from "react"

import Link from "next/link"
import { User } from "lucide-react"

interface SharedHeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  rightContent?: React.ReactNode
}

export function SharedHeader({ title, subtitle, showBack, rightContent }: SharedHeaderProps) {
  return (
    <header className="px-6 pt-14 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {subtitle && <p className="text-klein-blue text-sm font-medium tracking-wide">{subtitle}</p>}
          {title && <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>}
        </div>
        <div className="flex items-center gap-3">
          {rightContent}
          {/* 固定的头像图标 */}
          <Link
            href="/pricing"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            <User className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}
