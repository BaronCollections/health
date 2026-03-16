# MintBit Mini Program Phase 1 Migration Design

> Version: 1.0
> Date: 2026-03-16
> Status: Approved for implementation planning
> Scope: Full Phase 1 migration from MintBit H5 to a native WeChat Mini Program inside the existing `VcGo` project shell

## 1. Purpose

This spec defines the migration of MintBit Phase 1 from the current mobile H5 implementation into a native WeChat Mini Program.

The user confirmed the following constraints:

- the target platform is a native WeChat Mini Program, not a `web-view` container
- the existing `VcGo` mini program project should be reused as the executable shell
- the current TDesign demo app should be replaced by the MintBit application
- the scope is the full Phase 1 ordinary-user product, not a reduced MVP
- the mini program should connect directly to the current backend APIs and data models
- authentication should follow `wx.login -> phone SMS verification -> bind existing account`
- OCR upload must support both images and PDF files
- operations review pages and administrator release-check pages are excluded from mini program Phase 1
- UI should prioritize hand-built native mini program components that visually match the current MintBit H5 experience as closely as practical

## 2. Problem Statement

MintBit Phase 1 is already implemented as a mobile-first H5 application with:

- bilingual routing and resource coverage
- assessment and questionnaire flows
- OCR upload and confirmation
- report and poster/timeline pages
- check-in and saved-plan persistence
- community and account-center flows

However, there is no native WeChat Mini Program implementation yet.

The current `VcGo` directory is a working WeChat Mini Program project, but it is still structured as a TDesign demonstration application rather than a MintBit product.

The migration must therefore solve four problems at once:

1. replace the demo app shell with the MintBit product shell
2. adapt the current H5 product information architecture into native mini program pages
3. connect WeChat-native login and account binding to the existing MintBit backend
4. preserve Phase 1 feature completeness without forcing a second business model or a temporary fallback architecture

## 3. Product Scope

### 3.1 Included

- native WeChat Mini Program application shell
- MintBit brand theme, bilingual switching, and tabBar information architecture
- WeChat login and phone-based existing-account binding
- direct integration with current backend business models and APIs
- full Phase 1 ordinary-user flows:
  - home
  - questionnaire and assessment
  - OCR upload
  - OCR confirmation
  - report detail
  - history poster timeline
  - check-in
  - community feed
  - create post
  - post detail and comment
  - my posts and moderation status
  - profile and account center
  - notifications
  - help
  - feedback
  - privacy
  - export request
  - delete request
  - security snapshot
  - user-visible audit log

### 3.2 Excluded

- operations moderation H5 page
- administrator release-check page
- WeCom internal enterprise container support inside the mini program
- web-view-based temporary fallback implementation
- a separate mini program business backend
- desktop/Web-specific shells and layouts

## 4. Delivery Strategy

The final target remains a complete Phase 1 mini program, but engineering execution will be divided into domain-based migration programs.

Recommended execution sequence:

1. `Mini Program Foundation`
2. `Assessment / OCR / Report`
3. `Check-in / Community`
4. `Profile / Delivery`

This preserves the complete final target while keeping each migration stage independently runnable, testable, and commit-safe.

## 5. Application Architecture

### 5.1 Host Project Strategy

The existing `VcGo` mini program project remains the runtime shell.

Files preserved as host-project infrastructure:

- `app.js`
- `app.json`
- `app.wxss`
- `project.config.json`
- `project.private.config.json`
- `sitemap.json`

Files and routes currently used for TDesign examples are treated as replaceable product content.

### 5.2 Domain-Oriented Code Layout

The mini program should be reorganized around business domains rather than demo component categories.

Recommended top-level structure:

- `pages/`
  - route pages only
- `components/`
  - reusable native presentation components
- `services/`
  - request layer and WeChat platform wrappers
- `store/`
  - global state and session state
- `config/`
  - environment config, API base, brand tokens
- `utils/`
  - pure helpers, formatters, guards
- `i18n/`
  - locale resources and translation runtime

### 5.3 Responsibility Boundaries

- `pages/*` orchestrate data loading and user interaction
- `components/*` focus on rendering and component-level state
- `services/*` own backend requests and native WeChat API integration
- `store/*` owns app-level state such as auth, locale, and cached snapshots
- `utils/*` remains side-effect free

