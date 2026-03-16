# Check-In Plan Persistence Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by persisting the saved nutrition plan from the report page and carrying daily check-in state across refreshes.

**Architecture:** Introduce two small browser-session modules: one for the saved nutrition plan and one for check-in state. Use test-first pure functions for persistence and daily state transitions, then wire the report page to save the active recommendation set and the check-in page to load that plan plus restore daily check-in progress.

**Tech Stack:** Next.js App Router, TypeScript, Node built-in test runner with `--experimental-strip-types`, localStorage-backed session helpers

---

## Chunk 1: Session Logic Tests

### Task 1: Add failing tests for saved-plan and check-in persistence helpers

**Files:**
- Create: `frontend/src/lib/plan/session.test.ts`
- Create: `frontend/src/lib/checkin/session.test.ts`

- [x] **Step 1: Write a Node test for saving/loading the nutrition plan snapshot**
- [x] **Step 2: Write a Node test for applying a daily check-in transition without double-counting the same day**
- [x] **Step 3: Run `node --experimental-strip-types --test frontend/src/lib/plan/session.test.ts frontend/src/lib/checkin/session.test.ts` and confirm it fails before implementation**

## Chunk 2: Persistence Helpers

### Task 2: Implement saved-plan and check-in session modules

**Files:**
- Create: `frontend/src/lib/plan/session.ts`
- Create: `frontend/src/lib/checkin/session.ts`

- [x] **Step 1: Implement a typed saved-plan snapshot helper with load/save semantics**
- [x] **Step 2: Implement a typed check-in state helper with initial state, restore, and daily apply logic**
- [x] **Step 3: Re-run `node --experimental-strip-types --test frontend/src/lib/plan/session.test.ts frontend/src/lib/checkin/session.test.ts` and confirm it passes**

## Chunk 3: UI Integration

### Task 3: Wire persistence into the report and check-in pages

**Files:**
- Modify: `frontend/src/components/morning-report.tsx`
- Modify: `frontend/src/components/morning-checkin.tsx`

- [x] **Step 1: Add a report-page action that saves the currently selected nutrition cards into the persisted plan**
- [x] **Step 2: Update the check-in page to load the saved plan and use it in the “我的营养方案” section**
- [x] **Step 3: Update the check-in page to restore and persist daily check-in state across refreshes**

## Chunk 4: Verification, Progress, And Stop Point

### Task 4: Verify the node and record project progress

**Files:**
- Modify: `docs/superpowers/plans/2026-03-16-checkin-plan-persistence-node.md`
- Modify: `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`

- [x] **Step 1: Run `node --experimental-strip-types --test frontend/src/lib/plan/session.test.ts frontend/src/lib/checkin/session.test.ts`**
- [x] **Step 2: Run `npm run build` in `frontend`**
- [x] **Step 3: Record the node status and update the current Phase 1 completion percentage**
- [x] **Step 4: Commit and push the node**

## Node Status

- Completed node: `check-in and saved-plan persistence integration`
- Verified with:
  - `node --experimental-strip-types --test frontend/src/lib/plan/session.test.ts frontend/src/lib/checkin/session.test.ts`
  - `npm run build`
- Implementation notes:
  - report page now saves the active recommendation set into a persisted local snapshot
  - check-in page restores the saved plan and surfaces it as the primary “我的营养方案” block
  - daily check-in state now survives refresh through a dedicated session helper and duplicate same-day check-ins are ignored
- Progress:
  - current Phase 1 engineering node progress: `9 / 12 = 75%`
  - progress basis is tracked in `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`
- Deferred to next node:
  - community deep bilingualization and moderation states
  - notifications, help, and privacy settings bilingualization
  - release hardening and WeCom/Web readiness prep
