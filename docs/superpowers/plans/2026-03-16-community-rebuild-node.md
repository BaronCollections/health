# Community Rewrite Node Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MintBit Phase 1 mobile H5 community as a moderation-aware product surface with bilingual system copy, typed backend mock contracts, and a mobile operations review page.

**Architecture:** Split the node into three delivery blocks that can be verified independently but only count as complete together: user-side community rewrite, backend contract plus client integration, and operations H5 moderation. Keep community content deterministic and mock-backed, move system-owned copy into structured bilingual resources, and centralize moderation visibility rules in typed frontend helpers plus backend DTO contracts.

**Tech Stack:** Next.js App Router, TypeScript, Node built-in test runner, Spring Boot 3.2, Java 17, Lombok DTOs, root README progress tracking

---

## Chunk 1: User Community Rewrite

### Task 1: Define typed bilingual community resources and visibility rules

**Files:**
- Create: `frontend/src/lib/community/types.ts`
- Create: `frontend/src/lib/community/index.ts`
- Create: `frontend/src/lib/community/mock-content.json`
- Create: `frontend/src/lib/community/mock-content.en.json`
- Create: `frontend/src/lib/community/visibility.ts`
- Create: `frontend/src/lib/community/visibility.test.ts`
- Create: `frontend/scripts/community-bilingual-resources.test.mjs`

- [x] **Step 1: Write a failing Node test for moderation visibility rules**
- [x] **Step 2: Write a failing resource coverage test that asserts both locale files expose the same community keys**
- [x] **Step 3: Define the typed community shapes for circles, posts, comments, badges, create-form copy, and operations queue copy**
- [x] **Step 4: Implement the minimum visibility helper and resource loaders to make `node --experimental-strip-types --test frontend/src/lib/community/visibility.test.ts` and `node --test frontend/scripts/community-bilingual-resources.test.mjs` pass**

### Task 2: Rebuild the user-facing community routes and components

**Files:**
- Create: `frontend/src/components/community/community-home.tsx`
- Create: `frontend/src/components/community/community-create-page.tsx`
- Create: `frontend/src/components/community/community-post-detail-page.tsx`
- Create: `frontend/src/components/community/community-my-posts-page.tsx`
- Create: `frontend/src/components/community/post-card.tsx`
- Create: `frontend/src/components/community/comment-thread.tsx`
- Create: `frontend/src/components/community/moderation-status-badge.tsx`
- Create: `frontend/src/app/community/create/page.tsx`
- Create: `frontend/src/app/community/post/[id]/page.tsx`
- Create: `frontend/src/app/community/me/page.tsx`
- Modify: `frontend/src/app/community/page.tsx`
- Delete: `frontend/src/components/morning-community.tsx`

- [x] **Step 1: Build the recommended feed and circle view on top of the new structured community resources**
- [x] **Step 2: Build the create page with circle selection, bilingual helper copy, image placeholders, and submit-to-review behavior**
- [x] **Step 3: Build the post detail page with moderation-aware comments and status badges**
- [x] **Step 4: Build the “my posts” page grouped by pending, approved, rejected, and flagged**
- [x] **Step 5: Point `/community` at the new component tree and remove the legacy `morning-community` dependency**
- [x] **Step 6: Run `node --experimental-strip-types --test frontend/src/lib/community/visibility.test.ts`, `node --test frontend/scripts/community-bilingual-resources.test.mjs`, and `npm run build` in `frontend`**

## Chunk 2: Backend Contract And Frontend Integration

