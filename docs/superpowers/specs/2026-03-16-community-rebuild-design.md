# Community Rewrite And Moderation H5 Design

> Version: 1.0
> Date: 2026-03-16
> Status: Approved for implementation planning
> Scope: Phase 1 mobile H5 community rewrite, moderation contract, and operations H5 review flow

## 1. Purpose

This spec defines the next large Phase 1 delivery unit for MintBit community. It covers:

- user-facing H5 community rewrite
- post and comment creation with moderation-aware states
- backend mock contracts for community feeds, creation, comments, and moderation
- mobile H5 operations review page

This spec does not replace the master Phase 1 design. It inherits the approved product, bilingual, trust, and execution rules from:

- `docs/superpowers/specs/2026-03-14-mintbit-phase1-design.md`

## 2. Problem Statement

The current repository contains multiple community prototypes, but the primary H5 community experience is still a large mock-heavy component with shallow bilingual coverage and no stable moderation contract. As a result:

- public feed behavior is not clearly separated from author-only visibility
- community content is not fully localized
- moderation states are not modeled consistently
- the backend community controller does not provide stable contracts
- operations review does not exist as a first-class H5 surface

The goal of this node is to make community a coherent product surface with stable state boundaries while staying mobile-first and Phase 1 scoped.

## 3. Scope

### 3.1 Included

- rewrite the primary H5 community experience used at `/community`
- add dedicated user pages for create, post detail, and my posts
- add a mobile H5 operations moderation page
- add typed backend contracts and a deterministic mock community service
- add bilingual structured mock resources for system-owned community content
- add state badges and flows for moderation-aware post and comment lifecycle
- update the repository homepage `README.md` after this node is complete

### 3.2 Excluded

- desktop moderation console
- real database persistence for community records
- real image upload storage pipeline
- automated translation of user-generated content
- full abuse and trust tooling beyond state modeling and queue actions

## 4. Product Surfaces

### 4.1 User H5 Routes

- `/community`
  - recommended feed
  - circles
  - entry to create
  - entry to my posts
- `/community/create`
  - create a post
  - choose circle
  - attach images
  - submit into moderation
- `/community/post/[id]`
  - post detail
  - comments
  - interaction state
- `/community/me`
  - current user posts by moderation state

### 4.2 Operations H5 Route

- `/ops/community-review`
  - queue tabs by moderation state
  - moderation action sheet
  - context preview for posts and comments

## 5. Information Architecture

### 5.1 User Side

- `recommended`
  - approved posts only
  - feed cards
  - community timeline bridge remains available
- `circles`
  - circle list
  - circle summary
  - filtered feed by circle
- `my posts`
  - pending review
  - approved
  - rejected
  - flagged

### 5.2 Operations Side

- `pending_review`
- `approved`
- `rejected`
- `flagged`

Every moderation card must show:

- target type: post or comment
- author
- circle
- content summary
- timestamp
- moderation reason or trigger
- current status

## 6. Core State Model

### 6.1 Post States

- `draft`
- `pending_review`
- `approved`
- `rejected`
- `flagged`
- `hidden`

### 6.2 Comment States

- `pending_review`
- `approved`
- `rejected`
- `hidden`

### 6.3 Visibility Rules

- public feed shows only `approved` posts and approved comments
- author can see their own posts in all visible states except fully removed internal-only content
- operations review can see all states
- `rejected` and `flagged` content must be surfaced to the author with an explanation label

## 7. Bilingual Strategy

### 7.1 Must Be Bilingual

- page titles
- tabs
- buttons
- empty states
- status badges
- moderation action labels
- moderation reason copy
- system-created seed posts, circle descriptions, and helper modules

### 7.2 Must Not Be Auto-Translated

- user-generated post text
- user-generated comments
- author display names

The platform provides bilingual system framing around user content, but user content remains in its original language.

## 8. Frontend Architecture

### 8.1 Route Files

- `frontend/src/app/community/page.tsx`
- `frontend/src/app/community/create/page.tsx`
- `frontend/src/app/community/post/[id]/page.tsx`
- `frontend/src/app/community/me/page.tsx`
- `frontend/src/app/ops/community-review/page.tsx`

### 8.2 Components

