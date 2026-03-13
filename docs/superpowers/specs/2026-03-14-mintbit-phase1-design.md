# MintBit Phase 1 Design Master Spec

> Version: 1.0
> Date: 2026-03-14
> Status: Approved for document drafting
> Scope: Governing design spec for `PRD`, `technical design`, and `execution plan`

## 1. Purpose

This document is the parent design contract for MintBit Phase 1. Its purpose is to keep the three downstream documents aligned:

- `docs/mintbit-phase1/01-prd.md`
- `docs/mintbit-phase1/02-technical-design.md`
- `docs/mintbit-phase1/03-execution-plan.md`

If any statement in those three documents conflicts with this master spec, this document takes precedence unless the user explicitly overrides it later.

This document does not replace detailed product, technical, or execution documentation. It defines the non-negotiable shared baseline they must all inherit.

## 2. Source Precedence

The design should be written from the following priority order:

1. Direct user instructions in this conversation
2. This master spec
3. Source documents under `docs/`
4. Existing repository state
5. `frontend/docs/ui-specification.md` only where it does not conflict with MintBit branding or newer scope decisions

## 3. Product Definition

### 3.1 Product Name

- English: `MintBit`
- Chinese: `薄荷比特`

### 3.2 Product Positioning

MintBit is an AI-driven personalized nutrition recommendation product focused on turning questionnaire input, optional health-report OCR data, AI analysis, and continuous engagement into an explainable, user-controlled, mobile-first health journey.

Phase 1 is not an e-commerce launch. It is a complete mobile H5 health experience with recommendation, save-to-plan, check-in, community, and historical poster/timeline capabilities.

### 3.3 Core Value Proposition

- Precision: personalized recommendations built from structured inputs, evidence chains, and optional OCR-enhanced data
- Clarity: recommendations must be explainable rather than black-box
- Continuity: the product must support interruption recovery and repeated re-evaluation over time
- Trust: privacy, auditability, and user choice are first-class
- Companionship: community, check-in, timeline, and Xiaoya create ongoing product stickiness

## 4. Phase Strategy

### 4.1 External Phase Definition

Phase 1 is a complete mobile H5 experience.

### 4.2 Internal Delivery Model

Phase 1 is delivered internally through four milestones:

1. Foundation
2. Core Health Loop
3. Growth and Retention
4. Release Hardening and Expansion Readiness

This split is internal execution structure only. It must not change the outward product definition of Phase 1.

### 4.3 Later Phases

- Phase 2: enterprise WeCom adaptation and embedding
- Later phase: broader web experience

Phase 1 architecture must reserve room for those phases, but must not become over-engineered around them.

## 5. Locked Scope

### 5.1 Phase 1 Included Scope

Phase 1 must include all of the following:

- Home
- AI questionnaire
- OCR upload and OCR confirmation
- Recommendation report
- Product display and collection
- Personal center
- Full bilingual switching
- Check-in
- Community
- Historical poster timeline
- Notifications and help center
- Privacy, audit, and permission settings relevant to Phase 1

### 5.2 Phase 1 Excluded Scope

The following are explicitly out of scope for Phase 1:

- Real checkout
- Payment
- Order lifecycle
- Refund and after-sales
- Mandatory enterprise WeCom login
- Full desktop-first redesign

### 5.3 Product Module Constraint

The product module in Phase 1 is `display-and-save only`:

- show recommended products
- show ingredients
- show dosage
- show reasons and evidence
- allow add to my plan
- allow collection/favorite if needed

It must not include purchase or payment behavior.

## 6. Brand and Visual Rules

### 6.1 Brand Color

The primary app brand color is `#6DB578`.

This is the authoritative Phase 1 UI brand color direction.

### 6.2 Xiaoya

`小雅` is a separate particle assistant system.

Rules:

- Xiaoya is a global AI interaction layer, not the core page theme color
- Xiaoya can use an independent particle palette and motion language
- Xiaoya should enhance emotion, continuity, and guidance
- Xiaoya must not override the main MintBit visual system

### 6.3 Lemonbox Reference Boundary

Lemonbox is a reference for:

- mobile information density
- motion quality
- interaction rhythm
- card hierarchy
- poster-like health storytelling

Lemonbox is not a color source of truth.

### 6.4 UI Source Conflict Resolution

`frontend/docs/ui-specification.md` contains a blue Apple Health style. That file may be referenced for interaction quality or layout mechanics only. It must not override the MintBit green brand direction.

## 7. Product Architecture

### 7.1 Core Closed Loop

