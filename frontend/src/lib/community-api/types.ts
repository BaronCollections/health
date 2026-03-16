import type {
  CommunityCircle,
  CommunityComment,
  CommunityPost,
  CommunityStatus,
  ModerationQueueItem,
} from "../community/types"

export type ApiResult<T> = {
  code: number
  message: string
  data: T
}

export type CommunityCircleApiResponse = CommunityCircle
export type CommunityCommentApiResponse = CommunityComment
export type CommunityPostApiResponse = CommunityPost
export type ModerationQueueItemApiResponse = ModerationQueueItem

export type CommunityFeedApiResponse = {
  circles: CommunityCircleApiResponse[]
  posts: CommunityPostApiResponse[]
}

export type MyCommunityPostsApiResponse = {
  posts: CommunityPostApiResponse[]
}

export type ModerationQueueApiResponse = {
  status: string
  items: ModerationQueueItemApiResponse[]
}

export type CreateCommunityPostInput = {
  circleId: string
  content: string
  tags: string[]
  images: string[]
  authorName?: string
  authorAvatar?: string
  authorRole?: string
}

export type CreateCommunityCommentInput = {
  content: string
  authorName?: string
  authorAvatar?: string
  authorRole?: string
}

export type ModerationDecisionInput = {
  reason?: string
  reviewerId?: string
}

export type ModerationAction = "approve" | "reject" | "flag" | "restore"

export type CommunityStatusLabelMap = Record<CommunityStatus, string>
