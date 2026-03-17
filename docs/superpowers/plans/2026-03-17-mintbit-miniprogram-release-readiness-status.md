# MintBit Mini Program Release Readiness Status

## Node

- Name: `mini program release readiness`
- Date: `2026-03-17`
- Status: `completed`
- Mini program progress after this node: `约 99%`

## Delivered

- Replaced the stale TDesign-oriented DevTools project config with MintBit business compile presets.
- Added repo-local validation scripts for syntax, JSON integrity, and DevTools project compile entries.
- Expanded `miniprogram/package.json` with repeatable validation commands.
- Added `miniprogram/README.md` to document DevTools import, local validation, and final manual acceptance steps.
- Updated the repository homepage and the admin release checklist progress to match the new release-readiness state.

## Verification

- `npm --prefix miniprogram run test:all`
- `npm --prefix miniprogram run check:syntax`
- `npm --prefix miniprogram run check:json`
- `npm --prefix miniprogram run check:project-config`

## Remaining

1. Open `miniprogram/` in WeChat DevTools and walk the manual acceptance checklist.
2. Run the final submit/build flow for the target release environment.
