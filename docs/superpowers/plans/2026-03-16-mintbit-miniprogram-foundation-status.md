# MintBit Mini Program Foundation Status

> Date: 2026-03-16
> Scope: `miniprogram/`
> Status: In progress

## Completed In This Round

- Synced the external `VcGo` WeChat Mini Program host project into `health/miniprogram/`
- Normalized the foundation execution plan to repo-internal `miniprogram/...` paths
- Added a Node-based foundation harness for pure mini program modules
- Implemented and verified:
  - `miniprogram/config/env.js`
  - `miniprogram/config/routes.js`
  - `miniprogram/config/theme.js`
  - `miniprogram/services/request/client.js`
  - `miniprogram/services/auth/session.js`
  - `miniprogram/services/i18n/index.js`
  - `miniprogram/store/app-store.js`
  - `miniprogram/store/auth-store.js`
- Replaced the TDesign app shell with MintBit foundation config:
  - `miniprogram/app.js`
  - `miniprogram/app.json`
  - `miniprogram/app.wxss`
  - `miniprogram/custom-tab-bar/*`
- Added the first runnable MintBit native pages:
  - `miniprogram/pages/home/index/*`
  - `miniprogram/pages/profile/index/*`
  - `miniprogram/pages/auth/login/*`
  - `miniprogram/pages/auth/bind-phone/*`
  - `miniprogram/pages/report/index/*`
  - `miniprogram/pages/checkin/index/*`
  - `miniprogram/pages/community/index/*`
- Added real mini program auth contract adapters:
  - `backend/src/main/java/com/mintbit/health/controller/MiniProgramAuthController.java`
  - `backend/src/main/java/com/mintbit/health/service/MockMiniProgramAuthService.java`
  - `miniprogram/services/auth/api.js`
- Replaced the local auth placeholder flow with:
  - `wx.login -> /api/miniprogram/auth/login -> bind_required / authenticated`
  - `/api/miniprogram/auth/sms/send`
  - `/api/miniprogram/auth/bind`

## Verification

Executed successfully inside `miniprogram/`:

```bash
node --test services/request/client.test.mjs services/auth/session.test.mjs services/i18n/index.test.mjs store/app-store.test.mjs store/auth-store.test.mjs
node --test services/auth/api.test.mjs
node --check app.js custom-tab-bar/index.js components/mintbit-nav/index.js components/locale-switch/index.js components/fallback-state/index.js store/app-store.js store/auth-store.js i18n/runtime.js pages/home/index/index.js pages/profile/index/index.js pages/auth/login/index.js pages/auth/bind-phone/index.js pages/report/index/index.js pages/checkin/index/index.js pages/community/index/index.js
node -e "const fs=require('fs'); const files=['app.json','i18n/base.json','custom-tab-bar/index.json','components/mintbit-nav/index.json','components/locale-switch/index.json','components/fallback-state/index.json','pages/home/index/index.json','pages/profile/index/index.json','pages/auth/login/index.json','pages/auth/bind-phone/index.json','pages/report/index/index.json','pages/checkin/index/index.json','pages/community/index/index.json']; files.forEach((file)=>JSON.parse(fs.readFileSync(file,'utf8'))); console.log('json ok')"
mvn test -Dtest=MockMiniProgramAuthServiceTest
```

Result:

- `11` mini program Node tests passed
- JavaScript syntax checks passed
- JSON config parsing passed
- `3` backend auth service tests passed

## Remaining Before Foundation Is Complete

- Verify the shell routes, tabBar, and auth pages inside WeChat DevTools
- Decide whether to keep the mock backend auth behavior under `/api/miniprogram/auth/*` or replace it immediately with real WeChat openid exchange

## Next Recommended Program

1. Finish the remaining auth adapter work in `Mini Program Foundation`
2. Then move to `Assessment / OCR / Report`
