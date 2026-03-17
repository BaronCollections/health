# MintBit Mini Program Assessment OCR Report Status

> Date: 2026-03-17
> Scope: `miniprogram/`
> Status: In progress

## Completed In This Round

- Added the mini program assessment runtime and session adapters:
  - `miniprogram/services/assessment/api.js`
  - `miniprogram/services/assessment/session.js`
- Added OCR upload and confirmation runtime helpers:
  - `miniprogram/services/assessment/ocr-content.js`
- Added the backend mock assessment flow contract used by the mini program:
  - `backend/src/main/java/com/mintbit/health/controller/AssessmentController.java`
  - `backend/src/main/java/com/mintbit/health/model/dto/assessment/AssessmentSessionResponse.java`
  - `backend/src/main/java/com/mintbit/health/service/MockAssessmentFlowService.java`
- Added assessment runtime tests:
  - `miniprogram/services/assessment/api.test.mjs`
  - `miniprogram/services/assessment/session.test.mjs`
  - `miniprogram/services/assessment/ocr-content.test.mjs`
  - `backend/src/test/java/com/mintbit/health/service/MockAssessmentFlowServiceTest.java`
- Added the first bilingual questionnaire slice for the native app:
  - `miniprogram/services/assessment/question-bank.js`
  - `miniprogram/services/assessment/question-bank.test.mjs`
  - `miniprogram/pages/assessment/questionnaire/*`
  - `miniprogram/pages/assessment/result-loading/*`
- Added the native OCR flow and report bridge:
  - `miniprogram/pages/report/ocr-upload/*`
  - `miniprogram/pages/report/ocr-confirmation/*`
  - `miniprogram/pages/report/index/*`
- Added the native report and timeline runtime:
  - `miniprogram/services/report/content.js`
  - `miniprogram/services/report/timeline.js`
  - `miniprogram/services/report/content.test.mjs`
  - `miniprogram/services/report/timeline.test.mjs`
  - `miniprogram/pages/report/timeline/*`
- Updated route and runtime wiring so the home page enters the new questionnaire flow:
  - `miniprogram/config/routes.js`
  - `miniprogram/i18n/runtime.js`
  - `miniprogram/pages/home/index/index.js`
  - `miniprogram/app.json`

## Verification

Executed successfully from the repository root unless otherwise noted:

```bash
node --test miniprogram/services/assessment/question-bank.test.mjs miniprogram/services/assessment/api.test.mjs miniprogram/services/assessment/session.test.mjs miniprogram/services/assessment/ocr-content.test.mjs miniprogram/services/report/content.test.mjs miniprogram/services/report/timeline.test.mjs
node --check miniprogram/services/assessment/question-bank.js miniprogram/services/assessment/api.js miniprogram/services/assessment/session.js miniprogram/services/assessment/ocr-content.js miniprogram/services/report/content.js miniprogram/services/report/timeline.js miniprogram/pages/assessment/questionnaire/index.js miniprogram/pages/assessment/result-loading/index.js miniprogram/pages/report/index/index.js miniprogram/pages/report/ocr-upload/index.js miniprogram/pages/report/ocr-confirmation/index.js miniprogram/pages/report/timeline/index.js miniprogram/pages/home/index/index.js
node -e "JSON.parse(require('fs').readFileSync('miniprogram/app.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/assessment/questionnaire/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/assessment/result-loading/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/report/index/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/report/ocr-upload/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/report/ocr-confirmation/index.json','utf8')); JSON.parse(require('fs').readFileSync('miniprogram/pages/report/timeline/index.json','utf8')); console.log('json ok')"
cd backend && mvn test -Dtest=MockAssessmentFlowServiceTest
```

Result:

- `16` mini program assessment, OCR, report, and timeline tests passed
- JavaScript syntax checks passed
- JSON config parsing passed
- `3` backend assessment service tests passed

## Remaining In This Program

- Extend the bilingual question bank from the first assessment slice to the full MintBit questionnaire set
- Expand the current report runtime into full Phase 1 detail depth after more question-bank data is ported

## Next Recommended Program

1. Implement `OCR upload and confirmation`
2. Then move to `report detail and timeline`
