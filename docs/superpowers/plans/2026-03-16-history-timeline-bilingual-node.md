# History Timeline Bilingual Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by turning historical poster/timeline into a bilingual mobile H5 experience with a report-page entry.

**Architecture:** Introduce a dedicated timeline route backed by structured bilingual resources that model historical report snapshots, trend highlights, and re-assessment prompts. Keep the logic front-end only, add a lightweight entry from the active report page, and avoid inventing comparison logic that is not yet supported by the current prototype.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed locale resources, existing locale provider, Node built-in test runner

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for history timeline resources

**Files:**
- Create: `frontend/scripts/history-timeline-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects bilingual history timeline resource files to exist**
- [x] **Step 2: Make the test verify every timeline section, historical snapshot, and CTA has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/history-timeline-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Timeline Resources

### Task 2: Add locale-aware history timeline content

**Files:**
- Create: `frontend/src/lib/timeline/timeline-content.json`
- Create: `frontend/src/lib/timeline/timeline-content.en.json`
- Create: `frontend/src/lib/timeline/types.ts`
- Create: `frontend/src/lib/timeline/index.ts`
- Modify: `frontend/src/lib/report/report-content.json`
- Modify: `frontend/src/lib/report/report-content.en.json`

- [x] **Step 1: Add Chinese timeline content for overview, trend summary, and historical poster snapshots**
- [x] **Step 2: Add explicit English resources with the same structure**
- [x] **Step 3: Add a small timeline entry label into the report resource layer**
- [x] **Step 4: Re-run `node --test frontend/scripts/history-timeline-translations.test.mjs` and confirm it passes**

## Chunk 3: Timeline UI Integration

### Task 3: Build the timeline page and connect it from the report

**Files:**
- Create: `frontend/src/components/history-timeline-page.tsx`
- Create: `frontend/src/app/timeline/page.tsx`
- Modify: `frontend/src/components/morning-report.tsx`

- [x] **Step 1: Build a mobile-first bilingual timeline page that shows historical poster cards, score trend cues, and milestone copy**
- [x] **Step 2: Add a lightweight history entry CTA to the current report page**
- [x] **Step 3: Keep the re-assessment CTA connected to the existing questionnaire route**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-history-timeline-bilingual-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/history-timeline-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [x] **Step 4: Commit and push the node**

## Node Status

- Completed node: `history timeline bilingualization`
- Verified with:
  - `node --test frontend/scripts/history-timeline-translations.test.mjs`
  - `node --test frontend/scripts/ocr-upload-translations.test.mjs`
  - `npm run build`
- Pushed branch: `codex/local-prototype-h5`
- Implementation notes:
  - added a dedicated `/timeline` page backed by structured bilingual resources under `frontend/src/lib/timeline/`
  - current report page now exposes a timeline entry card through the report resource layer
  - time-travel UX stays front-end only and routes back into the existing questionnaire for re-assessment
- Deferred to next node:
  - questionnaire landing bilingualization if `AIHealthChat` becomes active again
  - real OCR backend integration beyond the current front-end simulation
  - community/history cross-linking and poster detail comparison depth
