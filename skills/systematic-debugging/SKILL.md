---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behaviour, before proposing fixes
---

# Systematic debugging

Investigate root cause before proposing fixes, including under time pressure and for apparently simple bugs, performance, build or integration failures. Complete the four phases in order within the assigned scope and tool permissions.

Investigation is not repair authority. Follow [the shared verification policy](../shared/verification.md) for baselines, failure attribution, independent work and repair authority. Scoped agents report evidence to the controller; standalone execution carries controller responsibility.

## 1. Root-cause investigation

- Read errors, warnings and complete stack traces. Note paths, line numbers and error codes.
- Establish exact reproduction steps and frequency. If reproduction is unreliable, gather data rather than guess.
- Inspect relevant changes, dependencies, configuration and environment differences using supplied evidence within the task boundary. Use VCS/history only when permitted.
- For multi-component systems, use existing evidence first. Instrument only the boundaries needed to locate the fault, recording relevant inputs, outputs, configuration or state. Stop adding diagnostics once the evidence explains the failure.
- Trace bad values backwards through callers to their source, not just the symptom. For deep call stacks, read `root-cause-tracing.md`.

Proceed when evidence explains what fails and why.

## 2. Pattern analysis

Find comparable working code when it helps explain the failure. Read the relevant implementation and its dependencies before applying a pattern. Compare relevant differences between working and broken paths until the evidence explains the failure; do not inventory unrelated differences.

## 3. Hypothesis and testing

Write one specific hypothesis with supporting evidence. Test it with the smallest change, one variable at a time. A confirmed hypothesis leads to implementation; a failed one needs a new hypothesis, not stacked fixes. State what you do not understand, investigate further and ask for help when needed.

## 4. Implementation

1. Invoke `test-driven-development` and create the simplest failing reproducer before fixing. Use an automated test or a one-off executable test if no framework exists; follow TDD's prose/configuration policy where no useful executable test exists.
2. Fix the identified root cause, one change at a time, without bundled refactoring or adjacent improvements.
3. Verify the reproducer passes, the issue is resolved and applicable tests remain green. Use `verification-before-completion` before claiming success.
4. If the fix fails, stop and count attempts. Below three, return to investigation with the new evidence. At three or more, reassess architecture before another fix and honour the active workflow's fix-round cap.

Repeated fixes revealing new coupling, requiring large refactors or creating symptoms elsewhere call for questioning the pattern and its assumptions. They are not proof that architecture is wrong. Resolve local causes within the approved design; discuss consequential architectural changes with the user.

If you catch yourself guessing, stacking changes, skipping tests or proposing fixes before tracing data, return to investigation. Do the same when your human partner challenges an unverified assumption, asks for evidence or says the approach is stuck.

## Environmental, timing-dependent or external causes

Explain what the investigation established and repair only the demonstrated defect; agree broader work with the user.

## Supporting techniques

- `root-cause-tracing.md` traces backwards to the original trigger.
- `defence-in-depth.md` protects independent entry paths and live hazards under `principle-boundary-discipline`.
- `condition-based-waiting.md` replaces arbitrary timeouts with polling.
- `find-polluter.sh` bisects test pollution.
- `condition-based-waiting-example.ts` demonstrates condition-based waiting.
