# OCR Upload Intake Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by turning the OCR flow into a complete H5 intake path from upload entry to confirmation.

**Architecture:** Introduce a dedicated OCR upload page with bilingual structured copy, a lightweight upload session payload in local storage, and a simulated processing state that routes into the existing confirmation page. Keep the flow front-end only: no real OCR API, but preserve the state boundaries the Phase 1 design spec expects.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed locale resources, browser file input, localStorage, Node built-in test runner

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for OCR upload resources

**Files:**
- Create: `frontend/scripts/ocr-upload-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects bilingual OCR upload resource files to exist**
- [x] **Step 2: Make the test verify every upload state, helper label, and CTA has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/ocr-upload-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Upload Resources And Session Model

### Task 2: Add locale resources and a small OCR upload session helper

**Files:**
- Create: `frontend/src/lib/ocr-upload/ocr-upload.json`
- Create: `frontend/src/lib/ocr-upload/ocr-upload.en.json`
- Create: `frontend/src/lib/ocr-upload/types.ts`
- Create: `frontend/src/lib/ocr-upload/index.ts`
- Create: `frontend/src/lib/ocr/session.ts`

- [x] **Step 1: Add Chinese OCR upload copy for idle, ready, processing, and completion-adjacent states**
- [x] **Step 2: Add explicit English resources with the same structure**
- [x] **Step 3: Add typed helpers for locale resolution and upload session persistence**
- [x] **Step 4: Re-run `node --test frontend/scripts/ocr-upload-translations.test.mjs` and confirm it passes**

## Chunk 3: OCR Upload Flow Integration

### Task 3: Add the OCR upload page and connect it into the report -> confirmation path

**Files:**
- Create: `frontend/src/components/ocr-upload-page.tsx`
- Create: `frontend/src/app/ocr-upload/page.tsx`
- Modify: `frontend/src/components/morning-report.tsx`
- Modify: `frontend/src/components/ocr-confirmation-page.tsx`

- [x] **Step 1: Build a mobile-first OCR upload page with file selection, helper copy, and processing-state UI**
- [x] **Step 2: Save selected file metadata into a small upload session and simulate OCR processing before routing to `/ocr-confirmation`**
- [x] **Step 3: Update the report CTA to land on `/ocr-upload` instead of jumping straight to confirmation**
- [x] **Step 4: Teach the confirmation page to read and display the latest uploaded file metadata when present**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-ocr-upload-intake-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/ocr-upload-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [x] **Step 4: Commit and push the node**

## Node Status

- Completed node: `OCR upload intake flow`
- Verified with:
  - `node --test frontend/scripts/ocr-upload-translations.test.mjs`
  - `node --test frontend/scripts/report-ocr-translations.test.mjs`
  - `npm run build`
- Pushed branch: `codex/local-prototype-h5`
- Implementation notes:
  - OCR flow now lands on `/ocr-upload`, supports file picking, and simulates a processing state before confirmation
  - upload file metadata is persisted through `frontend/src/lib/ocr/session.ts` and surfaced inside the confirmation page
  - the report -> OCR path is now `report -> upload -> processing -> confirmation`
- Deferred to next node:
  - deeper report history/timeline bilingualization
  - questionnaire landing bilingualization if `AIHealthChat` becomes active again
  - real OCR backend integration beyond the current front-end simulation
