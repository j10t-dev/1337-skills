---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before integration, submission, or task completion
---

# Verification before completion

Make completion claims only with applicable verification evidence. This applies before accepting work, moving to the next task, describing or saving completed local changes, requesting bookmark advancement, integrating or submitting externally. Different wording does not bypass the gate.

## Baseline before implementation

Before source edits, run required project checks and report the starting revision, commands, exit statuses, elapsed times and results. Resolve a failed or unavailable baseline with the user before proceeding. Reuse applicable baseline results on resume; planning-only work needs no development test run.

Investigate later failures against this evidence, changed code and environment. A pre-existing claim needs evidence; a green rerun alone does not explain an intermittent failure. Fix introduced regressions within scope and agree broader repairs with the user. Resolve failures before delivery unless the user explicitly accepts a stated limitation.

## Evidence gate

1. Identify what proves each claim.
2. Read existing results. Evidence survives handoffs and formatting differences; fix the report, not the test run.
3. Run missing or invalidated checks. Rerun for relevant code, configuration or environment changes, failures or a specific doubt. Complete required project checks without broadening the suite by default.
4. Confirm reported output supports the claim, including exit status, failures, elapsed time and checked scope; use the required reviewers' verdicts for code review.
5. Flag unexplained changes in test runtime as potential defects, accounting for changes in checked scope and environment.
6. Resolve failures or obtain explicit user-accepted limitations before delivery.
7. Report results and remaining gaps concisely. Task-only checks do not prove the whole feature passed.

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
