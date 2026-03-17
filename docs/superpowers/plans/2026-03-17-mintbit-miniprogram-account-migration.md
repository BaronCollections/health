# MintBit Mini Program Account Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Phase 1 account center core flows into the native WeChat mini program, including notifications, help and feedback, privacy and data controls, and security snapshots.

**Architecture:** Add a dedicated `miniprogram/services/account` runtime that mirrors the H5 account content and backend mock contracts, then replace the current `profile` card shell with native detail pages driven by small view-model builders. Keep local fallback behavior and request adapters aligned with the existing mini program assessment, report, check-in, and community services.

**Tech Stack:** Native WeChat Mini Program pages, plain JavaScript runtime modules, Node built-in test runner, Spring Boot mock account endpoints reused as-is.

---

## File Map

- Create: `miniprogram/services/account/content.js`
  Purpose: Localized account seed data and labels for the mini program runtime.
- Create: `miniprogram/services/account/api.js`
  Purpose: Request wrapper for `/api/account/*`.
- Create: `miniprogram/services/account/state.js`
  Purpose: Local account fallback state for read markers, feedback submissions, export requests, and delete requests.
- Create: `miniprogram/services/account/index.js`
  Purpose: View-model builders and merge helpers for profile home, notifications, help, privacy, security, and audit pages.
- Create: `miniprogram/services/account/*.test.mjs`
  Purpose: TDD coverage for API routes, state persistence, localization merge behavior, and page-facing view models.
- Modify: `miniprogram/config/routes.js`
  Purpose: Add route constants for profile deep pages.
- Modify: `miniprogram/app.json`
  Purpose: Register the new profile-related pages.
- Modify: `miniprogram/pages/profile/index/*`
  Purpose: Replace the shell-like profile home with a native account dashboard tied to the new runtime.
- Create: `miniprogram/pages/profile/notifications/*`
  Purpose: Notification center with filters and batch read.
- Create: `miniprogram/pages/profile/notifications/detail/*`
  Purpose: Notification detail page.
- Create: `miniprogram/pages/profile/help/*`
  Purpose: Help center with FAQ and entry points.
- Create: `miniprogram/pages/profile/help/feedback/*`
  Purpose: Feedback submission form.
- Create: `miniprogram/pages/profile/help/records/*`
  Purpose: Feedback record list grouped by status.
- Create: `miniprogram/pages/profile/privacy/*`
  Purpose: Privacy center and data control summary.
- Create: `miniprogram/pages/profile/privacy/export/*`
  Purpose: Export request list and submission form.
- Create: `miniprogram/pages/profile/privacy/delete-request/*`
  Purpose: Delete request list and submission form.
- Create: `miniprogram/pages/profile/security/*`
  Purpose: Account binding, OCR authorization, and notification preference snapshot.
- Create: `miniprogram/pages/profile/audit-log/*`
  Purpose: User-visible transparency and operation trail page.
- Modify: `README.md`
  Purpose: Update mini program migration progress and public-facing snapshot.
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-account-status.md`
  Purpose: Persist node status, verification evidence, and next-step handoff.

## Chunk 1: Account Runtime

### Task 1: Add failing tests for account runtime

**Files:**
- Create: `miniprogram/services/account/api.test.mjs`
- Create: `miniprogram/services/account/state.test.mjs`
- Create: `miniprogram/services/account/index.test.mjs`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run the account tests to verify they fail because account modules do not exist**
  Run: `node --test miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs`
- [ ] **Step 3: Implement the minimal account runtime**
  Create the account runtime files listed above.
- [ ] **Step 4: Run the account tests to verify they pass**
  Run: `node --test miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs`
- [ ] **Step 5: Commit**
  `git add miniprogram/services/account && git commit -m "feat: add miniprogram account runtime"`

## Chunk 2: Native Profile Pages

### Task 2: Replace profile home and add notifications flow

**Files:**
- Modify: `miniprogram/pages/profile/index/*`
- Create: `miniprogram/pages/profile/notifications/*`
- Create: `miniprogram/pages/profile/notifications/detail/*`
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/config/routes.js`

- [ ] **Step 1: Add or extend failing runtime tests for notification view models**
- [ ] **Step 2: Run the targeted account test command and confirm the expected failure**
- [ ] **Step 3: Implement the minimal profile dashboard and notifications pages**
- [ ] **Step 4: Re-run the targeted account tests and syntax checks**
- [ ] **Step 5: Commit**
  `git add miniprogram/pages/profile miniprogram/app.json miniprogram/config/routes.js && git commit -m "feat: add miniprogram account notifications"`

### Task 3: Add help, feedback, privacy, export, delete, security, and audit pages

**Files:**
- Create: `miniprogram/pages/profile/help/*`
- Create: `miniprogram/pages/profile/help/feedback/*`
- Create: `miniprogram/pages/profile/help/records/*`
- Create: `miniprogram/pages/profile/privacy/*`
- Create: `miniprogram/pages/profile/privacy/export/*`
- Create: `miniprogram/pages/profile/privacy/delete-request/*`
- Create: `miniprogram/pages/profile/security/*`
- Create: `miniprogram/pages/profile/audit-log/*`

- [ ] **Step 1: Add or extend failing runtime tests for help/privacy/security flows**
- [ ] **Step 2: Run the targeted account test command and confirm the expected failure**
- [ ] **Step 3: Implement the minimal native pages and hook them to the account runtime**
- [ ] **Step 4: Re-run the targeted account tests and syntax checks**
- [ ] **Step 5: Commit**
  `git add miniprogram/pages/profile miniprogram/services/account && git commit -m "feat: add miniprogram account center pages"`

## Chunk 3: Verification and Status

### Task 4: Verify the node and update progress documents

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-account-status.md`

- [ ] **Step 1: Run the full mini program verification suite**
  Run:
  `node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs miniprogram/services/checkin/index.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/community/api.test.mjs miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs`
- [ ] **Step 2: Run syntax and JSON validation for new profile files**
- [ ] **Step 3: Update `README.md` and write the status handoff doc**
- [ ] **Step 4: Commit**
  `git add README.md docs/superpowers/plans/2026-03-17-mintbit-miniprogram-account-status.md && git commit -m "docs: update miniprogram account progress"`
- [ ] **Step 5: Push**
  `git push origin codex/release-hardening-wecom-web-readiness`
