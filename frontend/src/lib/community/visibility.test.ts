import assert from "node:assert/strict"
import test from "node:test"

type CommunityPostStatus = "draft" | "pending_review" | "approved" | "rejected" | "flagged" | "hidden"
type CommunityCommentStatus = "pending_review" | "approved" | "rejected" | "hidden"

type PostRecord = {
  id: string
  status: CommunityPostStatus
}

type CommentRecord = {
  id: string
  status: CommunityCommentStatus
}

async function loadVisibilityModule() {
  try {
    return await import("./visibility.ts")
  } catch {
    return null
  }
}

test("public audience only sees approved community posts", async () => {
  const visibility = await loadVisibilityModule()
  assert.ok(visibility?.filterPostsForAudience, "filterPostsForAudience should be implemented")

  const posts: PostRecord[] = [
    { id: "approved", status: "approved" },
    { id: "pending", status: "pending_review" },
    { id: "rejected", status: "rejected" },
    { id: "flagged", status: "flagged" },
    { id: "hidden", status: "hidden" },
  ]

  const visiblePosts = visibility.filterPostsForAudience(posts, "public")

  assert.deepEqual(
    visiblePosts.map((post: PostRecord) => post.id),
    ["approved"],
  )
})

test("author audience keeps moderation feedback states except hidden posts", async () => {
  const visibility = await loadVisibilityModule()
  assert.ok(visibility?.filterPostsForAudience, "filterPostsForAudience should be implemented")

  const posts: PostRecord[] = [
    { id: "approved", status: "approved" },
    { id: "pending", status: "pending_review" },
    { id: "rejected", status: "rejected" },
    { id: "flagged", status: "flagged" },
    { id: "hidden", status: "hidden" },
  ]

  const visiblePosts = visibility.filterPostsForAudience(posts, "author")

  assert.deepEqual(
    visiblePosts.map((post: PostRecord) => post.id),
    ["approved", "pending", "rejected", "flagged"],
  )
})

test("public comments only expose approved records while ops can inspect hidden ones", async () => {
  const visibility = await loadVisibilityModule()
  assert.ok(visibility?.filterCommentsForAudience, "filterCommentsForAudience should be implemented")

  const comments: CommentRecord[] = [
    { id: "approved", status: "approved" },
    { id: "pending", status: "pending_review" },
    { id: "rejected", status: "rejected" },
    { id: "hidden", status: "hidden" },
  ]

  const publicComments = visibility.filterCommentsForAudience(comments, "public")
  const opsComments = visibility.filterCommentsForAudience(comments, "ops")

  assert.deepEqual(
    publicComments.map((comment: CommentRecord) => comment.id),
    ["approved"],
  )
  assert.deepEqual(
    opsComments.map((comment: CommentRecord) => comment.id),
    ["approved", "pending", "rejected", "hidden"],
  )
})
