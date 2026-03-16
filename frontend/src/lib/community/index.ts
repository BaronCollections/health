import type { Locale } from "@/i18n/types"

import communityEn from "./mock-content.en.json"
import communityZh from "./mock-content.json"
import { filterCommentsForAudience, filterPostsForAudience } from "./visibility"
import type { CommunityContent, CommunityPostStatus } from "./types"

const communityContentByLocale: Record<Locale, CommunityContent> = {
  "zh-CN": communityZh as CommunityContent,
  en: communityEn as CommunityContent,
}

export function getCommunityContent(locale: Locale): CommunityContent {
  return communityContentByLocale[locale]
}

export function getPublicCommunityPosts(locale: Locale) {
  const content = getCommunityContent(locale)

  return filterPostsForAudience(content.seedPosts, "public").map((post) => ({
    ...post,
    comments: filterCommentsForAudience(post.comments, "public"),
  }))
}

export function getViewerCommunityPosts(locale: Locale) {
  const content = getCommunityContent(locale)

  return filterPostsForAudience(
    content.seedPosts.filter((post) => post.viewerOwned),
    "author",
  ).map((post) => ({
    ...post,
    comments: filterCommentsForAudience(post.comments, "author"),
  }))
}

export function getCommunityPostDetail(locale: Locale, postId: string) {
  const content = getCommunityContent(locale)
  const post = content.seedPosts.find((entry) => entry.id === postId)

  if (!post) {
    return null
  }

  const audience = post.viewerOwned ? "author" : "public"
  const visiblePost = filterPostsForAudience([post], audience)[0]

  if (!visiblePost) {
    return null
  }

  return {
    ...visiblePost,
    comments: filterCommentsForAudience(visiblePost.comments, audience),
  }
}

export function getViewerCommunityPostsByStatus(locale: Locale) {
  const grouped = new Map<CommunityPostStatus, ReturnType<typeof getViewerCommunityPosts>>()

  for (const post of getViewerCommunityPosts(locale)) {
    const current = grouped.get(post.status) ?? []
    current.push(post)
    grouped.set(post.status, current)
  }

  return grouped
}
