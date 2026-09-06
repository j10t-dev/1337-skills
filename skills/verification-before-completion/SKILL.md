---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before integration, submission, or task completion
---

# Verification before completion

Make completion claims only with applicable verification evidence. This applies before accepting work, moving to the next task, describing or saving completed local changes, requesting bookmark advancement, integrating or submitting externally. Different wording does not bypass the gate.

## Evidence gate

1. Identify what proves each claim.
2. Read existing results. Evidence survives handoffs and formatting differences; fix the report, not the test run.
3. Run missing or invalidated checks. Rerun for relevant code, configuration or environment changes, failures or a specific doubt. Complete required project checks without broadening the suite by default.
4. Verify actual output supports the claim, including exit status, failures and checked scope. Inspect delegated changes and recorded results rather than trusting a success report.
5. Inspect recorded failures, repair work items, findings and rulings. Combined acceptance needs check/review evidence for both original and repair requirements. Final delivery needs every recorded failure resolved unless the user explicitly changed that requirement.
6. Report checked scope, actual results and remaining gaps. Task-only evidence does not prove a separate repair or the whole feature passed.

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
