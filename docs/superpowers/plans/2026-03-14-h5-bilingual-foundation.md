# H5 Bilingual Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the next independent Phase 1 node by wiring a bilingual foundation into the current mobile H5 prototype.

**Architecture:** Introduce a lightweight locale context with persisted language preference, keyed message dictionaries, and a reusable language switcher. Apply the new translation layer to shared chrome and the first-screen copy on the prototype home flow so later deep-page localization can build on a stable foundation.

**Tech Stack:** Next.js App Router, React context, TypeScript, existing mobile H5 prototype components

---

## Chunk 1: Locale Infrastructure

### Task 1: Add locale state and dictionaries

**Files:**
- Create: `frontend/src/i18n/types.ts`
- Create: `frontend/src/i18n/messages.ts`
- Create: `frontend/src/i18n/locale-context.tsx`
- Create: `frontend/src/i18n/use-locale.ts`

- [x] **Step 1: Define locale and message types**
- [x] **Step 2: Add `zh-CN` and `en` message dictionaries for shared chrome and first-screen copy**
- [x] **Step 3: Implement locale provider with localStorage persistence and `document.documentElement.lang` sync**
- [x] **Step 4: Add a locale hook for component usage**
- [x] **Step 5: Commit the infrastructure slice**

## Chunk 2: Shared Chrome Integration

### Task 2: Wire provider and language switching into the app shell

**Files:**
- Modify: `frontend/src/app/layout.tsx`
- Create: `frontend/src/components/language-switcher.tsx`
- Modify: `frontend/src/components/shared-nav.tsx`

- [x] **Step 1: Wrap the app with the locale provider in layout**
- [x] **Step 2: Add a reusable language switcher component**
- [x] **Step 3: Translate bottom navigation labels and align them with the approved Phase 1 information architecture**
- [x] **Step 4: Keep layout metadata brand-safe for MintBit**
- [x] **Step 5: Commit the shared chrome slice**

## Chunk 3: Entry Screen Localization

### Task 3: Localize the prototype entry experience

**Files:**
- Modify: `frontend/src/components/morning-home.tsx`
- Modify: `frontend/src/components/morning-report.tsx`
- Modify: `frontend/src/components/morning-checkin.tsx`
- Modify: `frontend/src/components/morning-community.tsx`
- Modify: `frontend/src/components/morning-profile.tsx`

- [x] **Step 1: Replace first-screen home copy with keyed messages**
- [x] **Step 2: Localize visible brand and primary entry labels on report, check-in, community, and profile**
- [x] **Step 3: Keep deep long-form body copy deferred to the next node**
- [x] **Step 4: Verify switching behavior manually through shared UI**
- [x] **Step 5: Commit the entry-screen slice**

## Chunk 4: Verification and Handoff

### Task 4: Verify and stop at the node boundary

**Files:**
- Modify: `docs/superpowers/plans/2026-03-14-h5-bilingual-foundation.md`

- [x] **Step 1: Run `npm run build` in `frontend`**
- [x] **Step 2: Record the node status in the plan file if scope changed**
- [x] **Step 3: Push the branch and stop**

## Node Status

- Completed node: `H5 bilingual foundation`
- Verified with: `npm run build`
- Pushed branch: `codex/local-prototype-h5`
- Deferred to next node: deep-page long-form localization, questionnaire structured content localization, notification/help localization, community translation behavior
