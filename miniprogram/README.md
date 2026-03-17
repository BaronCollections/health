# MintBit Mini Program

Native WeChat Mini Program workspace for the MintBit Phase 1 migration.

## Open In WeChat DevTools

1. Open WeChat DevTools.
2. Import the project from `health/miniprogram`.
3. Keep the committed `appid` unless you need to switch to another app identity for a different environment.
4. If you need local-only overrides, edit `project.private.config.json` instead of the committed `project.config.json`.

## Local Validation

Run these before a DevTools verification pass or before pushing release-readiness changes:

```bash
npm --prefix miniprogram run test:all
npm --prefix miniprogram run check:syntax
npm --prefix miniprogram run check:json
npm --prefix miniprogram run check:project-config
```

## Key Runtime Config

- API base URL and admin allowlist live in `miniprogram/config/env.js`.
- Admin-only pages use the environment allowlist and the current WeChat-bound account profile.
- The native community moderation page is available at `/pages/community/review/index` for allowlisted admins.

## DevTools Compile Presets

The committed `project.config.json` now points at MintBit business routes instead of the old TDesign demo pages:

- Home
- Questionnaire
- Report
- OCR Upload
- Timeline
- Check-In
- Community
- Community Review
- Profile
- Login

## Manual Acceptance Checklist

Run this inside WeChat DevTools before a release build:

1. Login and phone binding succeed through the current backend contract.
2. Questionnaire can start, answer, resume, and reach the report loading state.
3. OCR upload accepts image/PDF files and the confirmation page can be opened.
4. Report, timeline, and check-in pages render with the expected saved state.
5. Community feed, create, detail, my posts, and moderation-state transitions still work.
6. Allowlisted admins can open the release checklist and native community moderation page.
7. Account center pages render and submit feedback/export/delete actions correctly.
8. Tab bar, locale switching, and admin-only entry visibility all remain correct after relaunch.

## Release Handoff Notes

- `project.config.json` is the shared DevTools baseline committed to the repo.
- `project.private.config.json` is for machine-local overrides and should stay environment-specific.
- If release configuration changes, update both this file and the repository root `README.md` so the project front page stays accurate.