- `frontend/src/components/community/community-home.tsx`
- `frontend/src/components/community/community-create-page.tsx`
- `frontend/src/components/community/community-post-detail-page.tsx`
- `frontend/src/components/community/community-my-posts-page.tsx`
- `frontend/src/components/community/community-review-page.tsx`
- `frontend/src/components/community/post-card.tsx`
- `frontend/src/components/community/comment-thread.tsx`
- `frontend/src/components/community/moderation-status-badge.tsx`

### 8.3 Frontend Data Layer

- `frontend/src/lib/community/types.ts`
- `frontend/src/lib/community/index.ts`
- `frontend/src/lib/community/mock-content.json`
- `frontend/src/lib/community/mock-content.en.json`
- `frontend/src/lib/community-api/client.ts`

The frontend should stop treating `morning-community.tsx` as the canonical place for all state and copy. Reusable modules and typed content should sit under `frontend/src/components/community/` and `frontend/src/lib/community/`.

## 9. Backend Contract Design

### 9.1 Required DTOs

- `CommunityPostDto`
- `CommunityCommentDto`
- `CommunityCircleDto`
- `CommunityFeedResponse`
- `MyCommunityPostsResponse`
- `ModerationItemDto`
- `ModerationQueueResponse`
- `ModerationDecisionRequest`

### 9.2 Required Endpoints

- `GET /api/community/feed`
- `GET /api/community/post/{postId}`
- `POST /api/community/post`
- `POST /api/community/post/{postId}/comment`
- `POST /api/community/post/{postId}/like`
- `POST /api/community/post/{postId}/save`
- `GET /api/community/me/posts`
- `GET /api/community/circles`
- `GET /api/community/moderation/queue`
- `POST /api/community/moderation/{targetType}/{targetId}/approve`
- `POST /api/community/moderation/{targetType}/{targetId}/reject`
- `POST /api/community/moderation/{targetType}/{targetId}/flag`
- `POST /api/community/moderation/{targetType}/{targetId}/restore`

### 9.3 Backend Execution Rule

The backend implementation for this node should be a typed mock service only. It must return deterministic moderation-aware payloads and stable IDs but must not introduce database or MQ dependence in this node.

## 10. User Flows

### 10.1 Post Creation

`community -> create -> submit -> pending_review -> my posts`

### 10.2 Comment Creation

`post detail -> comment submit -> pending_review -> approved or rejected`

### 10.3 Moderation Review

`ops queue -> review card -> approve/reject/flag -> target moves to destination queue`

### 10.4 Author Recovery

`my posts -> rejected -> edit and resubmit`

Resubmission may remain front-end only in this node if needed, but the state presentation must clearly support that next step.

## 11. UI Behavior Rules

### 11.1 Status Badge Colors

- `pending_review`: warm yellow
- `approved`: green
- `rejected`: red
- `flagged`: orange
- `hidden`: neutral gray

### 11.2 Operations H5 Interaction

The operations review page must be optimized for mobile touch:

- filter chips at top
- stacked moderation cards
- bottom-sheet or inline action buttons
- context preview before decision

It must not mimic a desktop table UI.

## 12. Testing Strategy

### 12.1 Frontend

- resource coverage test for community bilingual resources
- moderation state utility tests if extraction is needed
- `npm run build`

### 12.2 Backend

- `MockCommunityServiceTest`

### 12.3 Delivery Chunks

This large node should be implemented as one externally-counted node but internally split into three sequential delivery blocks:

1. user community front-end rewrite
2. backend contract and moderation-aware API client integration
3. operations H5 moderation page

The overall project progress percentage only changes after all three internal blocks are complete.

## 13. README Update Rule

After the large node is complete:

- update root `README.md`
- reflect the latest completed community capabilities
- reflect the current Phase 1 node progress percentage
- keep the README product-facing and concise rather than turning it into an internal changelog

## 14. Completion Definition

This node is complete only when all of the following are true:

- user-side community pages are rebuilt on the new route and component structure
- community system copy and seeded content are bilingual
- moderation states are visible and coherent on user-facing pages
- backend typed contracts exist and are exercised by a mock community service
- operations H5 moderation page is implemented
- verification commands pass
- `README.md` is updated
- progress tracker is updated
