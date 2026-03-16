# Findings & Decisions

## Requirements
- User wants three detailed documents: PRD, technical design, and execution task document.
- Documents should incorporate best practices and the existing repo context.
- New source materials and reference app UI/interaction assets were added under `docs/`.
- Phase 1 target is mobile H5 with bilingual switching and close UI restoration.
- Phase 2 target is deployment/embedding in enterprise WeCom.
- Later stage will expand into a broader web experience.
- Confirmed design direction: use MintBit brand green `#6DB578` as the core app brand color.
- Confirmed `小雅` particle assistant is a separate visual system and should not override the core UI brand palette.
- Confirmed Lemonbox is a reference for style and interaction only, not for color usage.
- Confirmed Phase 1 scope is the complete mobile H5 scope: home, AI questionnaire, OCR upload/confirmation, recommendation report, product display, profile, bilingual switching, check-in, community, and poster history timeline.
- Execution documentation must be explicit about completion status so future sessions can resume seamlessly after interruption.
- Confirmed product module in Phase 1 is display-and-save only: show recommended products, ingredients, dosage, reasons, and allow adding to "my plan", but no checkout or payment.

## Research Findings
- Existing repo already positions the product as an AI-driven personalized vitamin recommendation platform.
- Current implementation contains mobile-first front-end prototypes and backend skeleton APIs, so the documents need to distinguish current state from target state.
- `docs/1、维生素AI推荐.docx` is the most complete product source so far. It defines questionnaire, recommendation engine, poster generation, community, health profile, product display, and compliance scope.
- `docs/9、功能模块总览 (MVP 阶段).docx` extends the MVP with dynamic health-profile decay, transparent recommendation evidence chains, user autonomy, poster archive/timeline, scheduled summary reports, OCR confirmation logic, and community growth mechanics.
- `docs/🌿 MintBit 薄荷比特：品牌视觉与核心交互定义文档.docx` defines the active MintBit brand system: primary mint green `#6DB578`, deep text color, warm background tone, and the particle-based AI assistant `小雅`.
- `frontend/docs/ui-specification.md` conflicts with the current MintBit brand direction because it specifies a Klein Blue / Apple Health style rather than the mint-green Lemonbox-inspired direction in `docs/`.
- User instruction overrides older source text that mentioned PC-first delivery. Current product phasing should be treated as mobile H5 first, then enterprise WeCom, then broader web.
- `docs/6.1、前端组件拆解清单.docx` provides implementation-facing UI component guidance for Tailwind + motion + charts + poster generation. It reinforces a mobile-focused custom component system rather than only generic shadcn usage.
- `docs/6、营养方案展示页的交互细节.docx` defines the recommendation/report page around progressive disclosure, radar-driven navigation, evidence chains, time-based dosing guidance, and live plan adjustment.
- `docs/7、社区系统的打卡激励逻辑.docx` defines the check-in/community loop as habit-building plus social prestige plus data feedback, with points, badges, revive mechanics, and a vitality-tree metaphor.
- `docs/8、社区内容审核的 AI 过滤规则.docx` defines a three-layer moderation system: hard compliance, semantic professionalism filtering, and quality weighting, plus privacy OCR masking and AI corrective comments.
- Source documents consistently position Phase 1 as product-display-first rather than e-commerce-first, but purchase/payment capability has not yet been re-confirmed with the user in this conversation.
- The master design spec has now been written to `docs/superpowers/specs/2026-03-14-mintbit-phase1-design.md` to serve as the single governing source for the downstream PRD, technical design, and execution plan.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Use repo plus `docs/` as primary source material | User explicitly referenced both |
| Keep documents phased by delivery stage | Product spans H5, enterprise WeCom, and web |
| Treat `docs/` as the higher-priority source for product/design direction unless the user chooses otherwise | It aligns with the current request and MintBit branding |
| Use MintBit green system as the default Phase 1 visual basis | User explicitly confirmed this direction |
| Treat community and timeline as Phase 1, not Phase 1.5 | User chose the complete version for initial delivery scope |
| Write execution work in resumable epics/stories/tasks with explicit status fields | User explicitly wants interruption-safe continuation |
| Exclude payment and transaction flows from Phase 1 | User explicitly limited the product module to display and collection/save behaviors |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Multiple doc sources exist (`docs/`, `frontend/docs/`) | Inspect both and reconcile into a single source of truth |

## Resources
- `/Users/zhendong.mzd/Desktop/health/README.md`
- `/Users/zhendong.mzd/Desktop/health/TASKS.md`
- `/Users/zhendong.mzd/Desktop/health/docs/`
- `/Users/zhendong.mzd/Desktop/health/frontend/docs/ui-specification.md`
- `/Users/zhendong.mzd/Desktop/health/docs/1、维生素AI推荐.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/9、功能模块总览 (MVP 阶段).docx`
- `/Users/zhendong.mzd/Desktop/health/docs/🌿 MintBit 薄荷比特：品牌视觉与核心交互定义文档.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/6.1、前端组件拆解清单.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/6、营养方案展示页的交互细节.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/7、社区系统的打卡激励逻辑.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/8、社区内容审核的 AI 过滤规则.docx`
- `/Users/zhendong.mzd/Desktop/health/docs/superpowers/specs/2026-03-14-mintbit-phase1-design.md`

## Visual/Browser Findings
- None yet.
