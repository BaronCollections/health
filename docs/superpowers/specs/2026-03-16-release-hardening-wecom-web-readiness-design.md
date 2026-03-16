# Release Hardening And WeCom/Web Readiness Design

> Version: 1.0
> Date: 2026-03-16
> Status: Approved for implementation planning
> Scope: Final Phase 1 engineering node for release hardening, administrator release diagnostics, WeCom Phase 2 skeleton, and Web dual-shell readiness

## 1. Purpose

This spec defines the final engineering node in the current `12`-node Phase 1 roadmap.

It completes Phase 1 by combining two goals under one delivery unit:

- establish a conservative release gate for the mobile H5 product
- add platform skeletons so enterprise WeCom and future Web rollout can continue without reworking current routes

The user selected the highest-conservatism release profile and confirmed:

- release hardening takes priority over platform expansion
- release checklist must exist both as docs and as an internal product page
- the internal checklist page is only visible to administrator accounts
- administrator access is controlled by environment-configured allowlists
- WeCom readiness should include a full Phase 2 skeleton, not just detection
- Web readiness should include a dual-shell foundation, not only responsive tweaks

This spec inherits the shared product and trust rules from:

- `docs/superpowers/specs/2026-03-14-mintbit-phase1-design.md`

## 2. Problem Statement

The repository now has the full user-facing Phase 1 H5 flow, but the final release gate is still missing.

Current gaps:

- release readiness is only implied by manual testing and scattered documentation
- no administrator-only in-product checklist page exists
- platform detection and fallback behavior are not centralized
- WeCom integration is only described in docs and not represented in code boundaries
- Web expansion has no dual-shell app structure yet
- several core surfaces still lack a single standard for `loading`, `empty`, `error`, and `retry`

The final node must remove these gaps without adding unrelated new business domains.

## 3. Scope

### 3.1 Included

- centralized runtime and environment diagnostics for `h5`, `wecom`, and `web`
- environment allowlist–based administrator gating
- administrator-only release checklist page under account center
- release checklist data model, grouped checks, manual confirmation persistence, and status aggregation
- product-level release documentation and README updates
- standard `loading / empty / error / retry` hardening for critical user surfaces
- centralized API fallback visibility for critical surfaces
- WeCom Phase 2 skeleton:
  - environment detection
  - auth adapter boundary
  - share adapter boundary
  - menu adapter boundary
  - message adapter boundary
  - callback route placeholder
- Web dual-shell foundation:
  - mobile shell
  - desktop shell
  - shared runtime container
  - route-preserving shell selection

### 3.2 Excluded

- real WeCom OAuth, JS-SDK signature service, or production tenant integration
- true desktop redesign of all business pages
- full analytics platform or BI reporting system
- fully automated E2E release validation
- production deployment automation

## 4. Delivery Strategy

The node follows `release gate first, platform skeleton second`.

Priority order:

1. release hardening and administrator release diagnostics
2. WeCom runtime skeleton and downgrade strategy
3. Web dual-shell readiness and responsive structure

The node only completes when all three are verified together.

## 5. Information Architecture

### 5.1 User-Facing Surfaces

Normal user information architecture remains stable.

Existing routes stay unchanged for product use:

- `/`
- `/questionnaire`
- `/report`
- `/ocr-upload`
- `/ocr-confirmation`
- `/checkin`
- `/community/*`
- `/profile/*`

### 5.2 Administrator Surface

New administrator-only route:

- `/profile/admin/release-checklist`

Rules:

- no bottom-nav exposure
- no exposure for non-admin users
- account-center card is visible only when the runtime allowlist marks the current identity as administrator
- direct route access for non-admin users must downgrade into the normal account center or show a blocked state

### 5.3 Platform Routes

WeCom runtime placeholders:

- `/auth/wecom/callback`

No user-facing routing split is introduced for Web. Web uses the same route map with a different shell and container strategy.

## 6. Runtime Architecture

### 6.1 Runtime Snapshot

A centralized runtime snapshot must expose:

- `platform`: `h5 | wecom | web`
- `environment`: `local | test | staging | prod`
- `currentIdentity`
- `isAdmin`
- `isEmbeddedWeCom`
- `isDesktopViewport`
- `apiBaseUrl`
- configured allowlist summary

This snapshot becomes the source of truth for:

