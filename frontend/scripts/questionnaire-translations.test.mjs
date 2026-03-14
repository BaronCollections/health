import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const bankPath = path.resolve(__dirname, "../src/lib/questionnaire/question-bank.json")
const englishPath = path.resolve(__dirname, "../src/lib/questionnaire/question-bank.en.json")

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

test("questionnaire translations cover every title, description, field, and option", () => {
  assert.ok(fs.existsSync(bankPath), `Missing questionnaire bank: ${bankPath}`)
  assert.ok(fs.existsSync(englishPath), `Missing questionnaire translations: ${englishPath}`)

  const bank = loadJson(bankPath)
  const english = loadJson(englishPath)

  for (const question of bank.questions) {
    assert.ok(english.titles?.[question.id], `Missing English title for ${question.id}`)

    if (question.description) {
      assert.ok(
        english.descriptions?.[question.id],
        `Missing English description for ${question.id}`,
      )
    }

    if (question.fields) {
      for (const field of question.fields) {
        assert.ok(
          english.fields?.[question.id]?.[field.key],
          `Missing English field label for ${question.id}.${field.key}`,
        )
      }
    }

    if (question.options) {
      for (const option of question.options) {
        assert.ok(
          english.options?.[question.id]?.[option.value],
          `Missing English option label for ${question.id}.${option.value}`,
        )
      }
    }
  }
})
