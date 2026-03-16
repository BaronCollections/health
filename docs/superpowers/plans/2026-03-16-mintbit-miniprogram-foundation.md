# MintBit Mini Program Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the synced `VcGo` TDesign demo shell in `miniprogram/` with the MintBit native mini program foundation, including app shell, custom tab bar, bilingual runtime, request layer, and WeChat login plus phone binding.

**Architecture:** Keep `miniprogram` as the host mini program project, but replace demo route ownership with MintBit business routes. Foundation work is split into pure modules first, then app shell/config, then auth flow pages, then the first runnable home/profile shell pages. Pure modules should be tested with Node built-in tests before page wiring so the mini program runtime logic stays deterministic.

**Tech Stack:** Native WeChat Mini Program (`app.js`, `app.json`, `Page`, `Component`), WXML, WXSS, JavaScript modules, Node built-in test runner, WeChat `wx.login` / storage / request APIs, current MintBit backend contracts

---

## File Structure

### Mini program host root

The execution target for this plan is the existing mini program project:

- `miniprogram`

### New / replaced MintBit foundation files

- Create: `miniprogram/package.json`
- Create: `miniprogram/config/env.js`
- Create: `miniprogram/config/routes.js`
- Create: `miniprogram/config/theme.js`
- Create: `miniprogram/services/request/client.js`
- Create: `miniprogram/services/request/client.test.mjs`
- Create: `miniprogram/services/auth/session.js`
- Create: `miniprogram/services/auth/session.test.mjs`
- Create: `miniprogram/services/auth/api.js`
- Create: `miniprogram/services/i18n/index.js`
- Create: `miniprogram/services/i18n/index.test.mjs`
- Create: `miniprogram/store/app-store.js`
- Create: `miniprogram/store/auth-store.js`
- Create: `miniprogram/custom-tab-bar/index.js`
- Create: `miniprogram/custom-tab-bar/index.json`
- Create: `miniprogram/custom-tab-bar/index.wxml`
- Create: `miniprogram/custom-tab-bar/index.wxss`
- Create: `miniprogram/components/mintbit-nav/index.js`
- Create: `miniprogram/components/mintbit-nav/index.json`
- Create: `miniprogram/components/mintbit-nav/index.wxml`
- Create: `miniprogram/components/mintbit-nav/index.wxss`
- Create: `miniprogram/components/locale-switch/index.js`
- Create: `miniprogram/components/locale-switch/index.json`
- Create: `miniprogram/components/locale-switch/index.wxml`
- Create: `miniprogram/components/locale-switch/index.wxss`
- Create: `miniprogram/components/fallback-state/index.js`
- Create: `miniprogram/components/fallback-state/index.json`
- Create: `miniprogram/components/fallback-state/index.wxml`
- Create: `miniprogram/components/fallback-state/index.wxss`
- Create: `miniprogram/pages/auth/login/index.js`
- Create: `miniprogram/pages/auth/login/index.json`
- Create: `miniprogram/pages/auth/login/index.wxml`
- Create: `miniprogram/pages/auth/login/index.wxss`
- Create: `miniprogram/pages/auth/bind-phone/index.js`
- Create: `miniprogram/pages/auth/bind-phone/index.json`
- Create: `miniprogram/pages/auth/bind-phone/index.wxml`
- Create: `miniprogram/pages/auth/bind-phone/index.wxss`
- Create: `miniprogram/pages/home/index/index.js`
- Create: `miniprogram/pages/home/index/index.json`
- Create: `miniprogram/pages/home/index/index.wxml`
- Create: `miniprogram/pages/home/index/index.wxss`
- Create: `miniprogram/pages/profile/index/index.js`
- Create: `miniprogram/pages/profile/index/index.json`
- Create: `miniprogram/pages/profile/index/index.wxml`
- Create: `miniprogram/pages/profile/index/index.wxss`
- Modify: `miniprogram/app.js`
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/app.wxss`
- Modify: `miniprogram/i18n/base.json`
- Modify or remove from route ownership: `miniprogram/pages/home/home.*`

### Progress docs to update after execution

- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-03-16-phase1-node-progress.md`
- Modify: `docs/superpowers/specs/2026-03-16-mintbit-miniprogram-phase1-migration-design.md`

## Chunk 1: Runtime Foundation And Pure Modules

### Task 1: Add a minimal Node test harness for pure mini program modules

