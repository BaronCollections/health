# Account Center Platformization Design

> Version: 1.0
> Date: 2026-03-16
> Status: Approved for implementation planning
> Scope: Phase 1 platform-level account center for notifications, help, privacy, security, audit, export, and deletion requests

## 1. Purpose

This spec defines the next large Phase 1 delivery unit after the community rewrite. It upgrades the current profile/settings area into a platform-level account center instead of adding more isolated settings pages.

This node covers:

- platformized account center home
- notification center with detail and batch-read flows
- help center with FAQ, support contact, feedback submission, and feedback records
- privacy and permission center
- data export and deletion request flows
- account security entry states
- user-facing audit and operation-log explanation

This spec inherits all Phase 1 product, brand, bilingual, and trust rules from:

- `docs/superpowers/specs/2026-03-14-mintbit-phase1-design.md`

## 2. Problem Statement

The repository currently has multiple profile/settings prototypes spread across:

- `frontend/src/components/morning-profile.tsx`
- `frontend/src/components/profile-page.tsx`
- `frontend/src/components/pricing-page.tsx`

These surfaces overlap in responsibility and leave several Phase 1 commitments incomplete:

- notifications are not a first-class product surface
- help and feedback are fragmented or placeholder-only
- privacy, permission, export, deletion, and audit explanations do not form a coherent trust center
- user account capabilities are not structured for later WeCom or Web reuse

The goal of this node is to establish a single stable account-center architecture that can support later platform expansion without redoing the information architecture.

## 3. Scope

### 3.1 Included

- rebuild `/profile` into a platform account center home
- add notifications list and detail routes
- add help center, feedback submission, and feedback record routes
- add privacy center, export request, deletion request, security, and audit explanation routes
- add bilingual structured resources for all system-owned copy and long-form text
- add typed mock contracts for notifications, feedback, export requests, and deletion requests if frontend integration needs them
- update root `README.md` after this node completes

### 3.2 Excluded

- real push delivery integration
- real ticketing system integration
- real file generation for export delivery
- actual destructive user deletion execution
- internal admin audit console
- enterprise WeCom runtime integration

## 4. Product Surfaces

### 4.1 Account Center Routes

- `/profile`
  - platform account center home
- `/profile/notifications`
  - notification center
- `/profile/notifications/[id]`
  - notification detail
- `/profile/help`
  - help center home
- `/profile/help/feedback`
  - submit feedback
- `/profile/help/records`
  - feedback records
- `/profile/privacy`
  - privacy and permissions home
- `/profile/privacy/export`
  - data export request
- `/profile/privacy/delete-request`
  - deletion request
- `/profile/security`
  - account security and preference controls
- `/profile/audit-log`
  - user-facing audit and operation-log explanation

### 4.2 Account Center Home Sections

- `messages`
  - unread summary by type
- `help_and_support`
  - FAQ, support, feedback
- `privacy_and_permissions`
  - policy and authorization explanation
- `data_and_audit`
  - export, deletion, audit visibility
- `account_and_preferences`
  - language, notifications, cache, security

The home page should be a dashboard and routing surface, not a long mixed settings form.

## 5. Core State Model

### 5.1 Notifications

Notification types:

- `system`
- `community`
- `checkin`

Notification states:

- `unread`
- `read`
- `archived`

Rules:

- entering detail marks a notification as `read`
- batch read is supported
- detail view does not auto-archive

### 5.2 Feedback Records

Feedback states:

- `draft`
- `submitted`
- `in_review`
- `responded`
- `closed`

Rules:

- user sees their own request state and visible reply only
- internal handling workflow is not exposed as an admin console

### 5.3 Export Requests

Export states:

- `idle`
- `requested`
- `generating`
- `ready`
- `expired`
- `failed`

Rules:

- Phase 1 may use deterministic mock data
- the UI must still represent the full request lifecycle

### 5.4 Deletion Requests

Deletion states:

- `idle`
- `submitted`
- `cooling_off`
- `confirmed`
- `executed`
- `rejected`

Rules:

- deletion request must show impact scope
- deletion request must show a cooling-off explanation
- withdrawal must be visible before execution

### 5.5 Permissions And Security

Permission states:

- notification preferences per category
- OCR authorization: `granted` / `revoked`
- account security: `bound` / `unbound` / `risk_notice`

The account center explains trust boundaries and user-visible controls. It must not expose internal moderation bypasses or internal audit tools.

## 6. Information Architecture Rules

### 6.1 Profile Home

The account center home must become the single trusted entry point for account capabilities. Existing scattered settings entry points should be redirected into this structure over time.

The home page should display:

- account summary
- unread notification counts
- open feedback item count
- current export request status
- current deletion request status
- quick links to trust-related pages

### 6.2 Notification Center

The notification center must support:

- category filtering
- unread/read cues
- batch mark as read
- drill-down into detail
- action links back to report, check-in, or community when relevant

### 6.3 Help Center

