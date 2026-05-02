---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch code-reviewer subagent to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before asking the user to advance the target bookmark or submit externally

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Bound the review scope:**

Every review request must name the smallest accurate jj boundary:

- **Current change:** Use `@` when reviewing the current task's change.
- **Specific change:** Use a jj change ID when reviewing completed work that is not currently checked out.
- **Bookmark/range:** Use a bookmark or explicit range when reviewing a larger integrated slice.
- **File list fallback:** Use an exact file list only when the change boundary is unavailable or misleading.

Assume task workflows create reliable jj changes. Do not ask the reviewer to infer scope from full session history.

**2. Dispatch code-reviewer subagent:**

Use the current harness's subagent/delegation tool with the code-reviewer type if available, filling the template at `code-reviewer.md`

**3. Act on feedback:**
- Fix Critical/Important issues
- **Re-review Critical/Important fixes** using the smallest scope that proves the issue was resolved: specific files, affected tests, or a narrower jj boundary if appropriate
- Only proceed when no Critical/Important issues remain
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

[Dispatch code-reviewer subagent]
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
  PLAN_REFERENCE: Task 2 from `$DOCS_ROOT/$projectName/plans/<slug>.md`
  JJ_BOUNDARY: @

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready with fixes

You: [Fix progress indicators]

[Dispatch code-reviewer again to verify fix]
  DESCRIPTION: Verification of progress indicator fix
  PLAN_REFERENCE: Task 2 from `$DOCS_ROOT/$projectName/plans/<slug>.md`
  FIX_REVIEW_SCOPE:
    - Verify the progress indicator issue is fixed
    - Review only:
      - src/index-verifier.ts
      - src/index-repairer.ts
      - tests/index-verifier.test.ts
    - Confirm the relevant test command passes

[Subagent returns]:
  Strengths: Progress reporting now working correctly
  Issues: Minor: Magic number remains (acceptable)
  Assessment: Ready to proceed

[Continue to Task 3]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

**Executing Plans:**
- Review after all tasks complete
- Final check before asking the user to advance the target bookmark or submit externally

**Ad-Hoc Development:**
- Review before asking the user to advance the target bookmark or submit externally
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Skip re-review after fixing issues
- Ignore Critical issues
- Proceed with unfixed Critical/Important issues
- Proceed without verifying fixes worked
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: requesting-code-review/code-reviewer.md
