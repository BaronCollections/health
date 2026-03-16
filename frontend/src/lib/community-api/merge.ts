import type { CommunityComment, CommunityPost } from "../community/types"

function mergeCommunityComments(
  localComments: CommunityComment[],
  apiComments: CommunityComment[],
) {
  const localById = new Map(localComments.map((comment) => [comment.id, comment]))

  return apiComments.map((comment) => {
    const localized = localById.get(comment.id)

    if (!localized) {
      return comment
    }

    return {
      ...localized,
      status: comment.status,
      relativeTime: comment.relativeTime,
      likes: comment.likes,
      moderationReason: comment.moderationReason,
    }
  })
}

export function mergeCommunityPosts(
  localPosts: CommunityPost[],
  apiPosts: CommunityPost[],
): CommunityPost[] {
  const localById = new Map(localPosts.map((post) => [post.id, post]))

  return apiPosts.map((post) => {
    const localized = localById.get(post.id)

    if (!localized) {
      return post
    }

    return {
      ...localized,
      status: post.status,
      relativeTime: post.relativeTime,
      likes: post.likes,
      saves: post.saves,
      moderationReason: post.moderationReason,
      comments: mergeCommunityComments(localized.comments, post.comments),
    }
  })
}
