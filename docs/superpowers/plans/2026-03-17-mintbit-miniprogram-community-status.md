# MintBit Mini Program Community Status

> Date: 2026-03-17
> Scope: `miniprogram/pages/community`
> Status: Completed

## Completed In This Round

- Replaced the placeholder community tab with a native feed page:
  - `miniprogram/pages/community/index/*`
- Added the native composer page:
  - `miniprogram/pages/community/create/*`
- Added the native post detail page:
  - `miniprogram/pages/community/detail/*`
- Added the native “my posts” page:
  - `miniprogram/pages/community/my-posts/*`
- Added the mini program community runtime modules:
  - `miniprogram/services/community/content.js`
  - `miniprogram/services/community/api.js`
  - `miniprogram/services/community/session.js`
  - `miniprogram/services/community/index.js`
- Added community runtime tests:
  - `miniprogram/services/community/api.test.mjs`
  - `miniprogram/services/community/session.test.mjs`
  - `miniprogram/services/community/index.test.mjs`
- Updated app routing so the new community pages are part of the mini program host:
  - `miniprogram/app.json`
  - `miniprogram/config/routes.js`

## Verification

Executed successfully from the repository root:

```bash
node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs miniprogram/services/checkin/index.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/community/api.test.mjs
node --check miniprogram/services/assessment/question-bank-source.js miniprogram/services/assessment/question-bank.js miniprogram/services/assessment/api.js miniprogram/services/assessment/session.js miniprogram/services/assessment/ocr-content.js miniprogram/services/report/content.js miniprogram/services/report/timeline.js miniprogram/services/checkin/index.js miniprogram/services/community/content.js miniprogram/services/community/api.js miniprogram/services/community/session.js miniprogram/services/community/index.js miniprogram/pages/assessment/questionnaire/index.js miniprogram/pages/assessment/result-loading/index.js miniprogram/pages/report/index/index.js miniprogram/pages/report/ocr-upload/index.js miniprogram/pages/report/ocr-confirmation/index.js miniprogram/pages/report/timeline/index.js miniprogram/pages/checkin/index/index.js miniprogram/pages/community/index/index.js miniprogram/pages/community/create/index.js miniprogram/pages/community/detail/index.js miniprogram/pages/community/my-posts/index.js miniprogram/pages/home/index/index.js
node -e "const fs=require('fs'); const files=['miniprogram/app.json','miniprogram/pages/community/index/index.json','miniprogram/pages/community/create/index.json','miniprogram/pages/community/detail/index.json','miniprogram/pages/community/my-posts/index.json']; files.forEach((file)=>JSON.parse(fs.readFileSync(file,'utf8'))); console.log('json ok')"
```

Result:

- `30` mini program tests passed
- JavaScript syntax checks passed
- JSON config parsing passed

## Next Recommended Program

1. Migrate account-center deep pages and platform-level settings into the mini program
2. Then add the mini program operations moderation entry and finish WeChat DevTools acceptance
