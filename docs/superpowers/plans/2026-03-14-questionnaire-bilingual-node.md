# Questionnaire Bilingual Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by turning the questionnaire flow into a structured bilingual experience.

**Architecture:** Move the questionnaire bank out of the page component into reusable structured data, keep Chinese as the authoritative base bank, and layer formal English translations on top with explicit coverage checks. Update the questionnaire flow to resolve question titles, descriptions, options, and field labels from the active locale without changing the current scoring and conditional-display logic.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed questionnaire resources, React state, existing locale provider

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for questionnaire translations

**Files:**
- Create: `frontend/scripts/questionnaire-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects structured questionnaire resources to exist**
- [x] **Step 2: Make the test verify every question title, description, field label, and option label has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/questionnaire-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Questionnaire Resources

### Task 2: Extract the questionnaire bank and add formal English variants

**Files:**
- Create: `frontend/src/lib/questionnaire/question-bank.json`
- Create: `frontend/src/lib/questionnaire/question-bank.en.json`
- Create: `frontend/src/lib/questionnaire/types.ts`
- Create: `frontend/src/lib/questionnaire/index.ts`

- [x] **Step 1: Move the current Chinese questionnaire bank into a standalone JSON resource**
- [x] **Step 2: Add a formal English translation resource keyed by question id, field key, and option value**
- [x] **Step 3: Add typed helpers to resolve localized questionnaire copy**
- [x] **Step 4: Re-run `node --test frontend/scripts/questionnaire-translations.test.mjs` and confirm it passes**

## Chunk 3: Questionnaire Flow Integration

### Task 3: Wire the structured bilingual bank into the questionnaire UI

**Files:**
- Modify: `frontend/src/components/questionnaire-flow.tsx`
- Modify: `frontend/src/i18n/messages.ts`

- [x] **Step 1: Replace the in-component questionnaire bank with imports from the new resource layer**
- [x] **Step 2: Resolve question titles, descriptions, options, field labels, and CTA copy from the active locale**
- [x] **Step 3: Add questionnaire-specific system copy to the app message dictionaries**
- [x] **Step 4: Keep scoring, filtering, and cache behavior unchanged**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-14-questionnaire-bilingual-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/questionnaire-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [ ] **Step 4: Commit and push the node**

## Node Status

- Completed node: `structured bilingual questionnaire`
- Verified with:
  - `node --test frontend/scripts/questionnaire-translations.test.mjs`
  - `npm run build`
- Deferred to next node:
  - questionnaire entry/landing screen bilingualization if `AIHealthChat` becomes active again
  - report deep-section long-form localization
  - OCR confirmation bilingual resources
