# MintBit Milestone 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 foundation for MintBit mobile H5: quality harness, MintBit brand shell, full bilingual application framework, and the first account/profile/permission scaffolding required for later modules.

**Architecture:** Keep the foundation mobile-first and app-router-native inside `frontend/`, with a lightweight internal i18n layer, a reusable app shell, and small isolated state modules that can later support questionnaire, plan, check-in, and community flows. Start by making the codebase testable and lintable, then layer UI shell, localization, and gating primitives in that order.

**Tech Stack:** Next.js 14 app router, React 18, TypeScript, Tailwind CSS, Zustand, Axios, Vitest, Testing Library, ESLint

---

## File Structure Map

### Frontend quality and test infrastructure
- Create: `frontend/.eslintrc.json`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/vitest.setup.ts`
- Create: `frontend/src/test/render.tsx`
- Create: `frontend/src/test/setup.d.ts` if needed for custom matchers typing
- Modify: `frontend/package.json`
- Modify: `frontend/tsconfig.json`

### App foundation and shell
- Create: `frontend/src/config/app.ts`
- Create: `frontend/src/components/app-shell/app-shell.tsx`
- Create: `frontend/src/components/app-shell/app-nav.tsx`
- Create: `frontend/src/components/app-shell/language-switcher.tsx`
- Create: `frontend/src/components/app-shell/xiaoya-orb.tsx`
- Create: `frontend/src/components/app-shell/gated-action.tsx`
- Create: `frontend/src/components/home/home-screen.tsx`
- Create: `frontend/src/components/plan/plan-screen.tsx`
- Create: `frontend/src/components/check-in/check-in-screen.tsx`
- Create: `frontend/src/components/community/community-screen.tsx`
- Create: `frontend/src/components/me/me-screen.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/styles/globals.css`
- Modify: `frontend/tailwind.config.ts`

### Routing and page scaffolding
- Create: `frontend/src/app/plan/page.tsx`
- Create: `frontend/src/app/check-in/page.tsx`
- Create: `frontend/src/app/community/page.tsx`
- Create: `frontend/src/app/me/page.tsx`

### Internationalization
- Create: `frontend/src/i18n/types.ts`
- Create: `frontend/src/i18n/messages/zh-CN.ts`
- Create: `frontend/src/i18n/messages/en.ts`
- Create: `frontend/src/i18n/messages/index.ts`
- Create: `frontend/src/i18n/locale-context.tsx`
- Create: `frontend/src/i18n/use-locale.ts`

### Auth, gating, analytics foundations
- Create: `frontend/src/lib/analytics.ts`
- Create: `frontend/src/lib/storage.ts`
- Create: `frontend/src/lib/permissions.ts`
- Modify: `frontend/src/stores/auth.ts`
- Modify: `frontend/src/lib/api.ts`

### Tests
- Create: `frontend/src/components/app-shell/app-shell.test.tsx`
- Create: `frontend/src/i18n/locale-context.test.tsx`
- Create: `frontend/src/components/app-shell/gated-action.test.tsx`
- Create: `frontend/src/lib/permissions.test.ts`
- Create: `frontend/src/lib/analytics.test.ts`

---

## Chunk 1: Quality Harness

### Task 1: Make `frontend` lint non-interactive and add a real test runner

**Files:**
- Create: `frontend/.eslintrc.json`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/vitest.setup.ts`
- Create: `frontend/src/test/render.tsx`
- Modify: `frontend/package.json`
- Modify: `frontend/tsconfig.json`
- Test: `frontend/src/lib/utils.test.ts`

- [x] **Step 1: Write the failing test**

Create `frontend/src/lib/utils.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('merges conditional classes and tailwind conflicts', () => {
    expect(cn('px-2', false && 'hidden', 'px-4', 'text-sm')).toBe('px-4 text-sm');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/lib/utils.test.ts`
Expected: FAIL because the project has no test script/config yet.

- [x] **Step 3: Add minimal quality harness**

Implement:
- `frontend/.eslintrc.json` using `next/core-web-vitals`
- `frontend/package.json` scripts:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
- add dev dependencies:
  - `vitest`
  - `jsdom`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `@testing-library/user-event`
- `frontend/vitest.config.ts` with jsdom environment and path alias support
- `frontend/vitest.setup.ts` importing `@testing-library/jest-dom`
- `frontend/src/test/render.tsx` exporting a minimal wrapper render helper
- `frontend/tsconfig.json` include vitest and jest-dom types as needed

- [x] **Step 4: Run the targeted test and lint**

Run:
- `npm run test -- src/lib/utils.test.ts`
- `npm run lint`

Expected:
- utils test PASS
- lint exits without interactive setup prompt

