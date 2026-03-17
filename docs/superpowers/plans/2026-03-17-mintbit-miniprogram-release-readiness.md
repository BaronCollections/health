# MintBit Mini Program Release Readiness

## Goal

Finish the code-side release handoff for the native WeChat Mini Program migration by cleaning the DevTools project configuration, replacing old demo compile entries with MintBit business routes, and adding repository-local validation and handoff instructions.

## Scope

- Replace stale TDesign-oriented DevTools project metadata with MintBit-specific naming and compile conditions.
- Add repo-local scripts that verify the project configuration still points at valid business pages.
- Add a mini program handoff README covering DevTools open/run/test/publish steps plus the final manual acceptance checklist.
- Update the repository homepage to reflect the new release-readiness status and the remaining manual step.

## Execution Order

1. Write a small validation script that fails if the DevTools compile entries point at missing pages.
2. Update `project.config.json` and related mini program metadata to MintBit values.
3. Add package scripts and a mini program README for repeatable local validation and release handoff.
4. Re-run the full mini program test suite plus the new release-readiness validation commands.

## Verification

- `npm --prefix miniprogram run test:all`
- `npm --prefix miniprogram run check:syntax`
- `npm --prefix miniprogram run check:json`
- `npm --prefix miniprogram run check:project-config`