The help center must support:

- FAQ list and categories
- support-contact entry
- feedback submission form
- feedback records with visible statuses

### 6.4 Privacy And Trust Center

The privacy center must separate:

- explanation pages
- user-controlled settings
- high-risk request flows

Long-form explanation pages should not be mixed with destructive-action forms on the same screen.

## 7. Bilingual Strategy

### 7.1 Must Be Bilingual

- notification templates
- notification detail framing
- help center navigation
- FAQ content
- feedback form labels and record states
- privacy policy and user agreement titles and bodies
- OCR data-use explanation
- community visibility explanation
- export and deletion request guidance
- audit explanation

### 7.2 Resource Strategy

- short shared labels may remain in global `messages`
- notifications, FAQ, privacy content, feedback state labels, export/delete descriptions, and audit text should live in dedicated locale resources
- pages should consume typed helpers instead of hardcoded copy

### 7.3 Must Not Be Auto-Translated

- user nickname
- user feedback content
- user-generated community excerpts referenced by notifications

## 8. Frontend Architecture

### 8.1 Route Files

- `frontend/src/app/profile/page.tsx`
- `frontend/src/app/profile/notifications/page.tsx`
- `frontend/src/app/profile/notifications/[id]/page.tsx`
- `frontend/src/app/profile/help/page.tsx`
- `frontend/src/app/profile/help/feedback/page.tsx`
- `frontend/src/app/profile/help/records/page.tsx`
- `frontend/src/app/profile/privacy/page.tsx`
- `frontend/src/app/profile/privacy/export/page.tsx`
- `frontend/src/app/profile/privacy/delete-request/page.tsx`
- `frontend/src/app/profile/security/page.tsx`
- `frontend/src/app/profile/audit-log/page.tsx`

### 8.2 Suggested Components

- `frontend/src/components/account/account-home.tsx`
- `frontend/src/components/account/notifications-page.tsx`
- `frontend/src/components/account/notification-detail-page.tsx`
- `frontend/src/components/account/help-center-page.tsx`
- `frontend/src/components/account/feedback-form-page.tsx`
- `frontend/src/components/account/feedback-records-page.tsx`
- `frontend/src/components/account/privacy-center-page.tsx`
- `frontend/src/components/account/export-request-page.tsx`
- `frontend/src/components/account/delete-request-page.tsx`
- `frontend/src/components/account/security-page.tsx`
- `frontend/src/components/account/audit-log-page.tsx`

### 8.3 Frontend Data Layer

- `frontend/src/lib/account/types.ts`
- `frontend/src/lib/account/index.ts`
- `frontend/src/lib/account/mock-content.json`
- `frontend/src/lib/account/mock-content.en.json`
- `frontend/src/lib/account-api/types.ts`
- `frontend/src/lib/account-api/client.ts`

The node should move away from embedding account settings logic directly inside large prototype components.

## 9. Backend Contract Direction

If the frontend integration requires live typed mock calls, add deterministic mock contracts for:

- notifications list
- notification detail
- feedback create
- feedback records
- export request
- deletion request

The backend implementation in this node should remain typed mock service only. Real delivery, real ticketing, and real destructive execution stay out of scope.

## 10. Interaction Rules

### 10.1 Notification Detail

A notification detail page must include:

- title
- time
- source
- body
- related action CTA when relevant

### 10.2 Feedback Submission

Suggested fields:

- issue category
- description
- optional screenshot placeholder
- contact information

### 10.3 High-Risk Actions

The following actions require explicit confirmation framing:

- export request
- deletion request
- OCR authorization revoke

### 10.4 Audit Explanation

`/profile/audit-log` should be user-facing trust documentation plus visible request summaries, not an internal log-table UI.

## 11. Delivery Structure

This node should be implemented as one external engineering node but internally split into four delivery chunks:

1. account-center platform shell
2. notifications center
3. help and feedback center
4. privacy, security, export, deletion, and audit center

Progress percentage changes only after all four internal chunks are complete.

## 12. Testing Strategy

### 12.1 Frontend

- bilingual coverage test for account resources
- notification state utility tests
- feedback state tests
- export request state tests
- deletion request state tests
- `npm run build`

### 12.2 Backend

If mock contracts are added:

- notification mock service tests
- feedback mock service tests
- export and deletion request mock service tests

## 13. README Update Rule

After this node is complete:

- update root `README.md`
- reflect the platform account center capabilities
- reflect the new Phase 1 progress percentage
- keep README concise and product-facing

## 14. Completion Definition

This node is complete only when all of the following are true:

- `/profile` is restructured as the platform account center home
- notification center and detail flows are implemented
- help center, feedback submission, and feedback records are implemented
- privacy center, export request, deletion request, security, and audit explanation flows are implemented
- system copy and long-form text are fully bilingual
- verification commands pass
- `README.md` is updated
- progress tracker is updated from `10 / 12 = 83%` to `11 / 12 = 92%`