- [x] **Step 5: Commit**

```bash
git add frontend/.eslintrc.json frontend/vitest.config.ts frontend/vitest.setup.ts frontend/src/test/render.tsx frontend/src/lib/utils.test.ts frontend/package.json frontend/package-lock.json frontend/tsconfig.json
git commit -m "build: add frontend quality harness"
```

---

## Chunk 2: MintBit App Shell

### Task 2: Add the mobile app shell and route skeleton for the five primary entries

**Files:**
- Create: `frontend/src/config/app.ts`
- Create: `frontend/src/components/app-shell/app-shell.tsx`
- Create: `frontend/src/components/app-shell/app-nav.tsx`
- Create: `frontend/src/components/app-shell/xiaoya-orb.tsx`
- Create: `frontend/src/components/home/home-screen.tsx`
- Create: `frontend/src/components/plan/plan-screen.tsx`
- Create: `frontend/src/components/check-in/check-in-screen.tsx`
- Create: `frontend/src/components/community/community-screen.tsx`
- Create: `frontend/src/components/me/me-screen.tsx`
- Create: `frontend/src/app/plan/page.tsx`
- Create: `frontend/src/app/check-in/page.tsx`
- Create: `frontend/src/app/community/page.tsx`
- Create: `frontend/src/app/me/page.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/styles/globals.css`
- Modify: `frontend/tailwind.config.ts`
- Test: `frontend/src/components/app-shell/app-shell.test.tsx`

- [x] **Step 1: Write the failing shell test**

Create `frontend/src/components/app-shell/app-shell.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/render';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  it('renders five primary navigation entries', () => {
    renderWithProviders(<AppShell currentPath="/" title="MintBit"><div>content</div></AppShell>);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /plan/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /check-in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /community/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /me/i })).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/app-shell/app-shell.test.tsx`
Expected: FAIL because `AppShell` does not exist yet.

- [x] **Step 3: Implement the minimal MintBit shell**

Implement:
- `frontend/src/config/app.ts` with the five nav entries and route metadata
- `AppShell` and `AppNav` with mobile-safe layout, bottom nav, page title slot, and Xiaoya placeholder area
- `xiaoya-orb.tsx` as a lightweight animated placeholder component
- route pages for `/`, `/plan`, `/check-in`, `/community`, `/me`
- screen components with minimal copy placeholders aligned to the approved IA
- brand token updates in `globals.css` and `tailwind.config.ts` using MintBit green `#6DB578`

- [x] **Step 4: Run tests and build**

Run:
- `npm run test -- src/components/app-shell/app-shell.test.tsx`
- `npm run build`

Expected:
- app shell test PASS
- frontend build PASS

- [x] **Step 5: Commit**

```bash
git add frontend/src/config/app.ts frontend/src/components/app-shell frontend/src/components/home frontend/src/components/plan frontend/src/components/check-in frontend/src/components/community frontend/src/components/me frontend/src/app/layout.tsx frontend/src/app/page.tsx frontend/src/app/plan/page.tsx frontend/src/app/check-in/page.tsx frontend/src/app/community/page.tsx frontend/src/app/me/page.tsx frontend/src/styles/globals.css frontend/tailwind.config.ts
git commit -m "feat: add MintBit app shell foundation"
```

---

## Chunk 3: Full-App Localization Foundation

### Task 3: Add global locale state, message dictionaries, and language switching

**Files:**
- Create: `frontend/src/i18n/types.ts`
- Create: `frontend/src/i18n/messages/zh-CN.ts`
- Create: `frontend/src/i18n/messages/en.ts`
- Create: `frontend/src/i18n/messages/index.ts`
- Create: `frontend/src/i18n/locale-context.tsx`
- Create: `frontend/src/i18n/use-locale.ts`
- Create: `frontend/src/components/app-shell/language-switcher.tsx`
- Modify: `frontend/src/components/app-shell/app-shell.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Test: `frontend/src/i18n/locale-context.test.tsx`

- [x] **Step 1: Write the failing locale test**

Create `frontend/src/i18n/locale-context.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/render';
import { LanguageSwitcher } from '@/components/app-shell/language-switcher';
import { useLocale } from './use-locale';

function Probe() {
  const { locale, t } = useLocale();
  return (
    <>
      <span>{locale}</span>
      <span>{t('nav.home')}</span>
      <LanguageSwitcher />
    </>
  );
}