- shell selection
- administrator entry visibility
- release checklist runtime items
- WeCom downgrade messaging

### 6.2 Administrator Gating

Administrator access is determined by environment-configured allowlists:

- `NEXT_PUBLIC_ADMIN_ALLOWLIST`
- optional fallback current identity via environment config if no login identity exists

Identity source order:

1. locally stored mock account identity
2. configured default account identity
3. empty/guest

The gate must be deterministic and visible in diagnostics output.

### 6.3 Platform Adapters

WeCom must be isolated behind adapters rather than page-level conditionals:

- `wecomAuthAdapter`
- `wecomShareAdapter`
- `wecomMenuAdapter`
- `wecomMessageAdapter`
- `wecomSdkAdapter`

Rules:

- non-WeCom environments return safe downgrade results
- unsupported capabilities never crash the page
- release checklist must surface whether the adapter is active, downgraded, or deferred

### 6.4 Shell Selection

Introduce two app shells:

- `MobileAppShell`
- `DesktopAppShell`

Shell selection rules:

- mobile H5 remains default
- desktop-width web chooses desktop shell
- WeCom embedded mobile still uses mobile shell
- business pages stay route-compatible and reusable across shells

## 7. Release Checklist Model

### 7.1 Groups

Checklist groups:

- `build`
- `runtime`
- `core_journey`
- `compliance`
- `platform_readiness`

### 7.2 Item Shape

Each checklist item exposes:

- `id`
- `group`
- `title`
- `status`: `pass | warning | fail | manual`
- `checkType`: `auto | manual | runtime | doc`
- `summary`
- `actionHref`
- `updatedAt`

### 7.3 Manual Confirmation

Some checks remain manual by design.

Manual confirmation rules:

- manual items can be marked confirmed by admins
- confirmation persists locally in the prototype
- confirmation cannot silently convert a `fail` auto-check into `pass`
- the page must distinguish manual confirmation from auto-check success

### 7.4 Aggregated Page Status

Page-level overall status:

- `ready`
- `needs_attention`
- `blocked`

Rules:

- any `fail` item makes the page `blocked`
- warnings or unresolved manual items make the page `needs_attention`
- all checks satisfied makes the page `ready`

## 8. Release Hardening Baseline

### 8.1 State Completeness

Critical surfaces must standardize:

- `loading`
- `empty`
- `error`
- `retry`

Coverage:

- home
- questionnaire
- report
- OCR upload
- OCR confirmation
- check-in
- community feed/detail/my posts/review
- account center
- release checklist page

### 8.2 Fallback Visibility

Critical surfaces that already support mock fallback must visibly expose when fallback is active.

The goal is not to block browsing, but to avoid silent degradation.

### 8.3 Compliance Reachability

The following must be reachable from account center and reflected in the release checklist:

- privacy policy
- user agreement
- OCR usage notes
- community visibility notes
- export request entry
- deletion request entry
- audit and operation transparency notes

### 8.4 Known Warnings

Known non-blockers are explicitly surfaced as deferred warnings:

- `baseline-browser-mapping` package staleness warning
- Next workspace root / multiple lockfile warning
- real WeCom auth/signature service not connected
- full desktop business redesign not started

## 9. Testing And Verification

Required verification areas:

- frontend runtime-state helper tests
- release checklist resource and status-model tests
- admin allowlist logic tests
- WeCom adapter downgrade tests
- frontend production build
- existing backend account contract tests if touched

The final node is only considered complete when:

- release checklist page works and is admin-gated
- critical hardening states are verified
- WeCom skeleton compiles and downgrades safely
- dual-shell app structure compiles
- docs and progress files are updated to `12 / 12 = 100%`

## 10. Documentation Deliverables

Both of the following are required:

- in-product administrator release checklist page
- written release documentation in repo docs/README

Documentation must include:

- release gate checklist
- known warnings
- rollback-oriented notes
- environment behavior notes
- WeCom readiness notes
- Web readiness notes

## 11. Success Criteria

This node succeeds when:

- MintBit Phase 1 has an explicit release gate instead of implicit readiness
- administrators can inspect release health inside the product
- critical surfaces have conservative state handling
- WeCom integration can start from adapter boundaries instead of retrofit work
- Web can expand from a dual-shell foundation without changing route structure
- roadmap progress can move from `11 / 12 = 92%` to `12 / 12 = 100%`
