import assert from "node:assert/strict"
import test from "node:test"

import type { AccountNotification } from "../account/types"

async function loadMergeModule() {
  try {
    return await import("./merge.ts")
  } catch {
    return null
  }
}

test("mergeAccountNotifications keeps localized copy while applying API status", async () => {
  const module = await loadMergeModule()
  assert.ok(module?.mergeAccountNotifications, "mergeAccountNotifications should be implemented")

  const localNotifications: AccountNotification[] = [
    {
      id: "notif-2",
      type: "community",
      status: "unread",
      title: "你的帖子审核状态已更新",
      preview: "中文预览",
      body: "中文正文",
      relativeTime: "35 分钟前",
      actionHref: "/community/me",
    },
  ]

  const apiNotifications: AccountNotification[] = [
    {
      id: "notif-2",
      type: "community",
      status: "read",
      title: "Server title",
      preview: "Server preview",
      body: "Server body",
      relativeTime: "35m ago",
      actionHref: "/community/me",
    },
  ]

  const merged = module.mergeAccountNotifications(localNotifications, apiNotifications)

  assert.equal(merged.length, 1)
  assert.equal(merged[0].id, "notif-2")
  assert.equal(merged[0].status, "read")
  assert.equal(merged[0].title, "你的帖子审核状态已更新")
  assert.equal(merged[0].preview, "中文预览")
  assert.equal(merged[0].body, "中文正文")
})
