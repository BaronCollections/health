# MintBit Mini Program Assessment OCR Report Status

> Date: 2026-03-17
> Scope: `miniprogram/`
> Status: In progress

## Completed In This Round

- Added the mini program assessment runtime and session adapters:
  - `miniprogram/services/assessment/api.js`
  - `miniprogram/services/assessment/session.js`
- Added the backend mock assessment flow contract used by the mini program:
  - `backend/src/main/java/com/mintbit/health/controller/AssessmentController.java`
  - `backend/src/main/java/com/mintbit/health/model/dto/assessment/AssessmentSessionResponse.java`
  - `backend/src/main/java/com/mintbit/health/service/MockAssessmentFlowService.java`
- Added assessment runtime tests:
  - `miniprogram/services/assessment/api.test.mjs`
  - `miniprogram/services/assessment/session.test.mjs`
  - `backend/src/test/java/com/mintbit/health/service/MockAssessmentFlowServiceTest.java`
- Added the first bilingual questionnaire slice for the native app:
  - `miniprogram/services/assessment/question-bank.js`
  - `miniprogram/services/assessment/question-bank.test.mjs`
  - `miniprogram/pages/assessment/questionnaire/*`
  - `miniprogram/pages/assessment/result-loading/*`
- Updated route and runtime wiring so the home page enters the new questionnaire flow:
  - `miniprogram/config/routes.js`
  - `miniprogram/i18n/runtime.js`
  - `miniprogram/pages/home/index/index.js`
  - `miniprogram/app.json`

## Verification

Executed successfully from the repository root unless otherwise noted:

```bash
node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs
node --check miniprogram/services/assessment/question-bank.js miniprogram/pages/assessment/questionnaire/index.js miniprogram/pages/assessment/result-loading/index.js miniprogram/pages/home/index/index.js
node -e "JSON.parse(require('fs').readFileSync('miniprogram/app.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/assessment/questionnaire/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/assessment/result-loading/index.json','utf8')); console.log('json ok')"
cd backend && mvn test -Dtest=MockAssessmentFlowServiceTest
```

Result:

- `6` mini program assessment tests passed
- JavaScript syntax checks passed
- JSON config parsing passed
- `3` backend assessment service tests passed

## Remaining In This Program

- Extend the bilingual question bank from the first assessment slice to the full MintBit questionnaire set
- Build the native OCR upload flow with image and PDF support
- Build the OCR confirmation review page
- Build the report detail page and the history timeline page
- Reconnect the report tab entry to the native report detail runtime once the report slice is complete

## Next Recommended Program

1. Implement `OCR upload and confirmation`
2. Then move to `report detail and timeline`
