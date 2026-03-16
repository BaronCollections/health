# Account Center Platformization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 platform account center so notifications, help, feedback, privacy, security, export, deletion requests, and audit explanations all live under one mobile H5 system.

**Architecture:** Replace the current scattered profile/settings prototypes with a single `/profile` account-center shell, then layer in four product areas: notifications, help and feedback, privacy and trust, and request-driven data controls. Use structured bilingual resources for all long-form account content and add a typed Spring Boot mock account contract so the H5 flows can transition to WeCom and Web later without redesigning the interfaces.

**Tech Stack:** Next.js App Router, TypeScript, Node built-in test runner, structured JSON locale resources, Spring Boot 3.2, Java 17, Lombok DTOs, root README progress tracking

---

## Chunk 1: Account Center Shell

### Task 1: Define account-center resources and state helpers

**Files:**
- Create: `frontend/src/lib/account/types.ts`
- Create: `frontend/src/lib/account/index.ts`
- Create: `frontend/src/lib/account/mock-content.json`
- Create: `frontend/src/lib/account/mock-content.en.json`
- Create: `frontend/src/lib/account/state.ts`
- Create: `frontend/src/lib/account/state.test.ts`
- Create: `frontend/scripts/account-bilingual-resources.test.mjs`

- [ ] **Step 1: Write a failing Node test for notification-summary, feedback-summary, export-state, and deletion-state helpers**
- [ ] **Step 2: Write a failing resource coverage test that asserts both locale files expose the same account-center keys**
- [ ] **Step 3: Define typed account-center shapes for profile cards, notification summaries, FAQ modules, feedback records, privacy sections, export requests, deletion requests, and audit explanations**
- [ ] **Step 4: Implement the minimum state helpers and locale loaders so `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts` and `node --test frontend/scripts/account-bilingual-resources.test.mjs` pass**

### Task 2: Replace the profile shell with the platform account center entry

**Files:**
- Create: `frontend/src/components/account/account-home.tsx`
- Modify: `frontend/src/app/profile/page.tsx`
- Modify: `frontend/src/app/pricing/page.tsx`
- Modify: `frontend/src/components/shared-header.tsx`
- Delete: `frontend/src/components/morning-profile.tsx`

- [ ] **Step 1: Build the `/profile` dashboard with five sections: messages, help/support, privacy/permissions, data/audit, account/preferences**
- [ ] **Step 2: Surface unread counts, open feedback counts, export request state, and deletion request state in summary cards**
- [ ] **Step 3: Route legacy `/pricing` entry into the new account-center shell so the app has one trusted account entry**
- [ ] **Step 4: Re-run `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts`, `node --test frontend/scripts/account-bilingual-resources.test.mjs`, and `npm run build` in `frontend`**

## Chunk 2: Notifications Center

### Task 3: Add notification mock contracts and API client support

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/AccountNotificationDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/NotificationListResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/NotificationReadRequest.java`
- Create: `backend/src/main/java/com/mintbit/health/service/MockAccountService.java`
- Create: `backend/src/main/java/com/mintbit/health/controller/AccountController.java`
- Create: `backend/src/test/java/com/mintbit/health/service/MockAccountServiceTest.java`
- Create: `frontend/src/lib/account-api/types.ts`
- Create: `frontend/src/lib/account-api/client.ts`

- [ ] **Step 1: Write a failing backend test that covers notification list filtering, detail lookup, single read, and batch read**
- [ ] **Step 2: Add DTO skeletons and a controller/service boundary for account notifications**
- [ ] **Step 3: Run `mvn test -Dtest=MockAccountServiceTest` in `backend` and confirm the account test fails before implementation**
- [ ] **Step 4: Implement the minimal notification mock contract and frontend client methods required for list/detail/read flows**

### Task 4: Build the notification list and detail routes

**Files:**
- Create: `frontend/src/components/account/notifications-page.tsx`
- Create: `frontend/src/components/account/notification-detail-page.tsx`
- Create: `frontend/src/app/profile/notifications/page.tsx`
- Create: `frontend/src/app/profile/notifications/[id]/page.tsx`
- Modify: `frontend/src/lib/account/index.ts`
- Modify: `frontend/src/lib/account/mock-content.json`
- Modify: `frontend/src/lib/account/mock-content.en.json`

- [ ] **Step 1: Build the notification list with filters for all, system, community, and check-in**
- [ ] **Step 2: Add unread/read state, batch mark-as-read, and notification summary badges**
- [ ] **Step 3: Build notification detail with title, source, time, body, and related action CTA**
- [ ] **Step 4: Wire the list and detail pages to the account API client with a local mock fallback**
- [ ] **Step 5: Re-run `mvn test -Dtest=MockAccountServiceTest`, `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts`, `node --test frontend/scripts/account-bilingual-resources.test.mjs`, and `npm run build`**

## Chunk 3: Help And Feedback Center

### Task 5: Extend the account contract for FAQ and feedback

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/AccountFaqCategoryDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/FeedbackRecordDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/FeedbackRecordsResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/CreateFeedbackRequest.java`
- Modify: `backend/src/main/java/com/mintbit/health/service/MockAccountService.java`
- Modify: `backend/src/main/java/com/mintbit/health/controller/AccountController.java`
- Modify: `backend/src/test/java/com/mintbit/health/service/MockAccountServiceTest.java`
- Modify: `frontend/src/lib/account-api/types.ts`
- Modify: `frontend/src/lib/account-api/client.ts`