describe('locale context', () => {
  it('switches between zh-CN and en and persists the active locale', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Probe />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /english/i }));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/i18n/locale-context.test.tsx`
Expected: FAIL because locale provider and switcher do not exist yet.

- [x] **Step 3: Implement the minimal i18n foundation**

Implement:
- locale types and supported locales
- controlled dictionaries for `zh-CN` and `en`
- locale context provider with localStorage persistence
- `useLocale()` hook with `t()` lookup
- `LanguageSwitcher` component
- root layout/provider wiring
- app shell wiring for localized nav labels and key page strings

- [x] **Step 4: Run focused verification**

Run:
- `npm run test -- src/i18n/locale-context.test.tsx`
- `npm run build`

Expected:
- locale test PASS
- build PASS

- [x] **Step 5: Commit**

```bash
git add frontend/src/i18n frontend/src/components/app-shell/language-switcher.tsx frontend/src/components/app-shell/app-shell.tsx frontend/src/app/layout.tsx
git commit -m "feat: add MintBit localization foundation"
```

---

## Chunk 4: Auth, Gating, Permissions, and Analytics Foundation

### Task 4: Add guest-aware gating and baseline profile/permission scaffolding

**Files:**
- Create: `frontend/src/lib/storage.ts`
- Create: `frontend/src/lib/permissions.ts`
- Create: `frontend/src/lib/analytics.ts`
- Create: `frontend/src/components/app-shell/gated-action.tsx`
- Modify: `frontend/src/stores/auth.ts`
- Modify: `frontend/src/lib/api.ts`
- Modify: `frontend/src/components/me/me-screen.tsx`
- Test: `frontend/src/components/app-shell/gated-action.test.tsx`
- Test: `frontend/src/lib/permissions.test.ts`
- Test: `frontend/src/lib/analytics.test.ts`

- [x] **Step 1: Write the failing permission and gating tests**

Create:
- `frontend/src/components/app-shell/gated-action.test.tsx`
- `frontend/src/lib/permissions.test.ts`
- `frontend/src/lib/analytics.test.ts`

Tests should assert:
- guests trigger fallback behavior on protected actions
- registered users can pass protected actions
- permission helpers clearly separate public, authenticated, and owner-only intents
- analytics helper no-ops safely when no tracker is attached and records standard event payloads when one is

- [x] **Step 2: Run tests to verify they fail**

Run:
- `npm run test -- src/components/app-shell/gated-action.test.tsx`
- `npm run test -- src/lib/permissions.test.ts`
- `npm run test -- src/lib/analytics.test.ts`

Expected:
- all fail for missing modules/behavior

- [x] **Step 3: Implement minimal auth and permission foundation**

Implement:
- storage helpers for safe browser persistence
- auth store cleanup with persisted token and user model accessors
- permission helpers for `public`, `authenticated`, `owner`
- `GatedAction` wrapper for later questionnaire/save/check-in/community entry points
- baseline analytics event helper
- API interceptor update to rely on storage helper and avoid hard redirects during SSR-sensitive paths
- `Me` page placeholders for language, notification preference, OCR preference, and privacy settings entry

- [x] **Step 4: Run focused verification**

Run:
- `npm run test -- src/components/app-shell/gated-action.test.tsx src/lib/permissions.test.ts src/lib/analytics.test.ts`
- `npm run lint`
- `npm run build`

Expected:
- tests PASS
- lint PASS
- build PASS

- [x] **Step 5: Commit**

```bash
git add frontend/src/lib/storage.ts frontend/src/lib/permissions.ts frontend/src/lib/analytics.ts frontend/src/components/app-shell/gated-action.tsx frontend/src/stores/auth.ts frontend/src/lib/api.ts frontend/src/components/me/me-screen.tsx frontend/src/components/app-shell/gated-action.test.tsx frontend/src/lib/permissions.test.ts frontend/src/lib/analytics.test.ts
git commit -m "feat: add auth and permission foundations"
```

---

## Chunk 5: Milestone 1 Foundation Verification

### Task 5: Verify the full foundation and capture the stage boundary

**Files:**
- Modify: `docs/superpowers/plans/2026-03-14-mintbit-milestone-1-foundation.md`

- [x] **Step 1: Run the full frontend verification suite**

Run:
- `npm run test`
- `npm run lint`
- `npm run build`

Expected:
- all verification passes

- [x] **Step 2: Record remaining scope for the next milestone**

Update this plan file to mark completed tasks and note that Milestone 2 will start with questionnaire, OCR upload/verification, report, and save-to-plan.

Next milestone entry point:
- Milestone 2 begins with the core health loop:
  - questionnaire conversation flow
  - OCR upload and explicit verification flow
  - recommendation/report rendering
  - save-to-plan actions and timeline wiring
  - product display inside the saved-plan context

- [ ] **Step 3: Commit the plan progress**

```bash
git add docs/superpowers/plans/2026-03-14-mintbit-milestone-1-foundation.md
git commit -m "docs: update milestone 1 foundation progress"
```
