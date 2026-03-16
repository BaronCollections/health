import type {
  CommunityAudience,
  CommunityCommentStatus,
  CommunityPostStatus,
} from "./types"

const postStatusesByAudience: Record<CommunityAudience, readonly CommunityPostStatus[]> = {
  public: ["approved"],
  author: ["approved", "pending_review", "rejected", "flagged"],
  ops: ["draft", "pending_review", "approved", "rejected", "flagged", "hidden"],
}

const commentStatusesByAudience: Record<CommunityAudience, readonly CommunityCommentStatus[]> = {
  public: ["approved"],
  author: ["approved", "pending_review", "rejected"],
  ops: ["approved", "pending_review", "rejected", "hidden"],
}

export function filterPostsForAudience<T extends { status: CommunityPostStatus }>(
  posts: readonly T[],
  audience: CommunityAudience,
) {
  const allowedStatuses = new Set(postStatusesByAudience[audience])
  return posts.filter((post) => allowedStatuses.has(post.status))
}

export function filterCommentsForAudience<T extends { status: CommunityCommentStatus }>(
  comments: readonly T[],
  audience: CommunityAudience,
) {
  const allowedStatuses = new Set(commentStatusesByAudience[audience])
  return comments.filter((comment) => allowedStatuses.has(comment.status))
}
