---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# Test-driven development

New features, behaviour changes and bug fixes require a failing test before implementation. If you wrote implementation first, delete it and start over, without keeping it as reference or adapting it while writing tests. Throw away exploratory code before starting TDD. Throwaway prototypes and other exceptions to test-first require user permission.

For refactoring, reuse existing coverage; test uncovered behaviour first. Where no useful executable test exists, inspect prose, validate configuration or check generated output through its generator. Do not add tests that merely mirror implementation. Required project checks still apply.

Before source edits, establish the required-check baseline under `verification-before-completion`. Planning-only work does not need that test run.

## Red, green, refactor

1. **Red.** Write one minimal test of one behaviour, with a clear name and intended API. Exercise real code; mock only unavoidable dependencies. Run the focused test and observe an expected assertion failure caused by missing behaviour, not a typo or test error. If it passes immediately, correct the test; if it errors, fix the error and rerun until it fails correctly.
2. **Green.** Write the simplest implementation that passes. Keep the cycle within one reviewable unit, without extra features or unrelated refactoring. Run the test and applicable existing coverage. Fix code, not the test, when implementation fails. Investigate failures and new warnings against the baseline; distinguish expected diagnostics from defects.
3. **Refactor.** Only after green, remove duplication, improve names or extract helpers. Keep tests green and add no behaviour. Repeat with the next failing test.

For other failures, report the command, actual output and evidence to the controller. Never dismiss a failure as pre-existing without evidence, or treat a passing rerun as a diagnosis. Fix introduced regressions within scope; agree broader repairs with the user. Resolve failures before delivery unless the user explicitly accepts a stated limitation. Continue only independent authorised work while blocked.

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

Apply test-first items only where test-first is required. Do not claim test-first without observed failure. Bug fixes use `systematic-debugging` for investigation and this cycle for the reproducer and fix. Use `verification-before-completion` before claiming completion.
