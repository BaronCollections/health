# MintBit Mini Program Demo Cleanup Status

## Node

- Name: `mini program demo cleanup`
- Date: `2026-03-17`
- Status: `completed`
- Mini program progress after this node: `约 99%`

## Delivered

- Removed the unused TDesign example pages from `miniprogram/pages`, leaving only the MintBit business routes.
- Removed demo-only helper components, the old `miniprogram/demos` directory, the unused `miniprogram_npm` bundle, and miniapp-only residue files.
- Confirmed the remaining workspace tree now only contains MintBit business pages under `pages/`.
- Updated the repository front page and mini program README to reflect the cleanup.

## Verification

- `rg -n "demo-header|demo-block|pull-down-list|trd-privacy|tdesign.gtimg.com/mobile/demos" miniprogram -g '!miniprogram/miniprogram_npm/**'`
- `npm --prefix miniprogram run test:all`
- `npm --prefix miniprogram run check:syntax`
- `npm --prefix miniprogram run check:json`
- `npm --prefix miniprogram run check:project-config`

## Remaining

1. Open `miniprogram/` in WeChat DevTools and complete the final handoff checklist.
2. Submit the target release build from the verified environment.