**Files:**
- Create: `miniprogram/package.json`
- Create: `miniprogram/services/request/client.test.mjs`
- Create: `miniprogram/services/auth/session.test.mjs`
- Create: `miniprogram/services/i18n/index.test.mjs`

- [ ] **Step 1: Write failing Node tests for request config resolution, auth session persistence, and locale fallback**
- [ ] **Step 2: Run `cd miniprogram && node --test services/request/client.test.mjs services/auth/session.test.mjs services/i18n/index.test.mjs` and confirm failure**
- [ ] **Step 3: Add a minimal `package.json` with `type: module` and helper scripts only if needed by the tests**
- [ ] **Step 4: Re-run the tests and confirm they still fail for missing implementation rather than module-loading issues**
- [ ] **Step 5: Commit the test harness setup**

### Task 2: Implement environment config, request client, locale runtime, and auth session helpers

**Files:**
- Create: `miniprogram/config/env.js`
- Create: `miniprogram/config/routes.js`
- Create: `miniprogram/config/theme.js`
- Create: `miniprogram/services/request/client.js`
- Create: `miniprogram/services/auth/session.js`
- Create: `miniprogram/services/i18n/index.js`

- [ ] **Step 1: Implement the smallest request-config module that resolves API base URL, timeout, and standard headers**
- [ ] **Step 2: Implement auth session helpers for token, bind-token, locale, and user-profile storage**
- [ ] **Step 3: Implement locale runtime helpers for `zh-CN / en` lookup and storage fallback**
- [ ] **Step 4: Run `cd miniprogram && node --test services/request/client.test.mjs services/auth/session.test.mjs services/i18n/index.test.mjs` and confirm pass**
- [ ] **Step 5: Commit the pure foundation modules**

## Chunk 2: App Shell Replacement

### Task 3: Replace demo route ownership with MintBit app shell configuration

