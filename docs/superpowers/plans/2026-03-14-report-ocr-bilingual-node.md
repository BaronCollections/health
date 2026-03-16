# Report And OCR Bilingual Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by localizing the deep report experience and introducing a bilingual OCR confirmation page.

**Architecture:** Move the long-form report copy and OCR confirmation content into structured locale resources with Chinese as the source of truth and explicit English parity. Keep the current report layout and scoring visuals, wire the report page to locale-aware resources, and add a lightweight OCR confirmation route that connects from the report as an optional enhancement step.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed locale resources, existing locale provider, Node built-in test runner

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for report and OCR resources

**Files:**
- Create: `frontend/scripts/report-ocr-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects bilingual report and OCR resource files to exist**
- [x] **Step 2: Make the test verify every report section, goal, recommendation card, and OCR field has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/report-ocr-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Content Resources

### Task 2: Extract report and OCR copy into locale-aware resource layers

**Files:**
- Create: `frontend/src/lib/report/report-content.json`
- Create: `frontend/src/lib/report/report-content.en.json`
- Create: `frontend/src/lib/report/types.ts`
- Create: `frontend/src/lib/report/index.ts`
- Create: `frontend/src/lib/ocr/ocr-confirmation.json`
- Create: `frontend/src/lib/ocr/ocr-confirmation.en.json`
- Create: `frontend/src/lib/ocr/types.ts`
- Create: `frontend/src/lib/ocr/index.ts`

- [x] **Step 1: Move the current report long-form copy and nutrition card content into structured Chinese resources with stable IDs**
- [x] **Step 2: Add explicit English resources for the same report structure and OCR confirmation structure**
- [x] **Step 3: Add typed helpers that resolve report and OCR content from the active locale**
- [x] **Step 4: Re-run `node --test frontend/scripts/report-ocr-translations.test.mjs` and confirm it passes**

## Chunk 3: UI Integration

### Task 3: Wire the localized report and add the OCR confirmation route

**Files:**
- Modify: `frontend/src/components/morning-report.tsx`
- Create: `frontend/src/components/ocr-confirmation-page.tsx`
- Create: `frontend/src/app/ocr-confirmation/page.tsx`
- Note: `frontend/src/i18n/messages.ts` intentionally unchanged because this node moved all report and OCR page copy into dedicated locale resources instead of the global message dictionary

- [x] **Step 1: Replace hardcoded report section titles, narrative text, goals, and nutrition cards with the new resource layer**
- [x] **Step 2: Keep the current report interaction model intact while switching stable goal IDs away from localized labels**
- [x] **Step 3: Add a bilingual OCR confirmation page with parsed fields, confidence display, audit notes, and confirm/defer actions**
- [x] **Step 4: Connect the report page to the OCR confirmation route through an optional enhancement CTA**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-14-report-ocr-bilingual-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/report-ocr-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [x] **Step 4: Commit and push the node**

## Node Status

- Completed node: `report deep localization and OCR confirmation`
- Verified with:
  - `node --test frontend/scripts/report-ocr-translations.test.mjs`
  - `npm install` in `frontend` to restore missing worktree dependencies
  - `npm run build`
- Pushed branch: `codex/local-prototype-h5`
- Implementation notes:
  - report long-form copy now lives under `frontend/src/lib/report/` with stable goal IDs for locale-safe selection
  - OCR confirmation content now lives under `frontend/src/lib/ocr/` and is exposed through `/ocr-confirmation`
  - report CTA now routes to OCR as an optional enhancement while the primary CTA scrolls into the nutrition plan section
- Deferred to next node:
  - questionnaire landing bilingualization if `AIHealthChat` becomes active again
  - deeper report history/timeline bilingualization
  - OCR upload entry and file intake flow before confirmation
