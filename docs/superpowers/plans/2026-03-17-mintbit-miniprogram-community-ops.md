# MintBit Mini Program Community Ops Moderation

## Goal

Add the native mini program operations moderation flow so allowlisted admins can review community posts and comments from the phone-first account/admin entry, while user-facing community surfaces continue to reflect moderation state changes immediately.

## Scope

- Extend the mini program community API wrapper to fetch moderation queues and submit moderation actions against the existing backend contract.
- Extend the local community overlay store so moderation decisions can update queue state and user-visible post/comment statuses even when the API falls back.
- Add a native admin-only moderation page with queue filters, moderation cards, and action buttons.
- Add an admin entry from the existing account/admin area without exposing the review page to normal users.
- Update the homepage README after the node lands so the repo front page stays current.

## Execution Order

1. Write failing tests for moderation queue API wrappers, review view-model shaping, and local moderation overlay behavior.
2. Extend the community runtime with moderation queue merging, action application, and admin helpers.
3. Build the native moderation page and register its route.
4. Add the admin entry from the release checklist page and gate the moderation page with the environment allowlist.
5. Re-run the mini program test suite, syntax checks, and JSON validation, then update README and node status docs.

## Verification

- `node --test miniprogram/services/community/api.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs`
- `node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs miniprogram/services/checkin/index.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/community/api.test.mjs miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs`
- `node --check miniprogram/pages/community/index/index.js miniprogram/pages/community/create/index.js miniprogram/pages/community/detail/index.js miniprogram/pages/community/my-posts/index.js miniprogram/pages/community/review/index.js miniprogram/pages/profile/admin/release-checklist/index.js miniprogram/services/community/api.js miniprogram/services/community/index.js miniprogram/services/community/session.js`
- `node -e "const fs=require('fs'); ['miniprogram/app.json','miniprogram/pages/community/review/index.json'].forEach((p)=>JSON.parse(fs.readFileSync(p,'utf8'))); console.log('json ok');"`
