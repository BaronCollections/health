import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const loadJson = async (path) => JSON.parse(await readFile(path, "utf8"))

const assertSameShape = (source, target, path = "root") => {
  if (Array.isArray(source)) {
    assert.ok(Array.isArray(target), `${path} should be an array in English resources`)
    assert.equal(target.length, source.length, `${path} should keep the same item count`)
    source.forEach((item, index) => assertSameShape(item, target[index], `${path}[${index}]`))
    return
  }

  if (source && typeof source === "object") {
    assert.ok(target && typeof target === "object" && !Array.isArray(target), `${path} should be an object in English resources`)
    Object.keys(source).forEach((key) => {
      assert.ok(key in target, `${path}.${key} is missing from English resources`)
      assertSameShape(source[key], target[key], `${path}.${key}`)
    })
    return
  }

  if (typeof source === "string") {
    assert.equal(typeof target, "string", `${path} should be a string in English resources`)
    assert.notEqual(target.trim(), "", `${path} should not be empty in English resources`)
  }
}

test("AIHealthChat locale resources keep full English coverage", async () => {
  const zh = await loadJson(new URL("../src/lib/chat-questionnaire/chat-questionnaire.json", import.meta.url))
  const en = await loadJson(new URL("../src/lib/chat-questionnaire/chat-questionnaire.en.json", import.meta.url))

  assertSameShape(zh, en, "aiHealthChat")
})
