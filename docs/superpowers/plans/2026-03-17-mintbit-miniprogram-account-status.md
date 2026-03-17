# MintBit Mini Program Account Status

> Date: 2026-03-17
> Scope: `miniprogram/pages/profile` and `miniprogram/services/account`
> Status: Completed

## Completed In This Round

- Added the mini program account runtime:
  - `miniprogram/services/account/content.js`
  - `miniprogram/services/account/api.js`
  - `miniprogram/services/account/state.js`
  - `miniprogram/services/account/index.js`
  - `miniprogram/services/account/runtime.js`
- Added account runtime tests:
  - `miniprogram/services/account/api.test.mjs`
  - `miniprogram/services/account/state.test.mjs`
  - `miniprogram/services/account/index.test.mjs`
- Replaced the profile shell with a native account dashboard:
  - `miniprogram/pages/profile/index/*`
- Added native notification pages:
  - `miniprogram/pages/profile/notifications/*`
- Added native help and feedback pages:
  - `miniprogram/pages/profile/help/*`
- Added native privacy, export, and delete request pages:
  - `miniprogram/pages/profile/privacy/*`
- Added native security and audit pages:
  - `miniprogram/pages/profile/security/*`
  - `miniprogram/pages/profile/audit-log/*`
- Added a mini program admin release checklist page with environment allowlist awareness:
  - `miniprogram/pages/profile/admin/release-checklist/*`
- Updated route and host configuration:
  - `miniprogram/config/routes.js`
  - `miniprogram/config/env.js`
  - `miniprogram/app.json`

## Verification

Executed successfully from the repository root:

```bash
node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs miniprogram/services/checkin/index.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/community/api.test.mjs miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs miniprogram/services/account/index.test.mjs
node --check miniprogram/services/assessment/question-bank-source.js miniprogram/services/assessment/question-bank.js miniprogram/services/assessment/api.js miniprogram/services/assessment/session.js miniprogram/services/assessment/ocr-content.js miniprogram/services/report/content.js miniprogram/services/report/timeline.js miniprogram/services/checkin/index.js miniprogram/services/community/content.js miniprogram/services/community/api.js miniprogram/services/community/session.js miniprogram/services/community/index.js miniprogram/services/account/content.js miniprogram/services/account/api.js miniprogram/services/account/state.js miniprogram/services/account/index.js miniprogram/services/account/runtime.js miniprogram/pages/assessment/questionnaire/index.js miniprogram/pages/assessment/result-loading/index.js miniprogram/pages/report/index/index.js miniprogram/pages/report/ocr-upload/index.js miniprogram/pages/report/ocr-confirmation/index.js miniprogram/pages/report/timeline/index.js miniprogram/pages/checkin/index/index.js miniprogram/pages/community/index/index.js miniprogram/pages/community/create/index.js miniprogram/pages/community/detail/index.js miniprogram/pages/community/my-posts/index.js miniprogram/pages/home/index/index.js miniprogram/pages/profile/index/index.js miniprogram/pages/profile/notifications/index.js miniprogram/pages/profile/notifications/detail/index.js miniprogram/pages/profile/help/index.js miniprogram/pages/profile/help/feedback/index.js miniprogram/pages/profile/help/records/index.js miniprogram/pages/profile/privacy/index.js miniprogram/pages/profile/privacy/export/index.js miniprogram/pages/profile/privacy/delete-request/index.js miniprogram/pages/profile/security/index.js miniprogram/pages/profile/audit-log/index.js miniprogram/pages/profile/admin/release-checklist/index.js
node -e "const fs=require('fs'); const files=['miniprogram/app.json','miniprogram/pages/assessment/questionnaire/index.json','miniprogram/pages/assessment/result-loading/index.json','miniprogram/pages/report/index/index.json','miniprogram/pages/report/ocr-upload/index.json','miniprogram/pages/report/ocr-confirmation/index.json','miniprogram/pages/report/timeline/index.json','miniprogram/pages/community/index/index.json','miniprogram/pages/community/create/index.json','miniprogram/pages/community/detail/index.json','miniprogram/pages/community/my-posts/index.json','miniprogram/pages/profile/index/index.json','miniprogram/pages/profile/notifications/index.json','miniprogram/pages/profile/notifications/detail/index.json','miniprogram/pages/profile/help/index.json','miniprogram/pages/profile/help/feedback/index.json','miniprogram/pages/profile/help/records/index.json','miniprogram/pages/profile/privacy/index.json','miniprogram/pages/profile/privacy/export/index.json','miniprogram/pages/profile/privacy/delete-request/index.json','miniprogram/pages/profile/security/index.json','miniprogram/pages/profile/audit-log/index.json','miniprogram/pages/profile/admin/release-checklist/index.json']; files.forEach((file)=>JSON.parse(fs.readFileSync(file,'utf8'))); console.log('json ok')"
```

Result:

- `46` mini program tests passed
- JavaScript syntax checks passed
- JSON config parsing passed

## Next Recommended Program

1. Migrate the mini program community operations review flow and tighten the admin-only entry model
2. Finish WeChat DevTools acceptance, runtime smoke testing, and release configuration cleanup
