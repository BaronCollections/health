# MintBit Mini Program Media Attachments Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the remaining placeholder image flows in the MintBit mini program with native WeChat image selection, preview, and metadata submission behavior.

**Architecture:** Add a small shared media runtime that normalizes WeChat image picker output, then wire it into the community composer and the account feedback form. Keep backend integration metadata-only in Phase 1 so no object storage or upload pipeline is introduced prematurely.

**Tech Stack:** Native WeChat Mini Program APIs, Node test runner, existing mini program service/state modules

---

## Chunk 1: Shared Media Runtime

### Task 1: Add reusable image-picker runtime

**Files:**
- Create: `miniprogram/services/media/image-picker.js`
- Test: `miniprogram/services/media/image-picker.test.mjs`

- [ ] **Step 1: Write failing tests for `chooseMedia` normalization and `chooseImage` fallback**
- [ ] **Step 2: Run `node --test miniprogram/services/media/image-picker.test.mjs` and confirm failure**
- [ ] **Step 3: Implement minimal image picker runtime**
- [ ] **Step 4: Re-run `node --test miniprogram/services/media/image-picker.test.mjs` and confirm pass**

## Chunk 2: Community Native Attachments

### Task 2: Support images in community composer and render them in feed/detail views

**Files:**
- Modify: `miniprogram/services/community/index.js`
- Modify: `miniprogram/services/community/content.js`
- Modify: `miniprogram/services/community/api.test.mjs`
- Modify: `miniprogram/services/community/session.test.mjs`
- Modify: `miniprogram/pages/community/create/index.js`
- Modify: `miniprogram/pages/community/create/index.wxml`
- Modify: `miniprogram/pages/community/create/index.wxss`
- Modify: `miniprogram/pages/community/index/index.wxml`
- Modify: `miniprogram/pages/community/index/index.wxss`
- Modify: `miniprogram/pages/community/detail/index.wxml`
- Modify: `miniprogram/pages/community/detail/index.wxss`
- Modify: `miniprogram/pages/community/my-posts/index.wxml`
- Modify: `miniprogram/pages/community/my-posts/index.wxss`

- [ ] **Step 1: Extend tests to require image metadata preservation**
- [ ] **Step 2: Run targeted community tests and confirm failure**
- [ ] **Step 3: Implement composer selection/removal plus feed/detail rendering**
- [ ] **Step 4: Re-run targeted community tests and confirm pass**

## Chunk 3: Feedback Screenshot Flow

### Task 3: Replace feedback screenshot placeholder with native image selection

**Files:**
- Modify: `miniprogram/services/account/index.js`
- Modify: `miniprogram/services/account/index.test.mjs`
- Modify: `miniprogram/services/account/api.test.mjs`
- Modify: `miniprogram/services/account/state.test.mjs`
- Modify: `miniprogram/pages/profile/help/feedback/index.js`
- Modify: `miniprogram/pages/profile/help/feedback/index.wxml`
- Modify: `miniprogram/pages/profile/help/feedback/index.wxss`
- Modify: `miniprogram/pages/profile/help/records/index.wxml`
- Modify: `miniprogram/pages/profile/help/records/index.wxss`
- Modify: `miniprogram/services/account/content.js`

- [ ] **Step 1: Extend tests to require screenshot metadata retention**
- [ ] **Step 2: Run targeted account tests and confirm failure**
- [ ] **Step 3: Implement picker-backed feedback screenshot flow and records rendering**
- [ ] **Step 4: Re-run targeted account tests and confirm pass**

## Chunk 4: Verification And Progress Update

### Task 4: Update docs and verify the node end-to-end

**Files:**
- Modify: `README.md`
- Modify: `miniprogram/README.md`
- Create: `docs/superpowers/plans/2026-03-17-mintbit-miniprogram-media-attachments-status.md`

- [ ] **Step 1: Update user-facing progress docs**
- [ ] **Step 2: Run `npm --prefix miniprogram run test:all`**
- [ ] **Step 3: Run `npm --prefix miniprogram run check:syntax`**
- [ ] **Step 4: Run `npm --prefix miniprogram run check:json`**
- [ ] **Step 5: Run `npm --prefix miniprogram run check:project-config`**
- [ ] **Step 6: Commit with a focused message**