The product must be designed as a continuous loop:

`home -> assessment -> OCR optional enhancement -> recommendation -> save to plan -> check-in -> community interaction -> history timeline -> re-assessment`

MintBit must not be documented as a one-time assessment tool.

### 7.2 Primary Navigation

Phase 1 should use five top-level product entry points:

- Home
- Plan
- Check-in
- Community
- Me

### 7.3 Deep Pages

The following are secondary/deep pages, not top-level tabs:

- AI questionnaire
- OCR upload
- OCR confirmation
- Recommendation detail
- Product detail
- Historical poster detail and comparison
- Community post detail
- Notifications
- Help center

### 7.4 Xiaoya Placement

Xiaoya is not a tab. Xiaoya appears as a contextual assistant layer primarily on:

- Home
- Questionnaire
- Recommendation/report
- Check-in feedback

## 8. Core State Model

All downstream documents must use compatible state-based flows.

### 8.1 First Entry and Account

Suggested states:

- `guest`
- `auth_required`
- `authenticated`
- `profile_initialized`

### 8.2 Assessment

Suggested states:

- `not_started`
- `in_progress`
- `report_optional`
- `ocr_processing`
- `ocr_verification_needed`
- `ocr_verified`
- `recommendation_ready`
- `saved_to_plan`

### 8.3 OCR

Suggested states:

- `uploaded`
- `processing`
- `high_confidence_parsed`
- `low_confidence_confirmation_needed`
- `auto_fixed_with_audit`
- `user_confirmed`
- `resolved`

### 8.4 Recommendation and Plan

Suggested states:

- `recommended`
- `saved`
- `active_plan`
- `archived`

### 8.5 Check-in

Suggested states:

- `planned`
- `reminded`
- `checked_in`
- `streak_updated`
- `reward_issued`

### 8.6 Community Post

Suggested states:

- `draft`
- `ai_review`
- `published`
- `folded`
- `blocked`

### 8.7 History and Reassessment

Suggested states:

- `active_profile`
- `decay_warning`
- `reassessment_triggered`
- `new_version_created`

## 9. User Roles and Permission Boundaries

### 9.1 Product Roles

Phase 1 should define the following roles:

- Guest
- Registered user
- Active user tag layer
- Community sub-admin
- Platform operations admin
- Audit admin

### 9.2 Permission Principles

The following rules are mandatory:

- Health data and community identity must be logically separated
- OCR originals and structured report data are user-private by default
- Community sub-admins can moderate content, but cannot access private health data
- High-risk operations must be auditable
- Sensitive access must follow least privilege

### 9.3 Community Sub-Admin

Phase 1 should reserve or define a `community sub-admin application` process.

Default assumption:

- users apply
- operations review
- approval grants scoped moderation permissions

## 10. Bilingual Strategy

### 10.1 Scope

Phase 1 bilingual support is `full bilingual support`.

It covers:

- all H5 pages
- questionnaire
- reports
- community UI
- system copy
- notifications
- help content

### 10.2 System Copy Rules

All user-facing system copy must be internationalized using keyed resources. Hardcoded language in production pages is not acceptable.

### 10.3 Questionnaire and Structured Content

Question banks, option labels, error messages, notification templates, and help content must have formal Chinese and English variants.

### 10.4 AI Content Rules

AI content should follow a dual-layer model:

- structured fields are localized from controlled data
- natural language explanation is generated in the active user language

If a second language version is not yet present, it may be generated asynchronously and cached, but the behavior must be explicit in the technical design.

### 10.5 Community Translation

Community posts and comments must preserve original text and may expose `view translation`.

Rules:

- original content remains authoritative
- translation is secondary and clearly labeled as AI translation
- moderation operates on original content semantics first

## 11. Trust, AI, and OCR Principles

### 11.1 User Autonomy

When user preference conflicts with the scientifically stronger recommendation, MintBit should:

- respect user choice
- preserve the user-selected path
- show side-by-side scientific recommendation
- provide transparent warning or rationale

MintBit should not silently force the AI choice.

### 11.2 Evidence Chain

Recommendations must not appear as black-box conclusions. All formal documents must preserve the requirement that the report/recommendation experience supports:

- user data insight
- benchmark/reference
- rationale for recommendation

### 11.3 OCR Low Confidence Handling

Low-confidence OCR items must default to explicit confirmation unless the user has opted into a more automated mode.

Even in automated mode:

- auto-fixes must be auditable
- reasons must be visible
- the system must preserve the correction trail

### 11.4 Safety Rules

