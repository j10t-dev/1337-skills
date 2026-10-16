---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# Test-driven development

New features, behaviour changes and bug fixes require a failing test before implementation. Throwaway prototypes and other exceptions to test-first require user permission.

If implementation was written first, preserve it and immediately derive tests from the original request and approved plan, independently of the implementation. Confirm that assertions cover those requirements rather than merely matching the code. Demonstrate that the tests detect missing or incorrect requested behaviour, then verify the implementation. Preserve work and permissions when temporarily removing or mutating the implementation to establish that evidence. Do not claim test-first compliance retrospectively. Independent review must check requirement-to-test alignment and whether the tests were adapted merely to make the implementation pass.

For refactoring, reuse existing coverage; test uncovered behaviour first. Where no useful executable test exists, inspect prose, validate configuration or check generated output through its generator. Do not add tests that merely mirror implementation. Required project checks still apply.

Use [the shared verification policy](../shared/verification.md) for baselines, evidence reuse and failure handling. Reuse the design-stage baseline; direct work establishes it before implementation.

## Red, green, refactor

1. **Red.** Write one minimal test of one behaviour, with a clear name and intended API. Exercise real code; mock only unavoidable dependencies. Run the focused test and observe an expected assertion failure caused by missing behaviour, not a typo or test error. If it passes immediately, check its coverage against the original requirements; do not change correct expectations just to force a failure. For implementation written first, use the recovery rule above. If the test errors, fix the error and rerun until it fails correctly.
2. **Green.** Write the simplest implementation that passes. Keep the cycle within one reviewable unit, without extra features or unrelated refactoring. Run the test and applicable existing coverage. Fix code, not the test, when implementation fails. Investigate failures and new warnings against the baseline; distinguish expected diagnostics from defects.
3. **Refactor.** Only after green, remove duplication, improve names or extract helpers. Keep tests green and add no behaviour. Repeat with the next failing test.

For other failures, follow the shared verification policy. Scoped agents report evidence and blockers to the controller.

## Test quality

When writing or changing any test, read [writing-good-tests.md](writing-good-tests.md):
- Name the production change that would make the test fail.
- Derive expectations independently of the code under test.
- Assert real behaviour, never mock behaviour.
- Run scripts and assert effects; never grep their source text.

Cover edge cases and errors. Keep distinct behaviours separate. Manual exploration or a test that only passed does not establish test-first evidence.

## When stuck

Write the wished-for API and assertion first; ask your human partner if needed. A complicated test suggests simplifying the interface. If everything needs mocking, reduce coupling with dependency injection. Extract large setup into helpers, then simplify the design if setup remains complex.

## Completion checklist

Track applicable items using the current harness's task tracker, following `using-skills`:

- [ ] New behaviour and bug fixes have meaningful coverage, including edge cases and errors.
- [ ] Each required test failed for the expected reason before implementation.
- [ ] Implementation was minimal and tests exercise real code.
- [ ] Applicable tests and required project checks pass; unexpected output is explained.

Apply test-first items only where test-first is required. If recovering from implementation-first, report the deviation and recovery evidence instead of marking retrospective test-first compliance. Do not claim test-first without observed failure before implementation. Bug fixes use `systematic-debugging` for investigation and this cycle for the reproducer and fix. Use `verification-before-completion` before claiming completion.