No page should directly embed large API protocol logic.
No shared component should directly depend on page-specific business rules.

## 6. Information Architecture

### 6.1 TabBar

The recommended tabBar keeps the same Phase 1 mental model as H5:

- `pages/home/index`
- `pages/report/index`
- `pages/checkin/index`
- `pages/community/index`
- `pages/profile/index`

### 6.2 Non-TabBar Pages

Recommended supporting routes:

- `pages/auth/login/index`
- `pages/auth/bind-phone/index`
- `pages/assessment/questionnaire/index`
- `pages/assessment/result-loading/index`
- `pages/report/detail/index`
- `pages/report/ocr-upload/index`
- `pages/report/ocr-confirmation/index`
- `pages/report/timeline/index`
- `pages/community/create/index`
- `pages/community/detail/index`
- `pages/community/my-posts/index`
- `pages/profile/notifications/index`
- `pages/profile/notification-detail/index`
- `pages/profile/help/index`
- `pages/profile/feedback/index`
- `pages/profile/feedback-records/index`
- `pages/profile/privacy/index`
- `pages/profile/export/index`
- `pages/profile/delete-request/index`
- `pages/profile/security/index`
- `pages/profile/audit-log/index`

### 6.3 Pages Explicitly Excluded From Mini Program Phase 1

- operations moderation queue page
- administrator release diagnostics page

These remain platform-specific management surfaces outside the ordinary-user mini program product.

## 7. Identity And Authentication

### 7.1 Login Flow

The mini program authentication path is:

1. `wx.login()` obtains `code`
2. the mini program sends `code` to the backend mini program auth entry
3. the backend exchanges it with WeChat for identity data such as `openid` and `unionid`
4. the backend determines whether this WeChat identity is already bound to an existing MintBit account

### 7.2 Binding Flow

If the identity is not yet bound:

1. backend returns `bindRequired = true`
2. mini program navigates to `bind-phone`
3. user enters phone number
4. backend sends SMS verification code
5. user submits `phone + smsCode + bindToken`
6. backend binds the WeChat identity to the existing MintBit account
7. backend returns standard business `accessToken / refreshToken / profile`

### 7.3 Auth States

The mini program should model the following auth states:

- `anonymous`
- `bind_required`
- `binding`
- `authenticated`

This allows pages and operations to distinguish:

- users who are not yet authenticated
- users who completed WeChat identity validation but still require binding
- users with full business access

### 7.4 Backend Additions

The backend should add a mini program auth adaptation layer rather than a new business domain.

Recommended endpoints:

- `POST /api/miniprogram/auth/login`
- `POST /api/miniprogram/auth/sms/send`
- `POST /api/miniprogram/auth/bind`
- `POST /api/miniprogram/auth/refresh`
- `GET /api/miniprogram/auth/me`

Recommended persistence model:

- `user_wechat_binding`
  - `id`
  - `user_id`
  - `openid`
  - `unionid`
  - `app_id`
  - `bound_phone`
  - `created_at`
  - `updated_at`

### 7.5 Security Rules

- one WeChat identity binds to exactly one MintBit account
- binding token cannot access business endpoints
- business token is only issued after successful binding
- SMS verification must enforce expiry, retry limits, and anti-abuse controls
- repeated binding attempts for already-bound identities must fail explicitly

## 8. Backend Integration

### 8.1 Business Model Reuse

The mini program should reuse current MintBit backend business models wherever possible.

This means:

- assessment data model remains shared
- report data model remains shared
- OCR result model remains shared
- check-in data model remains shared
- community data model remains shared
- profile/account-center data model remains shared

The mini program should not introduce a second parallel set of business DTOs unless the current backend absolutely requires mini program transport-specific wrappers.

### 8.2 API Strategy

Recommended request policy:

- retain one canonical backend domain model
- add mini program auth and binding endpoints
- keep business APIs aligned across H5 and mini program
- only add transport-specific adapters where platform differences require them

This minimizes long-term divergence between H5 and mini program implementations.

## 9. UI And Interaction Strategy

### 9.1 Rendering Direction

The mini program should aim to visually match the current MintBit H5 experience using native components and hand-built layouts.

The user explicitly prefers:

- hand-built native components
- close visual restoration of the current H5 product
- minimal dependence on prebuilt UI kits for the core experience

### 9.2 Component Strategy

Recommended shared component families:

- `brand-header`
- `mintbit-tabbar`
- `locale-switch`
- `fallback-state`
- `stat-card`
- `report-score-radar`
- `recommendation-card`
- `poster-card`
- `timeline-item`
- `ocr-upload-panel`
- `comment-card`
- `feedback-form-panel`

Existing TDesign components may still be used selectively where they do not undermine product fidelity, but the application should not look like the original demo app.

### 9.3 Design System Rules

- preserve brand color `#6DB578`
- keep the current bilingual content strategy
- maintain mobile-first spacing and rhythm
- use native mini program interaction patterns where browser-specific H5 patterns do not translate safely
- explicitly redesign gestures or overlays that are unreliable in mini program runtime

## 10. Internationalization

The mini program should continue supporting full bilingual switching.

Scope includes:

- navigation
- tabBar
- questionnaire
- report
- OCR flows
- check-in
- community chrome
- notifications
- help and privacy content
- feedback flows
- data control flows

Suggested storage:

- mini program global store holds current locale
- locale preference persists in storage
- locale preference can later sync with backend profile if desired

## 11. OCR Upload Strategy

### 11.1 Supported Input Types

Phase 1 mini program OCR upload must support:

- image files
- PDF files

### 11.2 Runtime Handling

Recommended strategy:

- use mini program file selection and upload capability
- upload the raw selected file to the backend
- do not perform PDF parsing inside the mini program

### 11.3 State Handling

The OCR flow must explicitly model:

- idle
- file selected
- uploading
- uploaded / queued
- upload failed
- result loading
- result ready
- result fallback

Failures must expose retry paths rather than silent degradation.

## 12. Domain Migration Programs

### 12.1 Program A: Mini Program Foundation

Delivers:

- MintBit app shell
- tabBar
- brand theme
- locale switching
- request layer
- auth state store
- WeChat login and phone binding
- basic home and profile shell routes

### 12.2 Program B: Assessment / OCR / Report

Delivers:

- questionnaire
- loading / submit states
- OCR upload
- OCR confirmation
- report detail
- timeline

### 12.3 Program C: Check-in / Community

Delivers:

- saved-plan usage
- check-in
- community feed
- create post
- post detail
- comment flow
- my posts and moderation state

### 12.4 Program D: Profile / Delivery

Delivers:

- notifications
- help
- feedback
- privacy
- export request
- delete request
- security snapshot
- audit log
- mini program delivery baseline

## 13. Risks

### 13.1 Scope Risk

Full Phase 1 migration to native mini program is significantly larger than a simple shell port.

Mitigation:

- keep the complete product target
- execute by domain programs
- commit each program independently

### 13.2 Auth Risk

If the WeChat login and account binding model is not built first, every downstream business page will need rework.

Mitigation:

- complete auth and binding in Program A
- treat auth state as a first-class app dependency

### 13.3 UI Fidelity Risk

H5 interaction patterns do not always map cleanly to mini program runtime behavior.

Mitigation:

- prioritize visual equivalence, not literal browser implementation parity
- redesign gestures and transitions when mini program runtime constraints require it

### 13.4 OCR Risk

Supporting both image and PDF upload in mini program increases complexity around file selection, upload failure, and backend error handling.

Mitigation:

- keep parsing server-side
- explicitly design failure and retry states
- validate both file categories in the earliest OCR program

### 13.5 Project-Shell Risk

`VcGo` currently contains a large TDesign demonstration route structure.

Mitigation:

- replace demo route ownership with MintBit route ownership early
- keep only the shell files and any truly reusable host-project infrastructure

## 14. Acceptance Baseline

The mini program migration will be considered structurally complete when:

- `VcGo` runs as MintBit rather than as the TDesign sample app
- WeChat login and phone binding work end-to-end
- the mini program directly consumes the current backend data model
- all ordinary-user Phase 1 product domains are available in native mini program routes
- full bilingual switching works across all user-facing surfaces
- OCR upload supports both images and PDFs
- UI is predominantly native and aligned with current MintBit H5 visuals
- management-only routes remain excluded from the mini program product

## 15. Recommended Next Step

Write the first implementation plan for:

- `Mini Program Foundation`

This is the correct first program because every later domain depends on:

- app shell replacement
- route ownership
- locale runtime
- request layer
- token storage
- WeChat login and account binding