High-risk recommendation logic must not rely only on LLM output.

Rules and structured checks must govern:

- dosage conflicts
- drug conflicts
- dangerous recommendations
- medically unsafe suggestions

## 12. Community and Retention Principles

### 12.1 Community Positioning

The community is a quality-controlled health community, not a general social feed.

### 12.2 Check-In Logic

Check-in is not a cosmetic feature. It is part of the product's retention and feedback loop and should connect to:

- plan execution
- streak logic
- points
- badges
- poster/timeline evolution

### 12.3 Moderation Model

The community must use layered moderation:

- hard compliance filtering
- semantic professionalism filtering
- quality weighting

### 12.4 Soft Correction

Where content is not outright illegal but is misleading, MintBit may use AI soft correction comments. This must be configurable and observable.

## 13. Recovery and Continuity Requirements

Interruption recovery is a core product rule, not an implementation detail.

The following flows must support recoverable progress:

- questionnaire
- OCR confirmation
- recommendation micro-adjustment
- community draft creation
- language preference

Downstream documents must define:

- save timing
- draft persistence
- state restoration
- idempotency and deduplication for critical submissions

## 14. Non-Functional Baseline

The PRD, technical design, and execution plan must all inherit the same release baseline:

- complete core loop usable
- full bilingual support usable
- privacy and sensitive data compliance enforced
- critical long flows recoverable
- community governance controllable

Recommended quality areas that must appear in downstream documents:

- performance
- resilience
- observability
- privacy and audit
- bilingual completeness
- AI trustworthiness
- OCR traceability
- moderation governance
- expansion readiness

## 15. Document Alignment Contract

### 15.1 PRD Must Answer

- what is being built
- why it matters
- who it is for
- what Phase 1 includes and excludes
- module requirements
- business rules
- acceptance baseline

### 15.2 Technical Design Must Answer

- how the product is built
- how bilingual support works
- how state recovery works
- how AI/OCR trust and audit work
- how Phase 2 WeCom and later web are reserved without overloading Phase 1

### 15.3 Execution Plan Must Answer

- how work is sequenced into milestones
- how each task is owned
- what each task inputs and outputs
- how status is tracked
- how interrupted work can resume

### 15.4 Cross-Document Invariants

The following must remain identical across all three documents:

- product scope
- phase boundaries
- brand direction
- bilingual definition
- included modules
- excluded commerce scope
- state machine terminology
- trust and audit principles
- milestone model

## 16. Execution Structure Contract

The execution plan must use the following hierarchy:

`Milestone -> Epic -> Story -> Task`

Each level should be resumable and traceable.

Minimum task fields:

- ID
- module
- description
- inputs
- outputs
- dependencies
- owner role
- priority
- status
- acceptance criteria
- risks
- notes

Allowed status values:

- `not_started`
- `in_progress`
- `blocked`
- `reviewing`
- `done`
- `deferred`

## 17. Open Assumptions

The following assumptions are acceptable to use in downstream documents unless the user later overrides them:

- Phase 1 ships first as a standalone mobile H5
- enterprise WeCom support is reserved, not mandatory in Phase 1 runtime
- login defaults to phone-based login plus guest browsing before gated actions
- notifications default to in-app and push-capability-ready design, with WeCom messaging in later phase
- community sub-admin is application-based and operation-approved
- AI and OCR provider choices should remain replaceable in architecture
- historical comparison defaults to two-point comparison plus month or quarter summaries

## 18. Pending Confirmation Items

These items may remain marked as pending confirmation in downstream documents if still unresolved:

- exact login provider and future SSO choices
- exact push delivery provider
- exact AI model provider combination for launch
- exact OCR provider for launch
- exact governance thresholds for community quality grading

Pending confirmation items must not break the internal consistency of the documents.

## 19. Writing Rules For Downstream Documents

All downstream documents should follow these rules:

- do not contradict this master spec
- prefer explicit scope statements over implied scope
- separate mandatory Phase 1 from later-phase placeholders
- use state-based language for multi-step flows
- distinguish authoritative system copy from AI-generated content
- distinguish user-visible product behavior from internal implementation details
- clearly mark assumptions vs confirmed decisions
- preserve execution resumability as a first-class requirement

## 20. Completion Rule

This design is considered successfully inherited only when the three downstream documents:

- reference the same product definition
- share the same included and excluded scope
- use compatible state flows
- reflect the same brand and bilingual rules
- preserve the same trust, privacy, and audit principles
- map work into the same four-milestone rollout

At that point, the documentation set may be treated as internally consistent.
