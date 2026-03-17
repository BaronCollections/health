# MintBit Mini Program Demo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unused TDesign example pages and helper components from `miniprogram/` so the repository only ships the MintBit mini program application surface.

**Architecture:** Keep the cleanup whitelist-driven. `app.json` remains the source of truth for live pages, and only directories not referenced by the MintBit app are deleted. After cleanup, rerun the mini program validation suite so the remaining workspace is still bootable in WeChat DevTools.

**Tech Stack:** WeChat Mini Program, Node.js validation scripts, git-tracked workspace cleanup

---

## Chunk 1: Inventory And Whitelist

### Task 1: Document the business-page whitelist

**Files:**
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-demo-cleanup.md`
- Modify: `miniprogram/app.json`

- [ ] **Step 1: Treat `miniprogram/app.json` as the live page whitelist**

Keep only the MintBit business routes registered in `app.json`:

```json
[
  "pages/home/index/index",
  "pages/report/index/index",
  "pages/checkin/index/index",
  "pages/community/index/index",
  "pages/community/create/index",
  "pages/community/detail/index",
  "pages/community/my-posts/index",
  "pages/community/review/index",
  "pages/profile/index/index",
  "pages/profile/notifications/index",
  "pages/profile/notifications/detail/index",
  "pages/profile/help/index",
  "pages/profile/help/feedback/index",
  "pages/profile/help/records/index",
  "pages/profile/privacy/index",
  "pages/profile/privacy/export/index",
  "pages/profile/privacy/delete-request/index",
  "pages/profile/security/index",
  "pages/profile/audit-log/index",
  "pages/profile/admin/release-checklist/index",
  "pages/auth/login/index",
  "pages/auth/bind-phone/index",
  "pages/assessment/questionnaire/index",
  "pages/assessment/result-loading/index",
  "pages/report/ocr-upload/index",
  "pages/report/ocr-confirmation/index",
  "pages/report/timeline/index"
]
```

- [ ] **Step 2: Confirm old demo-only helpers are unused**

Unused after page cleanup:

```text
miniprogram/components/demo-block
miniprogram/components/demo-header
miniprogram/components/pull-down-list
miniprogram/components/trd-privacy
miniprogram/demos
```

## Chunk 2: Workspace Cleanup

### Task 2: Delete unreferenced demo pages and legacy helper components

**Files:**
- Delete: `miniprogram/pages/action-sheet/**`
- Delete: `miniprogram/pages/avatar/**`
- Delete: `miniprogram/pages/back-top/**`
- Delete: `miniprogram/pages/badge/**`
- Delete: `miniprogram/pages/button/**`
- Delete: `miniprogram/pages/calendar/**`
- Delete: `miniprogram/pages/cascader/**`
- Delete: `miniprogram/pages/cell/**`
- Delete: `miniprogram/pages/cell-group/**`
- Delete: `miniprogram/pages/checkbox/**`
- Delete: `miniprogram/pages/col/**`
- Delete: `miniprogram/pages/collapse/**`
- Delete: `miniprogram/pages/color-picker/**`
- Delete: `miniprogram/pages/count-down/**`
- Delete: `miniprogram/pages/date-time-picker/**`
- Delete: `miniprogram/pages/dialog/**`
- Delete: `miniprogram/pages/divider/**`
- Delete: `miniprogram/pages/drawer/**`
- Delete: `miniprogram/pages/dropdown-menu/**`
- Delete: `miniprogram/pages/empty/**`
- Delete: `miniprogram/pages/fab/**`
- Delete: `miniprogram/pages/footer/**`
- Delete: `miniprogram/pages/grid/**`
- Delete: `miniprogram/pages/guide/**`
- Delete: `miniprogram/pages/gulp-error/**`
- Delete: `miniprogram/pages/icon/**`
- Delete: `miniprogram/pages/image/**`
- Delete: `miniprogram/pages/image-viewer/**`
- Delete: `miniprogram/pages/indexes/**`
- Delete: `miniprogram/pages/input/**`
- Delete: `miniprogram/pages/link/**`
- Delete: `miniprogram/pages/loading/**`
- Delete: `miniprogram/pages/message/**`
- Delete: `miniprogram/pages/navbar/**`
- Delete: `miniprogram/pages/notice-bar/**`
- Delete: `miniprogram/pages/overlay/**`
- Delete: `miniprogram/pages/picker/**`
- Delete: `miniprogram/pages/popup/**`
- Delete: `miniprogram/pages/progress/**`
- Delete: `miniprogram/pages/pull-down-refresh/**`
- Delete: `miniprogram/pages/radio/**`
- Delete: `miniprogram/pages/rate/**`
- Delete: `miniprogram/pages/result/**`
- Delete: `miniprogram/pages/search/**`
- Delete: `miniprogram/pages/side-bar/**`
- Delete: `miniprogram/pages/skeleton/**`
- Delete: `miniprogram/pages/slider/**`
- Delete: `miniprogram/pages/stepper/**`
- Delete: `miniprogram/pages/steps/**`
- Delete: `miniprogram/pages/sticky/**`
- Delete: `miniprogram/pages/swipe-cell/**`
- Delete: `miniprogram/pages/swiper/**`
- Delete: `miniprogram/pages/switch/**`
- Delete: `miniprogram/pages/tab-bar/**`
- Delete: `miniprogram/pages/tabs/**`
- Delete: `miniprogram/pages/tag/**`
- Delete: `miniprogram/pages/textarea/**`
- Delete: `miniprogram/pages/toast/**`
- Delete: `miniprogram/pages/transition/**`
- Delete: `miniprogram/pages/tree-select/**`
- Delete: `miniprogram/pages/upload/**`
- Delete: `miniprogram/pages/home/home.*`
- Delete: `miniprogram/pages/home/data/**`
- Delete: `miniprogram/pages/home/navigateFail/**`
- Delete: `miniprogram/components/demo-block/**`
- Delete: `miniprogram/components/demo-header/**`
- Delete: `miniprogram/components/pull-down-list/**`
- Delete: `miniprogram/components/trd-privacy/**`
- Delete: `miniprogram/demos/**`

- [ ] **Step 1: Remove only directories that are not referenced by the MintBit app**

Run a git-tracked cleanup so deletions stay explicit:

```bash
git rm -r miniprogram/pages/action-sheet miniprogram/pages/avatar miniprogram/pages/back-top
```

- [ ] **Step 2: Remove nested legacy home demo assets**

Delete the old `pages/home/home.*`, `pages/home/data`, and `pages/home/navigateFail` artifacts because `pages/home/index/index` is now the only live home route.

### Task 3: Keep shared runtime and business pages intact

**Files:**
- Keep: `miniprogram/pages/home/index/**`
- Keep: `miniprogram/pages/report/**`
- Keep: `miniprogram/pages/checkin/**`
- Keep: `miniprogram/pages/community/**`
- Keep: `miniprogram/pages/profile/**`
- Keep: `miniprogram/pages/auth/**`
- Keep: `miniprogram/pages/assessment/**`
- Keep: `miniprogram/components/mintbit-nav/**`
- Keep: `miniprogram/components/locale-switch/**`
- Keep: `miniprogram/components/fallback-state/**`
- Keep: `miniprogram/config/**`
- Keep: `miniprogram/services/**`
- Keep: `miniprogram/store/**`
- Keep: `miniprogram/custom-tab-bar/**`

- [ ] **Step 1: Re-scan references after deletion**

Run:

```bash
rg -n "demo-header|demo-block|pull-down-list|trd-privacy" miniprogram -g '!miniprogram/miniprogram_npm/**'
```

Expected: no references from live MintBit routes.

## Chunk 3: Verification And Docs

### Task 4: Re-run the release-readiness validation suite

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run the mini program validation suite**

Run:

```bash
npm --prefix miniprogram run test:all
npm --prefix miniprogram run check:syntax
npm --prefix miniprogram run check:json
npm --prefix miniprogram run check:project-config
```

Expected: all commands pass.

- [ ] **Step 2: Update the repository front page**

Call out that the old TDesign example pages have been removed and the mini program workspace is now MintBit-only.

- [ ] **Step 3: Commit**

```bash
git add README.md miniprogram docs/superpowers/plans/2026-03-17-mintbit-miniprogram-demo-cleanup.md
git commit -m "chore: remove unused miniprogram demo pages"
```
