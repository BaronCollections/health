# MintBit Mini Program Assessment OCR Report Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the MintBit mini program assessment, OCR, report, and timeline loop so the native app can run `home -> questionnaire -> OCR upload -> OCR confirmation -> report -> timeline`.

**Architecture:** Reuse the existing backend assessment and OCR contracts, add a native mini program assessment API layer, then build the route flow in small verified slices. Keep question-bank and report content bilingual, storage-backed, and test-driven so the native pages stay deterministic.

**Tech Stack:** Native WeChat Mini Program, WXML/WXSS, Node built-in test runner, existing Spring Boot assessment/OCR controllers, multipart upload, bilingual content resources

---

## File Structure

### New / modified mini program files

- Create: `miniprogram/services/assessment/api.js`
- Create: `miniprogram/services/assessment/api.test.mjs`
- Create: `miniprogram/services/assessment/session.js`
- Create: `miniprogram/services/assessment/session.test.mjs`
- Create: `miniprogram/services/assessment/question-bank.js`
- Create: `miniprogram/services/report/content.js`
- Create: `miniprogram/services/report/timeline.js`
- Modify: `miniprogram/i18n/runtime.js`
- Modify: `miniprogram/config/routes.js`
- Modify: `miniprogram/pages/home/index/index.js`
- Modify: `miniprogram/pages/home/index/index.wxml`
- Create: `miniprogram/pages/assessment/questionnaire/index.js`
- Create: `miniprogram/pages/assessment/questionnaire/index.json`
- Create: `miniprogram/pages/assessment/questionnaire/index.wxml`
- Create: `miniprogram/pages/assessment/questionnaire/index.wxss`
- Create: `miniprogram/pages/assessment/result-loading/index.js`
- Create: `miniprogram/pages/assessment/result-loading/index.json`
- Create: `miniprogram/pages/assessment/result-loading/index.wxml`
- Create: `miniprogram/pages/assessment/result-loading/index.wxss`
- Create: `miniprogram/pages/report/detail/index.js`
- Create: `miniprogram/pages/report/detail/index.json`
- Create: `miniprogram/pages/report/detail/index.wxml`
- Create: `miniprogram/pages/report/detail/index.wxss`
- Create: `miniprogram/pages/report/ocr-upload/index.js`
- Create: `miniprogram/pages/report/ocr-upload/index.json`
- Create: `miniprogram/pages/report/ocr-upload/index.wxml`
- Create: `miniprogram/pages/report/ocr-upload/index.wxss`
- Create: `miniprogram/pages/report/ocr-confirmation/index.js`
- Create: `miniprogram/pages/report/ocr-confirmation/index.json`
- Create: `miniprogram/pages/report/ocr-confirmation/index.wxml`
- Create: `miniprogram/pages/report/ocr-confirmation/index.wxss`
- Create: `miniprogram/pages/report/timeline/index.js`
- Create: `miniprogram/pages/report/timeline/index.json`
- Create: `miniprogram/pages/report/timeline/index.wxml`
- Create: `miniprogram/pages/report/timeline/index.wxss`

### Docs to update after execution

- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-mintbit-miniprogram-foundation-status.md`
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-assessment-ocr-report-status.md`

## Chunk 1: Assessment Contracts And Session Runtime

### Task 1: Add failing tests for assessment API and session helpers

**Files:**
- Create: `miniprogram/services/assessment/api.test.mjs`
- Create: `miniprogram/services/assessment/session.test.mjs`

- [x] **Step 1: Write failing tests for create/resume/submit answer/OCR fetch contracts**
- [x] **Step 2: Write failing tests for assessment session persistence and resume metadata**
- [x] **Step 3: Run `node --test miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs` and confirm failure**
- [x] **Step 4: Commit the failing assessment runtime tests**

### Task 2: Implement assessment API adapters and session store

**Files:**
- Create: `miniprogram/services/assessment/api.js`
- Create: `miniprogram/services/assessment/session.js`

