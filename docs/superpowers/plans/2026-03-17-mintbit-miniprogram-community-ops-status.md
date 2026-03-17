# MintBit Mini Program Community Ops Status

## Node

- Name: `mini program community ops moderation`
- Date: `2026-03-17`
- Status: `completed`
- Mini program progress after this node: `约 98%`

## Delivered

- Extended the mini program community API wrapper with moderation queue fetching and moderation action submission against the existing backend contract.
- Extended the local community overlay store so moderation decisions can update queue items plus mirrored post/comment statuses for user-visible fallbacks.
- Added the native moderation page at `pages/community/review/index` with status tabs, moderation cards, and action buttons.
- Added the admin entry from the existing release checklist page and gated the moderation page with the environment allowlist.
- Updated `README.md` so the repository front page reflects the new mini program capability and current migration progress.

## Verification

- `node --test miniprogram/services/community/api.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs`
- `node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs miniprogram/services/checkin/index.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/community/api.test.mjs miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs`
- `node --check miniprogram/pages/community/index/index.js miniprogram/pages/community/create/index.js miniprogram/pages/community/detail/index.js miniprogram/pages/community/my-posts/index.js miniprogram/pages/community/review/index.js miniprogram/pages/profile/index/index.js miniprogram/pages/profile/admin/release-checklist/index.js miniprogram/services/community/api.js miniprogram/services/community/index.js miniprogram/services/community/session.js`
- `node -e "const fs=require('fs'); ['miniprogram/app.json','miniprogram/pages/community/review/index.json'].forEach((p)=>JSON.parse(fs.readFileSync(p,'utf8'))); console.log('json ok');"`

## Remaining

1. Run the full WeChat DevTools interaction pass on the migrated pages.
2. Clean up final mini program release configuration and platform-specific publishing notes.
