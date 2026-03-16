# MintBit Release Checklist

This document mirrors the terminology used in the in-product administrator route:

- `/profile/admin/release-checklist`

It is the conservative release gate for the current Phase 1 H5 product.

## Overall Status

The release checklist uses three aggregate states:

- `Ready`
- `Needs review`
- `Blocked`

Rules:

- any unresolved blocked item keeps the overall release state at `Blocked`
- any unresolved manual review keeps the overall release state at `Needs review`
- only fully satisfied groups move the overall release state to `Ready`

## Checklist Groups

### 1. Build And Base Configuration

- frontend production build passes
- account and release-check resources keep full bilingual coverage
- administrator allowlist is manually reviewed for the current environment

### 2. Core User Journeys

- assessment to report flow is smoke-checked
- OCR upload and confirmation flow is smoke-checked
- saved plan and check-in persistence is smoke-checked

### 3. Compliance And Trust Entry Points

- privacy, export, deletion, and audit routes are exposed
- help center, feedback form, and feedback records are exposed
- non-admin identities do not see the release-check entry

### 4. Platform Readiness

- WeCom callback placeholder and downgrade-safe adapter boundary exist
- Web desktop dual-shell foundation exists without breaking current H5 routes

## Known Non-Blocking Warnings

These warnings are currently surfaced both in docs and in the administrator checklist page:

- Next.js workspace-root warning caused by multiple lockfiles
- `baseline-browser-mapping` data staleness warning during build

They are visible engineering debts, not hidden blockers.

## Administrator Gate

Administrator visibility is controlled by environment allowlist configuration:

- `NEXT_PUBLIC_ADMIN_ALLOWLIST`
- optional `NEXT_PUBLIC_DEFAULT_ACCOUNT_IDENTITY`

Identity is resolved from:

1. locally stored mock account identity
2. default account identity from environment
3. guest / empty identity

## Phase 2 Readiness Boundaries

Current Phase 1 code only provides skeleton boundaries for later work:

- WeCom callback placeholder route: `/auth/wecom/callback`
- WeCom downgrade-safe adapter layer: `frontend/src/lib/platform/wecom.ts`
- Web shell selection and desktop frame: `frontend/src/components/shells/*`

Real WeCom OAuth, JS-SDK wiring, and a full desktop redesign remain future work.
