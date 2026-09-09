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

Use absolute paths. Expand `$DOCS_ROOT`, `$projectName` and `~` before dispatch; reviewers do not inherit your environment. See `writing-plans` for docs-root rules.

**3. Act on feedback:**
- Triage findings against requirements and repository evidence at any round.
- Resolve a factually false finding with a scratch ruling containing the original finding, evidence, rejection reason and cost if wrong. No fix or replacement passing verdict is needed solely to confirm rejection; it consumes no fix round.
- Fix genuine Critical/Important defects and re-review the smallest scope that proves resolution. After three fix rounds, escalate remaining genuine defects to the user; controller-only deferral cannot permit acceptance. Explicit user exceptions remain possible.
- Record Minor issues for final triage. Keep original rejected findings, rulings and all repair work items available to final review for independent reassessment.
- Review agreed repairs against their requirements and baseline evidence. Broader repair scope requires user agreement, not merely a review finding. Resolve failures before delivery unless the user explicitly accepts a stated limitation.
- Keep findings and review history in responses or ignored scratch storage. Update plans/designs for operative corrections or approved requirement changes, not review commentary.
- The controller inspects actual changes before acceptance and the resulting implementation against approved requirements before delivery. Review verdicts do not replace this final correctness and complexity check.

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
    Important: Required cancellation leaves a write running
    Minor: Magic number (100) for reporting interval
  Assessment: Ready with fixes

You: [Verify the defect and fix cancellation]

[Dispatch code-reviewer again to verify fix]
  DESCRIPTION: Verification of cancellation fix
  PLAN_REFERENCE: Task 2 from `/abs/path/to/docs/<projectName>/plans/<slug>.md`
  FIX_REVIEW_SCOPE:
    - Verify cancellation stops the owned write
    - Review only:
      - src/index-verifier.ts
      - src/index-repairer.ts
      - tests/index-verifier.test.ts
    - Confirm the relevant test command passes

[Subagent returns]:
  Strengths: Cancellation now stops the owned write
  Issues: Minor: Magic number remains (acceptable)
  Assessment: Ready to proceed

[Continue to Task 3]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Follow SDD's task-acceptance rules

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
- Bypass the task or final acceptance rules above
- Proceed without verifying fixes worked
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Record an evidence-backed rejection in scratch when factually disproved; ask for clarification when evidence remains insufficient

See template at: requesting-code-review/code-reviewer.md
