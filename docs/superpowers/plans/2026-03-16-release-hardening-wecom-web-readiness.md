# Release Hardening And WeCom/Web Readiness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish Phase 1 by adding a conservative release gate, administrator-only release checklist tooling, WeCom Phase 2 adapter skeletons, and a Web dual-shell foundation.

**Architecture:** Build a centralized runtime/config layer first, then attach an administrator release-checklist surface inside account center. After the release gate is in place, harden critical pages with standard state handling and fallback visibility. Finally, add WeCom adapter boundaries and a dual-shell app structure so later WeCom and Web delivery can continue without changing existing route architecture.

**Tech Stack:** Next.js App Router, TypeScript, Node built-in test runner, structured JSON locale resources, localStorage-based prototype persistence, environment-based allowlist config, existing Spring Boot mock backend, root README progress tracking

---

## Chunk 1: Runtime And Admin Foundations

### Task 1: Define runtime config and administrator allowlist helpers

**Files:**
- Create: `frontend/src/lib/runtime/types.ts`
- Create: `frontend/src/lib/runtime/config.ts`
- Create: `frontend/src/lib/runtime/config.test.ts`
- Create: `frontend/src/lib/runtime/runtime.ts`
- Create: `frontend/src/lib/runtime/runtime.test.ts`

- [ ] **Step 1: Write a failing Node test for allowlist parsing, current identity resolution, and platform/environment snapshot generation**
- [ ] **Step 2: Run `node --experimental-strip-types --test frontend/src/lib/runtime/config.test.ts frontend/src/lib/runtime/runtime.test.ts` and confirm the new tests fail before implementation**
- [ ] **Step 3: Implement typed runtime config helpers for environment, allowlist parsing, and current-identity resolution**
- [ ] **Step 4: Implement the minimal runtime snapshot helper so the new runtime tests pass**
- [ ] **Step 5: Commit the runtime/admin foundation helpers**

### Task 2: Surface admin visibility in account center

**Files:**
- Create: `frontend/src/lib/release-checklist/types.ts`
- Modify: `frontend/src/lib/account/types.ts`
- Modify: `frontend/src/lib/account/mock-content.json`
- Modify: `frontend/src/lib/account/mock-content.en.json`
- Modify: `frontend/src/components/account/account-home.tsx`

- [ ] **Step 1: Extend account resource types with an administrator tools card and release-checklist labels**
- [ ] **Step 2: Update account-center home so the admin tools entry only appears for allowlisted identities**
- [ ] **Step 3: Re-run `node --experimental-strip-types --test frontend/src/lib/runtime/config.test.ts frontend/src/lib/runtime/runtime.test.ts` and `node --test frontend/scripts/account-bilingual-resources.test.mjs`**
- [ ] **Step 4: Commit the admin-entry changes**

## Chunk 2: Release Checklist Page

### Task 3: Define checklist resources, status logic, and manual-confirmation persistence

**Files:**
- Create: `frontend/src/lib/release-checklist/index.ts`
- Create: `frontend/src/lib/release-checklist/mock-content.json`
- Create: `frontend/src/lib/release-checklist/mock-content.en.json`
- Create: `frontend/src/lib/release-checklist/state.ts`
- Create: `frontend/src/lib/release-checklist/state.test.ts`
- Create: `frontend/src/lib/release-checklist/session.ts`
- Create: `frontend/src/lib/release-checklist/session.test.ts`
- Create: `frontend/scripts/release-checklist-bilingual-resources.test.mjs`

- [ ] **Step 1: Write failing tests for overall checklist status aggregation and manual-confirmation persistence**
- [ ] **Step 2: Run `node --experimental-strip-types --test frontend/src/lib/release-checklist/state.test.ts frontend/src/lib/release-checklist/session.test.ts` and confirm failure**
- [ ] **Step 3: Add bilingual checklist resources for build, runtime, core journey, compliance, and platform readiness groups**
- [ ] **Step 4: Implement the minimum checklist-state and session helpers so the tests pass**
- [ ] **Step 5: Run `node --test frontend/scripts/release-checklist-bilingual-resources.test.mjs`**

### Task 4: Build the administrator release checklist route

**Files:**
- Create: `frontend/src/components/account/release-checklist-page.tsx`
- Create: `frontend/src/app/profile/admin/release-checklist/page.tsx`
- Modify: `frontend/src/app/profile/page.tsx`

- [ ] **Step 1: Build the administrator-only release checklist H5 page with grouped cards and overall status**
- [ ] **Step 2: Add runtime diagnostics, known warnings, action links, and local manual-confirmation controls**
- [ ] **Step 3: Ensure non-admin access downgrades safely back to `/profile`**
- [ ] **Step 4: Run `node --experimental-strip-types --test frontend/src/lib/runtime/config.test.ts frontend/src/lib/runtime/runtime.test.ts frontend/src/lib/release-checklist/state.test.ts frontend/src/lib/release-checklist/session.test.ts`**
- [ ] **Step 5: Commit the release-checklist page**

## Chunk 3: Release Hardening

### Task 5: Standardize critical page state blocks and fallback visibility

