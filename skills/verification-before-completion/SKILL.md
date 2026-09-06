---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before integration, submission, or task completion
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT APPLICABLE VERIFICATION EVIDENCE
```

Read existing results first. Evidence survives handoffs and formatting differences:
fix the report, not the test run. Rerun only for missing evidence, relevant code,
configuration or environment changes, failures, or a specific doubt. Complete
required checks; do not broaden the suite by default.

## The Gate Function

```
BEFORE claiming completion:

1. IDENTIFY: What proves the claim?
2. READ: Inspect existing results.
3. RUN: Perform missing or invalidated checks.
4. VERIFY: Do the results support the claim?
5. CHECK OUTSTANDING WORK: Inspect recorded failures, repair work items,
   findings and rulings. Combined acceptance needs check/review evidence for
   both original and repair requirements. Final delivery needs every recorded
   failure resolved unless the user explicitly changed that requirement.
6. REPORT: State the checked scope, result and remaining gaps. Task-only
   evidence does not prove a separate repair or the whole feature passed.
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Applicable command output: 0 failures, with scope | A stale result or "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to describe/save local changes, ask the user to advance the target bookmark, submit externally, create a PR, or mark a task complete without verification
- Trusting agent success reports
- Claiming a broader result than the verification covers
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without applicable verification evidence**

## Rationalisation Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Read the code and recorded results |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Claim only the checked scope and complete required checks |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
✅ Agent report → Inspect diff and results → Run missing checks → Report state
❌ Trust agent report
```

## Why This Matters

- Your human partner can only accept evidenced claims of completion. 
- Unverified work is inherently valueless

## When To Apply

Before claiming completion, accepting work, moving to the next task or submitting
externally. Changing the wording of a claim does not change its evidence needs.

## The Bottom Line

**No shortcuts for verification.**

Read the evidence. Fill gaps. Report the result.

This is non-negotiable.
