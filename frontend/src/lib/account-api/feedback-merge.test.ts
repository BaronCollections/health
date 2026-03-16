import assert from "node:assert/strict"
import test from "node:test"

import type { FeedbackRecord } from "../account/types"

async function loadMergeModule() {
  try {
    return await import("./merge.ts")
  } catch {
    return null
  }
}

test("mergeFeedbackRecords keeps localized text while applying API status", async () => {
  const module = await loadMergeModule()
  assert.ok(module?.mergeFeedbackRecords, "mergeFeedbackRecords should be implemented")

  const localRecords: FeedbackRecord[] = [
    {
      id: "fb-1",
      category: "OCR 识别",
      subject: "报告页字段顺序建议",
      status: "in_review",
      submittedAt: "2026-03-15 18:20",
      reply: "团队已收到，正在评估。",
    },
  ]

  const apiRecords: FeedbackRecord[] = [
    {
      id: "fb-1",
      category: "OCR recognition",
      subject: "Server subject",
      status: "responded",
      submittedAt: "2026-03-15 18:20",
      reply: "Server reply",
    },
  ]

  const merged = module.mergeFeedbackRecords(localRecords, apiRecords)

  assert.equal(merged.length, 1)
  assert.equal(merged[0].status, "responded")
  assert.equal(merged[0].category, "OCR 识别")
  assert.equal(merged[0].subject, "报告页字段顺序建议")
  assert.equal(merged[0].reply, "团队已收到，正在评估。")
})
