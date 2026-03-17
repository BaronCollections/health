# MintBit Mini Program Media Attachments Status

> Date: 2026-03-17
> Scope: `miniprogram/`
> Status: Completed

## Completed In This Round

- Added a shared native image-picker runtime with `chooseMedia` priority and `chooseImage` fallback:
  - `miniprogram/services/media/image-picker.js`
  - `miniprogram/services/media/image-picker.test.mjs`
- Replaced the remaining community image placeholder flow with native image selection:
  - `miniprogram/pages/community/create/*`
  - `miniprogram/pages/community/index/*`
  - `miniprogram/pages/community/detail/*`
  - `miniprogram/pages/community/my-posts/*`
  - `miniprogram/services/community/content.js`
  - `miniprogram/services/community/index.js`
  - `miniprogram/services/community/session.js`
- Replaced the feedback screenshot placeholder with native screenshot selection and records echo:
  - `miniprogram/pages/profile/help/feedback/*`
  - `miniprogram/pages/profile/help/records/*`
  - `miniprogram/services/account/content.js`
  - `miniprogram/services/account/index.js`
- Updated the mini program release-facing docs and validation script entry:
  - `miniprogram/package.json`
  - `miniprogram/README.md`
  - `README.md`

## Verification

Executed successfully from the repository root:

```bash
node --test miniprogram/services/media/image-picker.test.mjs miniprogram/services/community/index.test.mjs miniprogram/services/community/api.test.mjs miniprogram/services/community/session.test.mjs miniprogram/services/account/index.test.mjs miniprogram/services/account/api.test.mjs miniprogram/services/account/state.test.mjs
npm --prefix miniprogram run test:all
npm --prefix miniprogram run check:syntax
npm --prefix miniprogram run check:json
npm --prefix miniprogram run check:project-config
```

Result:

- Shared media runtime tests passed
- Community and account targeted tests passed
- `55` mini program tests passed in the full suite
- JavaScript syntax checks passed
- JSON config parsing passed
- DevTools compile-entry validation passed

## Outcome

- The native mini program migration is now code-complete for the planned Phase 1 scope.
- Remaining work is limited to WeChat DevTools hand verification and release submission.