**Files:**
- Modify: `miniprogram/app.js`
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/app.wxss`
- Modify: `miniprogram/i18n/base.json`
- Create: `miniprogram/store/app-store.js`
- Create: `miniprogram/store/auth-store.js`

- [ ] **Step 1: Define the MintBit route list and tabBar ownership in `config/routes.js` before editing `app.json`**
- [ ] **Step 2: Replace the current TDesign demo `pages` list with MintBit route ownership and register a custom tab bar**
- [ ] **Step 3: Update `app.js` so app launch hydrates locale and auth state instead of redirecting to the demo error page**
- [ ] **Step 4: Replace global WXSS and theme variables with MintBit brand tokens while keeping the mini program runtime stable**
- [ ] **Step 5: Commit the MintBit app shell configuration**

### Task 4: Build reusable shell components for navigation, locale switching, and fallback state

**Files:**
- Create: `miniprogram/custom-tab-bar/index.js`
- Create: `miniprogram/custom-tab-bar/index.json`
- Create: `miniprogram/custom-tab-bar/index.wxml`
- Create: `miniprogram/custom-tab-bar/index.wxss`
- Create: `miniprogram/components/mintbit-nav/index.js`
- Create: `miniprogram/components/mintbit-nav/index.json`
- Create: `miniprogram/components/mintbit-nav/index.wxml`
- Create: `miniprogram/components/mintbit-nav/index.wxss`
- Create: `miniprogram/components/locale-switch/index.js`
- Create: `miniprogram/components/locale-switch/index.json`
- Create: `miniprogram/components/locale-switch/index.wxml`
- Create: `miniprogram/components/locale-switch/index.wxss`
- Create: `miniprogram/components/fallback-state/index.js`
- Create: `miniprogram/components/fallback-state/index.json`
- Create: `miniprogram/components/fallback-state/index.wxml`
- Create: `miniprogram/components/fallback-state/index.wxss`

- [ ] **Step 1: Build a custom tab bar that mirrors MintBit’s five-entry H5 information architecture**
- [ ] **Step 2: Build a reusable top navigation component with title, back behavior, and brand styling**
- [ ] **Step 3: Build a locale-switch component that updates global locale state and storage**
- [ ] **Step 4: Build a reusable fallback-state component for `loading / empty / error` mini program pages**
- [ ] **Step 5: Commit the shared shell components**

## Chunk 3: WeChat Login And Account Binding

### Task 5: Add auth API adapters and auth-state orchestration

**Files:**
- Create: `miniprogram/services/auth/api.js`
- Modify: `miniprogram/store/auth-store.js`
- Modify: `miniprogram/services/request/client.js`
- Test: `miniprogram/services/auth/session.test.mjs`

- [ ] **Step 1: Extend the auth session test with failing coverage for `bindRequired` and authenticated session snapshots**
- [ ] **Step 2: Run `cd miniprogram && node --test services/auth/session.test.mjs` and confirm failure**
- [ ] **Step 3: Implement mini program auth API adapters for login, SMS send, bind, refresh, and `me`**
- [ ] **Step 4: Implement auth-store orchestration for `anonymous / bind_required / binding / authenticated`**
- [ ] **Step 5: Re-run `cd miniprogram && node --test services/auth/session.test.mjs` and confirm pass**
- [ ] **Step 6: Commit the auth adapters and store**

### Task 6: Build native login and bind-phone pages

**Files:**
- Create: `miniprogram/pages/auth/login/index.js`
- Create: `miniprogram/pages/auth/login/index.json`
- Create: `miniprogram/pages/auth/login/index.wxml`
- Create: `miniprogram/pages/auth/login/index.wxss`
- Create: `miniprogram/pages/auth/bind-phone/index.js`
- Create: `miniprogram/pages/auth/bind-phone/index.json`
- Create: `miniprogram/pages/auth/bind-phone/index.wxml`
- Create: `miniprogram/pages/auth/bind-phone/index.wxss`

- [ ] **Step 1: Build the login page so it triggers `wx.login`, calls the backend login adapter, and routes by auth state**
- [ ] **Step 2: Build the bind-phone page with phone entry, SMS send, code entry, and bind submit states**
- [ ] **Step 3: Add safe loading and error states using the shared fallback component**
- [ ] **Step 4: Verify the pages compile inside WeChat DevTools or with the mini program compiler after routing updates**
- [ ] **Step 5: Commit the login and binding pages**

## Chunk 4: First Runnable MintBit Shell Pages

### Task 7: Replace the current demo home page with MintBit home shell

**Files:**
- Create: `miniprogram/pages/home/index/index.js`
- Create: `miniprogram/pages/home/index/index.json`
- Create: `miniprogram/pages/home/index/index.wxml`
- Create: `miniprogram/pages/home/index/index.wxss`
- Modify or retire route ownership from: `miniprogram/pages/home/home.js`
- Modify or retire route ownership from: `miniprogram/pages/home/home.wxml`
- Modify or retire route ownership from: `miniprogram/pages/home/home.wxss`

- [ ] **Step 1: Build a bilingual MintBit home shell page with hero area, daily summary placeholders, and quick-entry cards**
- [ ] **Step 2: Wire the home shell to auth state and locale state so anonymous users are pushed to login when required**
- [ ] **Step 3: Add route stubs for future assessment/report/check-in/community entry navigation**
- [ ] **Step 4: Run the mini program in WeChat DevTools and verify `pages/home/index/index` is the new real home route**
- [ ] **Step 5: Commit the MintBit home shell**

### Task 8: Build the initial profile shell and document the foundation milestone

**Files:**
- Create: `miniprogram/pages/profile/index/index.js`
- Create: `miniprogram/pages/profile/index/index.json`
- Create: `miniprogram/pages/profile/index/index.wxml`
- Create: `miniprogram/pages/profile/index/index.wxss`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-03-16-mintbit-miniprogram-phase1-migration-design.md`
- Create: `docs/superpowers/plans/2026-03-16-mintbit-miniprogram-foundation-status.md`

- [ ] **Step 1: Build a bilingual profile shell page with account summary, locale switch, and placeholder entry cards for notifications/help/privacy**
- [ ] **Step 2: Add a foundation status document that records completed files, current route map, and what the next migration program depends on**
- [ ] **Step 3: Update the root README to mention the mini program foundation branch and current migration status**
- [ ] **Step 4: Run final foundation verification:
  `cd miniprogram && node --test services/request/client.test.mjs services/auth/session.test.mjs services/i18n/index.test.mjs`
  and verify the mini program opens with MintBit shell routes in WeChat DevTools**
- [ ] **Step 5: Commit the mini program foundation milestone**

## Execution Notes

- Work only inside `miniprogram` for mini program code changes.
- Keep the MintBit source-of-truth product docs in the `health` repository.
- Do not attempt full assessment, OCR, report, check-in, or community migration in this plan; those belong to later domain plans.
- When removing TDesign demo route ownership, prefer changing `app.json` route registration first and only then deleting or ignoring stale demo pages.
