import api from "../api"
import type { Locale } from "../../i18n/types"

import {
  getCommunityContent,
  getCommunityPostDetail as getLocalCommunityPostDetail,
  getPublicCommunityPosts,
  getViewerCommunityPosts,
} from "../community"
import type { CommunityCircle, CommunityComment, CommunityPost, ModerationQueueItem } from "../community/types"
import { filterCommentsForAudience, filterPostsForAudience } from "../community/visibility"
import { mergeCommunityPosts } from "./merge"

import type {
  ApiResult,
  CommunityFeedApiResponse,
  CommunityPostApiResponse,
  CreateCommunityCommentInput,
  CreateCommunityPostInput,
  ModerationAction,
  ModerationDecisionInput,
  ModerationQueueApiResponse,
  MyCommunityPostsApiResponse,
} from "./types"

function fallbackCreatedPost(locale: Locale, input: CreateCommunityPostInput): CommunityPost {
  const content = getCommunityContent(locale)
  const circle = content.circles.find((entry) => entry.id === input.circleId) ?? content.circles[0]

  return {
    id: `post-local-${Date.now()}`,
    authorName: input.authorName ?? "Xiaoya",
    authorAvatar: input.authorAvatar ?? "X",
    authorRole: input.authorRole ?? "Particle assistant user",
    viewerOwned: true,
    circleId: circle.id,
    circleName: circle.name,
    status: "pending_review",
    relativeTime: locale === "zh-CN" ? "刚刚" : "Just now",
    content: input.content,
    tags: input.tags,
    images: input.images,
    likes: 0,
    saves: 0,
    comments: [],
    moderationReason: content.create.pendingHint,
  }
}

function fallbackCreatedComment(locale: Locale, input: CreateCommunityCommentInput): CommunityComment {
  return {
    id: `comment-local-${Date.now()}`,
    authorName: input.authorName ?? "Xiaoya",
    authorAvatar: input.authorAvatar ?? "X",
    authorRole: input.authorRole ?? "Particle assistant user",
    viewerOwned: true,
    status: "pending_review",
    relativeTime: locale === "zh-CN" ? "刚刚" : "Just now",
    content: input.content,
    likes: 0,
    moderationReason: locale === "zh-CN" ? "评论已进入审核队列。" : "Comment queued for moderation.",
  }
}

export async function fetchCommunityFeed(locale: Locale): Promise<{
  circles: CommunityCircle[]
  posts: CommunityPost[]
}> {
  const content = getCommunityContent(locale)

  try {
    const response = (await api.get("/community/feed")) as ApiResult<CommunityFeedApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Community feed fetch failed")
    }

    return {
      circles: content.circles,
      posts: filterPostsForAudience(
        mergeCommunityPosts(content.seedPosts, response.data.posts),
        "public",
      ).map((post) => ({
        ...post,
        comments: filterCommentsForAudience(post.comments, "public"),
      })),
    }
  } catch {
    return {
      circles: content.circles,
      posts: getPublicCommunityPosts(locale),
    }
  }
}

export async function fetchCommunityPostDetail(locale: Locale, postId: string) {
  const content = getCommunityContent(locale)
  const localPost = content.seedPosts.find((post) => post.id === postId) ?? null

  try {
    const response = (await api.get(`/community/post/${postId}`)) as ApiResult<CommunityPostApiResponse | null>

    if (response.code !== 200) {
      throw new Error(response.message || "Community detail fetch failed")
    }

    if (!response.data) {
      return null
    }

    const merged = mergeCommunityPosts(localPost ? [localPost] : [], [response.data])[0]
    const audience = merged.viewerOwned ? "author" : "public"

    return {
      ...merged,
      comments: filterCommentsForAudience(merged.comments, audience),
    }
  } catch {
    return getLocalCommunityPostDetail(locale, postId)
  }
}

export async function fetchMyCommunityPosts(locale: Locale) {
  const content = getCommunityContent(locale)

  try {
    const response = (await api.get("/community/me/posts")) as ApiResult<MyCommunityPostsApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "My community posts fetch failed")
    }

    return filterPostsForAudience(
      mergeCommunityPosts(content.seedPosts, response.data.posts),
      "author",
    )
  } catch {
    return getViewerCommunityPosts(locale)
  }
}

export async function createCommunityPost(locale: Locale, input: CreateCommunityPostInput) {
  try {
    const response = (await api.post("/community/post", input)) as ApiResult<CommunityPostApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Create community post failed")
    }

    const localizedSeed = getCommunityContent(locale).seedPosts.filter((post) => post.id === response.data.id)
    return mergeCommunityPosts(localizedSeed, [response.data])[0] ?? response.data
  } catch {
    return fallbackCreatedPost(locale, input)
  }
}

export async function submitCommunityComment(
  locale: Locale,
  postId: string,
  input: CreateCommunityCommentInput,
) {
  try {
    const response = (await api.post(`/community/post/${postId}/comment`, input)) as ApiResult<CommunityComment>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Create community comment failed")
    }

    return response.data
  } catch {
    return fallbackCreatedComment(locale, input)
  }
}

export async function likeCommunityPost(locale: Locale, postId: string) {
  try {
    const response = (await api.post(`/community/post/${postId}/like`)) as ApiResult<CommunityPostApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Like community post failed")
    }

    const localizedSeed = getCommunityContent(locale).seedPosts.filter((post) => post.id === response.data.id)
    return mergeCommunityPosts(localizedSeed, [response.data])[0] ?? response.data
  } catch {
    return null
  }
}

export async function saveCommunityPost(locale: Locale, postId: string) {
  try {
    const response = (await api.post(`/community/post/${postId}/save`)) as ApiResult<CommunityPostApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Save community post failed")
    }

    const localizedSeed = getCommunityContent(locale).seedPosts.filter((post) => post.id === response.data.id)
    return mergeCommunityPosts(localizedSeed, [response.data])[0] ?? response.data
  } catch {
    return null
  }
}

export async function fetchModerationQueue(status?: string): Promise<ModerationQueueItem[]> {
  try {
    const response = (await api.get("/community/moderation/queue", {
      params: { status },
    })) as ApiResult<ModerationQueueApiResponse>

    if (response.code !== 200 || !response.data) {
      throw new Error(response.message || "Moderation queue fetch failed")
    }

    return response.data.items
  } catch {
    return []
  }
}

export async function moderateCommunityItem(
  targetType: "post" | "comment",
  targetId: string,
  action: ModerationAction,
  payload: ModerationDecisionInput,
) {
  const response = (await api.post(
    `/community/moderation/${targetType}/${targetId}/${action}`,
    payload,
  )) as ApiResult<ModerationQueueItem>

  if (response.code !== 200 || !response.data) {
    throw new Error(response.message || "Moderation action failed")
  }

  return response.data
}
