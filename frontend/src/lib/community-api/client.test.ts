import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

type ApiComment = {
  id: string
  authorName: string
  authorAvatar: string
  authorRole: string
  viewerOwned: boolean
  status: string
  relativeTime: string
  content: string
  likes: number
  moderationReason?: string
}

type ApiPost = {
  id: string
  authorName: string
  authorAvatar: string
  authorRole: string
  viewerOwned: boolean
  circleId: string
  circleName: string
  status: string
  relativeTime: string
  content: string
  tags: string[]
  images: string[]
  likes: number
  saves: number
  comments: ApiComment[]
  moderationReason?: string
}

async function loadClientModule() {
  try {
    return await import("./merge.ts")
  } catch {
    return null
  }
}

async function loadEnglishSeedPosts() {
  const source = await readFile(new URL("../community/mock-content.en.json", import.meta.url), "utf8")
  return JSON.parse(source).seedPosts as ApiPost[]
}

test("mergeCommunityPosts keeps localized seeded copy while applying API moderation state", async () => {
  const client = await loadClientModule()
  assert.ok(client?.mergeCommunityPosts, "mergeCommunityPosts should be implemented")

  const localPosts = await loadEnglishSeedPosts()
  const apiPosts: ApiPost[] = [
    {
      id: "post-102",
      authorName: "Xiaoya",
      authorAvatar: "X",
      authorRole: "Particle assistant user",
      viewerOwned: true,
      circleId: "stress-reset",
      circleName: "Stress reset",
      status: "approved",
      relativeTime: "Just now",
      content: "服务器返回的原始内容",
      tags: ["Magnesium"],
      images: [],
      likes: 9,
      saves: 4,
      comments: [
        {
          id: "comment-102-1",
          authorName: "Server reviewer",
          authorAvatar: "R",
          authorRole: "Moderator",
          viewerOwned: false,
          status: "approved",
          relativeTime: "1m ago",
          content: "服务端评论内容",
          likes: 2,
        },
      ],
    },
  ]

  const mergedPosts = client.mergeCommunityPosts(localPosts, apiPosts)
  const mergedPost = mergedPosts.find((post: ApiPost) => post.id === "post-102")
  const localizedSeed = localPosts.find((post) => post.id === "post-102")

  assert.ok(mergedPost, "merged post should exist")
  assert.ok(localizedSeed, "localized seed post should exist")
  assert.equal(mergedPost.status, "approved")
  assert.equal(mergedPost.likes, 9)
  assert.equal(mergedPost.saves, 4)
  assert.equal(mergedPost.content, localizedSeed.content)
  assert.equal(mergedPost.comments[0].content, localizedSeed.comments[0].content)
  assert.equal(mergedPost.comments[0].status, "approved")
})