### Task 3: Add the backend community contract test and DTO skeletons

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CommunityCircleDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CommunityCommentDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CommunityFeedResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CommunityPostDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CreateCommunityCommentRequest.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/CreateCommunityPostRequest.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/ModerationDecisionRequest.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/ModerationItemDto.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/ModerationQueueResponse.java`
- Create: `backend/src/main/java/com/mintbit/health/model/dto/community/MyCommunityPostsResponse.java`
- Create: `backend/src/test/java/com/mintbit/health/service/MockCommunityServiceTest.java`

- [x] **Step 1: Write a failing backend test that covers feed, post detail, my posts, moderation queue, and moderation decision transitions**
- [x] **Step 2: Add DTO skeletons for the community contract types required by that test**
- [x] **Step 3: Run `mvn test -Dtest=MockCommunityServiceTest` in `backend` and confirm the new contract test fails before implementation**

### Task 4: Implement the mock service, controller endpoints, and client integration

**Files:**
- Create: `backend/src/main/java/com/mintbit/health/service/MockCommunityService.java`
- Create: `frontend/src/lib/community-api/types.ts`
- Create: `frontend/src/lib/community-api/client.ts`
- Modify: `backend/src/main/java/com/mintbit/health/controller/CommunityController.java`
- Modify: `frontend/src/components/community/community-home.tsx`
- Modify: `frontend/src/components/community/community-create-page.tsx`
- Modify: `frontend/src/components/community/community-post-detail-page.tsx`
- Modify: `frontend/src/components/community/community-my-posts-page.tsx`
- Modify: `frontend/src/components/community/post-card.tsx`
- Modify: `frontend/src/components/community/comment-thread.tsx`
- Modify: `frontend/src/lib/community/index.ts`
- Modify: `frontend/src/i18n/messages.ts`

- [x] **Step 1: Implement a deterministic mock community service that returns stable circles, feed items, author views, and moderation queue items**
- [x] **Step 2: Replace the placeholder controller methods with typed request and response contracts for feed, detail, create, comment, like, save, my posts, circles, queue, and moderation actions**
- [x] **Step 3: Implement a frontend community API client that prefers the backend contract and falls back to local mock resources if the API is unavailable**
- [x] **Step 4: Wire the user routes to the new client so create, detail, comment, like, save, and “my posts” flows all respect moderation states**
- [x] **Step 5: Re-run `mvn test -Dtest=MockCommunityServiceTest` in `backend`, `node --experimental-strip-types --test frontend/src/lib/community/visibility.test.ts`, `node --test frontend/scripts/community-bilingual-resources.test.mjs`, and `npm run build` in `frontend`**

## Chunk 3: Operations H5 Moderation

### Task 5: Build the mobile operations moderation page

**Files:**
- Create: `frontend/src/components/community/community-review-page.tsx`
- Create: `frontend/src/app/ops/community-review/page.tsx`
- Modify: `frontend/src/components/community/moderation-status-badge.tsx`
- Modify: `frontend/src/lib/community/mock-content.json`
- Modify: `frontend/src/lib/community/mock-content.en.json`
- Modify: `frontend/src/lib/community-api/client.ts`

- [x] **Step 1: Build the mobile review page with queue tabs, stacked moderation cards, and content preview**
- [x] **Step 2: Add approve, reject, flag, and restore actions with bilingual labels and state feedback**
- [x] **Step 3: Keep the review UX mobile-first with cards, chips, and action rows rather than a desktop table layout**
- [x] **Step 4: Run `npm run build` in `frontend` and verify the operations route is included**

## Chunk 4: Verification, README, And Progress

### Task 6: Verify the node and update the project front page

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-community-rebuild-node.md`
- Modify: `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`

- [x] **Step 1: Run `node --experimental-strip-types --test frontend/src/lib/community/visibility.test.ts`**
- [x] **Step 2: Run `node --test frontend/scripts/community-bilingual-resources.test.mjs`**
- [x] **Step 3: Run `mvn test -Dtest=MockCommunityServiceTest` in `backend`**
- [x] **Step 4: Run `npm run build` in `frontend`**
- [x] **Step 5: Update `README.md` so the homepage reflects the rebuilt community, moderation-aware H5 flow, and current project progress**
- [x] **Step 6: Mark this node complete in the plan and update `docs/superpowers/plans/2026-03-16-phase1-node-progress.md` from `9 / 12 = 75%` to `10 / 12 = 83%`**
- [x] **Step 7: Commit and push the completed node on the community branch**

## Node Status

- Current node: `community rewrite with moderation and ops H5`
- Current completion state: `completed`
- Progress policy:
  - keep overall Phase 1 node progress at `9 / 12 = 75%` until all three internal delivery blocks are complete
  - only move to `10 / 12 = 83%` after user community rewrite, backend contract integration, and operations H5 moderation are all verified
- Deferred to later nodes:
  - notifications, help, and privacy settings bilingualization
  - release hardening and WeCom/Web readiness prep
