# OCR Contract Layer Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by defining a stable OCR upload/result contract between the H5 frontend and the backend mock service.

**Architecture:** Keep the current H5 UX and route structure, but replace pure front-end OCR simulation with a contract-first integration. Add backend DTOs plus a mock OCR service that returns deterministic upload/result payloads, then add a frontend OCR client that calls the backend first and falls back only when the API is unavailable.

**Tech Stack:** Spring Boot 3, Java 17, JUnit 5, Next.js App Router, TypeScript, Axios, Node built-in test runner

---

## Chunk 1: Backend Contract Test

### Task 1: Add a failing backend test for the OCR mock contract

**Files:**
- Create: `backend/src/test/java/com/mintbit/health/service/MockOcrContractServiceTest.java`

- [x] **Step 1: Write a JUnit test that expects a mock OCR service to produce stable upload metadata and parsed result fields**
- [x] **Step 2: Run `mvn test -Dtest=MockOcrContractServiceTest` in `backend` and confirm it fails before implementation**

## Chunk 2: Backend DTOs And Mock Service

### Task 2: Implement the backend OCR contract layer

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/model/dto/ocr/OcrUploadResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/ocr/OcrResultResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/ocr/OcrParsedSection.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/ocr/OcrParsedField.java`
- Create: `backend/src/main/java/com/mintbit/health/service/MockOcrContractService.java`
- Modify: `backend/src/main/java/com/mintbit/health/controller/AssessmentController.java`

- [x] **Step 1: Add DTOs for upload acknowledgement, OCR status, sections, and field confidence**
- [x] **Step 2: Implement a mock service that returns deterministic contract-complete payloads**
- [x] **Step 3: Update the assessment controller to return the new upload/result contract instead of empty maps**
- [x] **Step 4: Re-run `mvn test -Dtest=MockOcrContractServiceTest` in `backend` and confirm it passes**

## Chunk 3: Frontend OCR Client And Integration

### Task 3: Connect the H5 OCR flow to the backend contract

**Files:**
- Create: `frontend/src/lib/ocr-api/types.ts`
- Create: `frontend/src/lib/ocr-api/client.ts`
- Modify: `frontend/src/lib/ocr/session.ts`
- Modify: `frontend/src/components/ocr-upload-page.tsx`
- Modify: `frontend/src/components/ocr-confirmation-page.tsx`

- [x] **Step 1: Add frontend OCR contract types and an API client that calls the backend upload/result endpoints**
- [x] **Step 2: Extend the OCR upload session with backend identifiers and sync state**
- [x] **Step 3: Update the upload page to attempt the backend upload before routing to confirmation**
- [x] **Step 4: Update the confirmation page to render backend OCR fields when available and fall back to existing locale content when not**

## Chunk 4: Verification, Progress, And Stop Point

### Task 4: Verify the node and record project progress

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-ocr-contract-layer-node.md`

- [x] **Step 1: Run `mvn test -Dtest=MockOcrContractServiceTest` in `backend`**
- [x] **Step 2: Run `node --test frontend/scripts/ocr-upload-translations.test.mjs`**
- [x] **Step 3: Run `npm run build` in `frontend`**
- [x] **Step 4: Record the node status and current Phase 1 completion percentage in this plan**
- [x] **Step 5: Commit and push the node**

## Node Status

- Completed node: `OCR contract layer`
- Verified with:
  - `mvn test -Dtest=MockOcrContractServiceTest`
  - `node --test frontend/scripts/ocr-upload-translations.test.mjs`
  - `node --test frontend/scripts/report-ocr-translations.test.mjs`
  - `npm run build`
- Implementation notes:
  - backend now exposes deterministic OCR upload and OCR result contracts through typed DTOs and a mock service
  - frontend OCR flow now calls the backend first, stores assessment/task metadata in session, and falls back gracefully when the API is unavailable
  - OCR confirmation view merges backend field values into the existing locale resources by `section id` and `field id`
- Progress:
  - current Phase 1 engineering node progress: `8 / 12 = 67%`
  - progress basis is tracked in `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`
- Deferred to next node:
  - check-in and saved-plan persistence integration
  - community deep bilingualization and moderation states
  - notification/help/privacy settings bilingualization