- [x] **Step 1: Implement the minimal mini program assessment API client around the existing backend endpoints**
- [x] **Step 2: Implement storage-backed assessment session helpers for current assessment id, current question index, and OCR upload metadata**
- [x] **Step 3: Re-run `node --test miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs` and confirm pass**
- [x] **Step 4: Commit the assessment runtime layer**

## Chunk 2: Questionnaire Flow

### Task 3: Bring over a bilingual question bank and build the native questionnaire page

**Files:**
- Create: `miniprogram/services/assessment/question-bank.js`
- Modify: `miniprogram/i18n/runtime.js`
- Modify: `miniprogram/config/routes.js`
- Modify: `miniprogram/pages/home/index/index.js`
- Modify: `miniprogram/pages/home/index/index.wxml`
- Create: `miniprogram/pages/assessment/questionnaire/index.js`
- Create: `miniprogram/pages/assessment/questionnaire/index.json`
- Create: `miniprogram/pages/assessment/questionnaire/index.wxml`
- Create: `miniprogram/pages/assessment/questionnaire/index.wxss`
- Create: `miniprogram/pages/assessment/result-loading/index.js`
- Create: `miniprogram/pages/assessment/result-loading/index.json`
- Create: `miniprogram/pages/assessment/result-loading/index.wxml`
- Create: `miniprogram/pages/assessment/result-loading/index.wxss`

- [x] **Step 1: Reuse the H5 bilingual questionnaire structure in a mini program-friendly question bank module**
- [x] **Step 2: Build the questionnaire page with progressive answering, storage-backed resume, and submit-to-report transition**
- [x] **Step 3: Build the result-loading transition page**
- [x] **Step 4: Run syntax checks and targeted node tests, then commit the questionnaire flow**

## Chunk 3: OCR Upload And Confirmation

### Task 4: Build native OCR upload and confirmation pages against existing OCR contracts

**Files:**
- Create: `miniprogram/pages/report/ocr-upload/index.js`
- Create: `miniprogram/pages/report/ocr-upload/index.json`
- Create: `miniprogram/pages/report/ocr-upload/index.wxml`
- Create: `miniprogram/pages/report/ocr-upload/index.wxss`
- Create: `miniprogram/pages/report/ocr-confirmation/index.js`
- Create: `miniprogram/pages/report/ocr-confirmation/index.json`
- Create: `miniprogram/pages/report/ocr-confirmation/index.wxml`
- Create: `miniprogram/pages/report/ocr-confirmation/index.wxss`

- [x] **Step 1: Add file-selection support for image and PDF uploads using mini program upload capabilities**
- [x] **Step 2: Build the OCR confirmation review page from the existing backend OCR result contract**
- [x] **Step 3: Verify the OCR routes against the assessment session runtime and commit the OCR flow**

## Chunk 4: Report Detail And Timeline

### Task 5: Build the report detail and poster timeline pages

**Files:**
- Create: `miniprogram/services/report/content.js`
- Create: `miniprogram/services/report/timeline.js`
- Create: `miniprogram/pages/report/detail/index.js`
- Create: `miniprogram/pages/report/detail/index.json`
- Create: `miniprogram/pages/report/detail/index.wxml`
- Create: `miniprogram/pages/report/detail/index.wxss`
- Create: `miniprogram/pages/report/timeline/index.js`
- Create: `miniprogram/pages/report/timeline/index.json`
- Create: `miniprogram/pages/report/timeline/index.wxml`
- Create: `miniprogram/pages/report/timeline/index.wxss`

- [ ] **Step 1: Port the bilingual report content into a mini program runtime module**
- [ ] **Step 2: Build the native report detail page and link it from the report tab**
- [ ] **Step 3: Build the poster history timeline page and link it from the report page**
- [ ] **Step 4: Run route syntax checks, node tests, and commit the report/timeline slice**

## Chunk 5: Status Docs

### Task 6: Update project-facing status docs

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-mintbit-miniprogram-foundation-status.md`
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-assessment-ocr-report-status.md`

- [ ] **Step 1: Record completed assessment/OCR/report files and verification commands**
- [ ] **Step 2: Update the root README mini program progress summary**
- [ ] **Step 3: Commit the status docs**
