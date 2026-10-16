---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before integration, submission, or task completion
---

# Verification before completion

Make completion claims only with applicable verification evidence. This applies before accepting work, moving to the next task, describing or saving completed local changes, requesting bookmark advancement, integrating or submitting externally. Different wording does not bypass the gate.

## Evidence gate

Use [the shared verification policy](../shared/verification.md) for evidence reuse and failure handling. Baselines are established during design exploration, or before direct implementation, rather than deferred to this gate.

1. Identify what proves each claim using the table below.
2. Inspect existing evidence and fill only missing or invalidated checks under the shared policy.
3. Confirm that actual output and required reviewer verdicts support the claimed scope and that unresolved limitations have explicit user acceptance.
4. Report supported results and remaining gaps concisely.

## Match evidence to claims

| Claim | Required evidence |
|-------|-------------------|
| Tests pass | Applicable command output with zero failures and scope |
| Linter clean | Applicable linter output with zero errors |
| Build succeeds | Build command exits zero, not merely a passing linter |
| Bug fixed | Original symptom's test passes |
| Regression test works | Observed red-green cycle, not a single pass |
| Agent completed | Reported check results and required review verdicts |
| Requirements met | Check each binding requirement, not just test results |

For an existing regression test, a permitted temporary removal of the fix can establish failure before restoration and a passing run. Preserve tool and edit permissions. Confidence, fatigue, partial checks and agent assurances are not substitutes for evidence. Claim only what the checks establish.
