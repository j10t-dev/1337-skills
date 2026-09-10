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

- **Task in progress:** Use the supplied `@-..@` package.
- **Completed task:** Review a supplied completed change ID when needed, not as an immutable base snapshot.
- **Final feature:** Use the recorded run-base commit through the feature bookmark.
- **Pending final fix:** Use run base through `@`.
- **File list fallback:** Use an exact file list only when the change boundary is unavailable or misleading.

Assume task workflows create reliable jj changes. Do not ask the reviewer to infer scope from full session history.

Reuse reviews of unchanged code and requirements. Use `verification-before-completion` for test evidence.

**2. Dispatch code-reviewer subagent:**

Use the current harness's subagent/delegation tool with the code-reviewer type if available, filling the template at `code-reviewer.md`

Use absolute paths. Expand `$DOCS_ROOT`, `$projectName` and `~` before dispatch; reviewers do not inherit your environment. See `../shared/docs-root.md` for docs-root rules.

**3. Act on feedback:**
- Communicate disagreements directly, using implementer or reviewer evidence as needed.
- Fix genuine code defects and re-review the smallest scope that proves resolution until clean. Escalate actual blockers, not arbitrary round limits.
- Broader repair scope requires user agreement, not merely a review finding.
- Return reviews in responses, not forced files.

## Example

```
[Just completed Task 2: Add verification function]

[Dispatch code-reviewer subagent]
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
  PLAN_REFERENCE: Task 2 from `/abs/path/to/docs/<projectName>/plans/<slug>.md`
  JJ_BOUNDARY: @

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready with fixes

You: [Have the implementer add progress indicators]

[Dispatch code-reviewer again to verify fix]
  DESCRIPTION: Verification of progress indicators
  PLAN_REFERENCE: Task 2 from `/abs/path/to/docs/<projectName>/plans/<slug>.md`
  FIX_REVIEW_SCOPE:
    - Verify progress indicators report completed and total work
    - Review only:
      - src/index-verifier.ts
      - src/index-repairer.ts
      - tests/index-verifier.test.ts
    - Confirm the relevant test command passes

[Subagent returns]:
  Strengths: Progress indicators now show completed and total work
  Issues: Minor: Magic number remains (acceptable)
  Assessment: Ready to proceed

[Continue to Task 3]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Follow SDD's task-acceptance rules

**Finishing a Development Branch:**
- Owns final review after inline execution completes
- Final check before asking the user to advance the target bookmark or submit externally

**Ad-Hoc Development:**
- Review before asking the user to advance the target bookmark or submit externally
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Skip re-review after fixing issues
- Ignore Critical issues
- Bypass the task or final acceptance rules above
- Proceed without verifying fixes worked
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Explain the disagreement directly; ask for clarification when evidence remains insufficient

See template at: requesting-code-review/code-reviewer.md
