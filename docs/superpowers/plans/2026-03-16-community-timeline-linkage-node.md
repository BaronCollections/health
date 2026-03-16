# Community Timeline Linkage Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by linking the community feed and the historical poster timeline with a bilingual, mobile-first bridge.

**Architecture:** Keep the node front-end only and introduce a small structured bilingual resource layer for the new bridge copy. Add a lightweight history entry card to the community feed, add a community return bridge on the timeline page, and avoid refactoring the existing community mock posts or introducing backend dependencies.

**Tech Stack:** Next.js App Router, TypeScript, JSON-backed locale resources, existing locale provider, Node built-in test runner

---

## Chunk 1: Translation Coverage Guard

### Task 1: Add a failing coverage check for community/timeline linkage resources

**Files:**
- Create: `frontend/scripts/community-timeline-linkage-translations.test.mjs`

- [x] **Step 1: Write a Node test that expects bilingual community/timeline linkage resources to exist**
- [x] **Step 2: Make the test verify every bridge section, stat, and CTA has an English variant**
- [x] **Step 3: Run `node --test frontend/scripts/community-timeline-linkage-translations.test.mjs` and confirm it fails before implementation**

## Chunk 2: Structured Linkage Resources

### Task 2: Add locale-aware bridge content for community and timeline

**Files:**
- Create: `frontend/src/lib/community-timeline/community-timeline.json`
- Create: `frontend/src/lib/community-timeline/community-timeline.en.json`
- Create: `frontend/src/lib/community-timeline/types.ts`
- Create: `frontend/src/lib/community-timeline/index.ts`
- Modify: `frontend/src/lib/timeline/timeline-content.json`
- Modify: `frontend/src/lib/timeline/timeline-content.en.json`

- [x] **Step 1: Add Chinese bridge content for the community entry card, timeline stat chips, and community return CTA**
- [x] **Step 2: Add explicit English resources with the same structure**
- [x] **Step 3: Extend timeline resources only where the timeline page needs new cross-linking copy**
- [x] **Step 4: Re-run `node --test frontend/scripts/community-timeline-linkage-translations.test.mjs` and confirm it passes**

## Chunk 3: UI Linkage

### Task 3: Wire the community feed and timeline page together

**Files:**
- Modify: `frontend/src/components/morning-community.tsx`
- Modify: `frontend/src/components/history-timeline-page.tsx`

- [x] **Step 1: Add a mobile-friendly history timeline entry card near the top of the recommended community feed**
- [x] **Step 2: Add a return bridge from the timeline page into the community tab**
- [x] **Step 3: Keep the new UI on the existing routes and avoid changing current feed/post behavior**

## Chunk 4: Verification and Stop Point

### Task 4: Verify the node and stop cleanly

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-community-timeline-linkage-node.md`

- [x] **Step 1: Run `node --test frontend/scripts/community-timeline-linkage-translations.test.mjs`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status in this plan**
- [ ] **Step 4: Commit and push the node**

## Node Status

- Completed node: `community and history timeline linkage`
- Verified with:
  - `node --test frontend/scripts/community-timeline-linkage-translations.test.mjs`
  - `node --test frontend/scripts/history-timeline-translations.test.mjs`
  - `npm run build`
- Implementation notes:
  - added structured bilingual bridge content under `frontend/src/lib/community-timeline/`
  - community recommended feed now exposes a dedicated history timeline card with stat chips and report/timeline CTAs
  - timeline page now includes a community return bridge without changing existing report or re-assessment flows
- Environment notes:
  - this worktree was missing `frontend/node_modules`, so `npm ci` was required before build verification
  - `next build` succeeds with existing workspace-root and `baseline-browser-mapping` warnings still present
- Deferred to next node:
  - deeper community post/circle content bilingualization
  - poster detail comparison depth inside the timeline
  - real OCR backend contract and request/response integration