- [ ] **Step 1: Add failing backend expectations for FAQ retrieval, feedback submission, and feedback-record status flows**
- [ ] **Step 2: Extend the account contract types and mock service to satisfy those new behaviors**
- [ ] **Step 3: Re-run `mvn test -Dtest=MockAccountServiceTest` and confirm the extended account test passes**

### Task 6: Build help center, feedback submission, and record tracking

**Files:**
- Create: `frontend/src/components/account/help-center-page.tsx`
- Create: `frontend/src/components/account/feedback-form-page.tsx`
- Create: `frontend/src/components/account/feedback-records-page.tsx`
- Create: `frontend/src/app/profile/help/page.tsx`
- Create: `frontend/src/app/profile/help/feedback/page.tsx`
- Create: `frontend/src/app/profile/help/records/page.tsx`
- Modify: `frontend/src/lib/account/mock-content.json`
- Modify: `frontend/src/lib/account/mock-content.en.json`

- [ ] **Step 1: Build the help center with FAQ grouping, support-contact entry, and feedback quick actions**
- [ ] **Step 2: Build the feedback form with issue category, description, optional screenshot placeholder, and contact fields**
- [ ] **Step 3: Build the feedback records page grouped by state with status pills and visible reply sections**
- [ ] **Step 4: Wire help and feedback pages to the account API client while preserving bilingual long-form content from local resources**
- [ ] **Step 5: Re-run `mvn test -Dtest=MockAccountServiceTest`, `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts`, `node --test frontend/scripts/account-bilingual-resources.test.mjs`, and `npm run build`**

## Chunk 4: Privacy, Security, Data Controls, And Finalization

### Task 7: Extend the account contract for privacy requests and account controls

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/ExportRequestDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/DeleteRequestDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/CreateExportRequest.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/account/CreateDeleteRequest.java`
- Modify: `backend/src/main/java/com/mintbit/health/service/MockAccountService.java`
- Modify: `backend/src/main/java/com/mintbit/health/controller/AccountController.java`
- Modify: `backend/src/test/java/com/mintbit/health/service/MockAccountServiceTest.java`
- Modify: `frontend/src/lib/account-api/types.ts`
- Modify: `frontend/src/lib/account-api/client.ts`
- Modify: `frontend/src/lib/account/state.ts`
- Modify: `frontend/src/lib/account/state.test.ts`

- [ ] **Step 1: Add failing tests for export-request states, deletion-request states, and account-preference summary logic**
- [ ] **Step 2: Extend the mock contract with export-request and deletion-request flows plus account security/status metadata**
- [ ] **Step 3: Re-run `mvn test -Dtest=MockAccountServiceTest` and `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts`**

### Task 8: Build privacy, security, export, deletion, audit pages, and update project progress

**Files:**
- Create: `frontend/src/components/account/privacy-center-page.tsx`
- Create: `frontend/src/components/account/export-request-page.tsx`
- Create: `frontend/src/components/account/delete-request-page.tsx`
- Create: `frontend/src/components/account/security-page.tsx`
- Create: `frontend/src/components/account/audit-log-page.tsx`
- Create: `frontend/src/app/profile/privacy/page.tsx`
- Create: `frontend/src/app/profile/privacy/export/page.tsx`
- Create: `frontend/src/app/profile/privacy/delete-request/page.tsx`
- Create: `frontend/src/app/profile/security/page.tsx`
- Create: `frontend/src/app/profile/audit-log/page.tsx`
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-account-center-platformization-node.md`
- Modify: `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`
- Modify: `frontend/src/lib/account/mock-content.json`
- Modify: `frontend/src/lib/account/mock-content.en.json`

- [ ] **Step 1: Build the privacy center home with links for privacy policy, user agreement, OCR usage, community visibility, and notification permissions**
- [ ] **Step 2: Build export-request and deletion-request pages with full user-visible lifecycle states and explicit confirmation copy**
- [ ] **Step 3: Build security and audit-log pages that explain binding status, notification preferences, OCR authorization, and platform logging transparency**
- [ ] **Step 4: Wire these pages to the account API client and keep long-form documents in structured bilingual resources**
- [ ] **Step 5: Run `node --experimental-strip-types --test frontend/src/lib/account/state.test.ts`**
- [ ] **Step 6: Run `node --test frontend/scripts/account-bilingual-resources.test.mjs`**
- [ ] **Step 7: Run `mvn test -Dtest=MockAccountServiceTest` in `backend`**
- [ ] **Step 8: Run `npm run build` in `frontend`**
- [ ] **Step 9: Update `README.md` so the project homepage reflects the platform account center and current Phase 1 progress**
- [ ] **Step 10: Mark this node complete and update `docs/superpowers/plans/2026-03-16-phase1-node-progress.md` from `10 / 12 = 83%` to `11 / 12 = 92%`**
- [ ] **Step 11: Commit and push the completed node on the account-center branch**

## Node Status

- Current node: `account center platformization`
- Current completion state: `planning approved, implementation not started`
- Progress policy:
  - keep overall Phase 1 node progress at `10 / 12 = 83%` until all four internal delivery chunks are complete
  - only move to `11 / 12 = 92%` after account shell, notifications, help/feedback, and privacy/data-control flows are all verified
- Deferred to later node:
  - release hardening and WeCom/Web readiness prep