**Files:**
- Create: `frontend/src/components/shared/page-state.tsx`
- Create: `frontend/src/components/shared/fallback-badge.tsx`
- Modify: `frontend/src/components/community/community-home.tsx`
- Modify: `frontend/src/components/account/notifications-page.tsx`
- Modify: `frontend/src/components/account/help-center-page.tsx`
- Modify: `frontend/src/components/account/privacy-center-page.tsx`
- Modify: `frontend/src/components/morning-report.tsx`
- Modify: `frontend/src/components/ocr-upload-page.tsx`
- Modify: `frontend/src/components/ocr-confirmation-page.tsx`

- [ ] **Step 1: Write a failing focused test for fallback-badge or page-state rendering behavior**
- [ ] **Step 2: Run the focused test and confirm failure before implementing the shared components**
- [ ] **Step 3: Implement reusable `loading / empty / error / retry` blocks and a visible fallback badge**
- [ ] **Step 4: Apply those shared blocks to the listed critical pages without changing route behavior**
- [ ] **Step 5: Run `npm run build` in `frontend` and verify the hardened pages still compile**
- [ ] **Step 6: Commit the release-hardening UI changes**

## Chunk 4: WeCom Skeleton

### Task 6: Add WeCom runtime adapters and callback skeleton

**Files:**
- Create: `frontend/src/lib/platform/types.ts`
- Create: `frontend/src/lib/platform/wecom.ts`
- Create: `frontend/src/lib/platform/wecom.test.ts`
- Create: `frontend/src/app/auth/wecom/callback/page.tsx`
- Modify: `frontend/src/lib/runtime/runtime.ts`
- Modify: `frontend/src/lib/release-checklist/mock-content.json`
- Modify: `frontend/src/lib/release-checklist/mock-content.en.json`

- [ ] **Step 1: Write failing tests for WeCom environment detection and downgrade-safe adapter responses**
- [ ] **Step 2: Run `node --experimental-strip-types --test frontend/src/lib/platform/wecom.test.ts` and confirm failure**
- [ ] **Step 3: Implement typed WeCom auth/share/menu/message/sdk adapter skeletons with downgrade-safe defaults**
- [ ] **Step 4: Add the callback route placeholder and expose WeCom readiness in checklist resources**
- [ ] **Step 5: Re-run the WeCom tests and commit the adapter skeleton**

## Chunk 5: Web Dual-Shell Foundation

### Task 7: Add shared app-shell selection and desktop shell

**Files:**
- Create: `frontend/src/components/shells/mobile-app-shell.tsx`
- Create: `frontend/src/components/shells/desktop-app-shell.tsx`
- Create: `frontend/src/components/shells/app-shell.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/components/shared-nav.tsx`
- Modify: `frontend/src/styles/globals.css`
- Modify: `frontend/src/lib/runtime/runtime.ts`

- [ ] **Step 1: Write a failing focused test for shell selection based on desktop viewport and WeCom/mobile conditions**
- [ ] **Step 2: Run the shell-selection test and confirm failure before implementation**
- [ ] **Step 3: Implement a dual-shell app structure that keeps current mobile H5 behavior as the default**
- [ ] **Step 4: Ensure desktop shell uses the same route tree with a larger container and navigation frame**
- [ ] **Step 5: Run `npm run build` in `frontend` and commit the dual-shell foundation**

## Chunk 6: Finalization

### Task 8: Update release docs, README, and final progress

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`
- Create: `docs/release-checklist.md`
- Modify: `docs/superpowers/specs/2026-03-16-release-hardening-wecom-web-readiness-design.md`
- Modify: `docs/superpowers/plans/2026-03-16-release-hardening-wecom-web-readiness.md`

- [ ] **Step 1: Write the release-checklist document so repo docs and in-product checklist use the same terminology**
- [ ] **Step 2: Update README so the project homepage reflects administrator release diagnostics, WeCom skeleton readiness, and Web shell readiness**
- [ ] **Step 3: Move Phase 1 progress from `11 / 12 = 92%` to `12 / 12 = 100%`**
- [ ] **Step 4: Run `node --experimental-strip-types --test frontend/src/lib/runtime/config.test.ts frontend/src/lib/runtime/runtime.test.ts frontend/src/lib/release-checklist/state.test.ts frontend/src/lib/release-checklist/session.test.ts frontend/src/lib/platform/wecom.test.ts`**
- [ ] **Step 5: Run `node --test frontend/scripts/account-bilingual-resources.test.mjs frontend/scripts/release-checklist-bilingual-resources.test.mjs`**
- [ ] **Step 6: Run `npm run build` in `frontend`**
- [ ] **Step 7: Run `mvn test -Dtest=MockAccountServiceTest` in `backend` if backend account files changed during this node**
- [ ] **Step 8: Commit and push the completed final node**

## Node Status

- Current node: `Release hardening and WeCom/Web readiness prep`
- Current completion state: `planning approved, implementation not started`
- Progress policy:
  - keep overall Phase 1 node progress at `11 / 12 = 92%` until release hardening, release checklist, WeCom skeleton, and Web dual-shell work are all verified
  - only move to `12 / 12 = 100%` after the final release gate and platform-readiness work are fully verified
