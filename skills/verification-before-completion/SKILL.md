---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before integration, submission, or task completion
---

# Verification before completion

Make completion claims only with applicable verification evidence. This applies before accepting work, moving to the next task, describing or saving completed local changes, requesting bookmark advancement, integrating or submitting externally. Different wording does not bypass the gate.

## Baseline before implementation

Before source edits, run required project checks on the starting revision. Record that revision, commands, exit statuses and concise results in ignored scratch storage. Resolve a failed or unavailable baseline with the user before proceeding. Planning-only work does not require a development test run. On resume, retain applicable baseline evidence; post-edit results do not establish a baseline.

Investigate later failures against this evidence, changed code and environment. A pre-existing claim needs evidence; a green rerun alone does not explain an intermittent failure. Fix introduced regressions within scope and agree broader repairs with the user. Resolve failures before delivery unless the user explicitly accepts a stated limitation.

## Evidence gate

1. Identify what proves each claim.
2. Read existing results. Evidence survives handoffs and formatting differences; fix the report, not the test run.
3. Run missing or invalidated checks. Rerun for relevant code, configuration or environment changes, failures or a specific doubt. Complete required project checks without broadening the suite by default.
4. Verify actual output supports the claim, including exit status, failures and checked scope. Inspect delegated changes and recorded results rather than trusting a success report.
5. For delegated work, the controller inspects actual changes before accepting the task. During finishing, inspect the resulting implementation across affected execution paths for correctness against approved requirements and unnecessary complexity. Passing tests support that judgement; they do not replace it. This verification skill does not add a review stage to inline execution.
6. Inspect recorded failures and agreed repairs. Combined acceptance needs evidence for both scopes. Resolve failures or record explicit user-accepted limitations before delivery.
7. Report checked scope, actual results and remaining gaps concisely. Keep detailed evidence in scratch storage, not plans, designs, commits or permanent review documents. Task-only evidence does not prove the whole feature passed.

## Match evidence to claims

| Claim | Required evidence |
|-------|-------------------|
| Tests pass | Applicable command output with zero failures and scope |
| Linter clean | Applicable linter output with zero errors |
| Build succeeds | Build command exits zero, not merely a passing linter |
| Bug fixed | Original symptom's test passes |
| Regression test works | Observed red-green cycle, not a single pass |
| Agent completed | Inspect actual changes and results |
| Requirements met | Check each binding requirement, not just test results |

For an existing regression test, a permitted temporary removal of the fix can establish failure before restoration and a passing run. Preserve tool and edit permissions. Confidence, fatigue, partial checks and agent assurances are not substitutes for evidence. Claim only what the checks establish.
