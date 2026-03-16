# AI Health Chat Bilingual Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by turning the `/chat` questionnaire prototype into a complete bilingual experience.

**Architecture:** Move the `AIHealthChat` landing, question content, and submit-state copy into structured locale resources with Chinese as the source of truth and explicit English parity. Keep the existing three-page flow `home -> fill -> submit`, preserve current local answer storage behavior, and avoid changing the report redirect or question progression logic.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed locale resources, existing locale provider, browser localStorage, Node built-in test runner

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for AIHealthChat resources

**Files:**
- Create: `frontend/scripts/ai-health-chat-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects bilingual AIHealthChat resource files to exist**
- [x] **Step 2: Make the test verify every home, question, option, input field, submit-state, and action label has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/ai-health-chat-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Chat Questionnaire Resources

### Task 2: Add locale-aware AIHealthChat content

**Files:**
- Create: `frontend/src/lib/chat-questionnaire/chat-questionnaire.json`
- Create: `frontend/src/lib/chat-questionnaire/chat-questionnaire.en.json`
- Create: `frontend/src/lib/chat-questionnaire/types.ts`
- Create: `frontend/src/lib/chat-questionnaire/index.ts`

- [x] **Step 1: Add Chinese resources for landing copy, submit copy, question content, options, and input labels**
- [x] **Step 2: Add explicit English resources with the same structure**
- [x] **Step 3: Add typed helpers that return the active locale content for `/chat`**
- [x] **Step 4: Re-run `node --test frontend/scripts/ai-health-chat-translations.test.mjs` and confirm it passes**

## Chunk 3: AIHealthChat Integration

### Task 3: Wire the locale resources into the `/chat` flow

**Files:**
- Modify: `frontend/src/components/ai-health-chat.tsx`

- [x] **Step 1: Replace hardcoded home-page copy with locale-aware resource content**
- [x] **Step 2: Replace in-component question text, options, input labels, and placeholders with the resource layer**
- [x] **Step 3: Replace submit-state and navigation button copy with the resource layer while preserving answer storage and redirect behavior**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-ai-health-chat-bilingual-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/ai-health-chat-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [ ] **Step 4: Commit and push the node**

## Node Status

- Completed node: `AIHealthChat bilingualization`
- Verified with:
  - `node --test frontend/scripts/ai-health-chat-translations.test.mjs`
  - `npm run build`
- Implementation notes:
  - `/chat` now resolves landing, question content, and submit-state copy from dedicated locale resources under `frontend/src/lib/chat-questionnaire/`
  - the three-page flow `home -> fill -> submit` is unchanged
  - answer persistence and redirect behavior remain aligned with the existing prototype
- Deferred to next node:
  - real OCR backend integration beyond the current front-end simulation
  - community/history cross-linking and poster detail comparison depth
  - any future consolidation between `/chat` and the main `/questionnaire` resource layers
