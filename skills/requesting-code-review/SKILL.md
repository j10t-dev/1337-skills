---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements - dispatches 1337-skills:code-reviewer subagent to review implementation against plan or requirements before proceeding
---

# Requesting Code Review

Dispatch 1337-skills:code-reviewer subagent to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Choose review mode based on context:**

**File-based mode (for per-task review):**
- Used by: subagent-driven-development
- Input: List of files the subagent modified
- Reviewer: Reads those files + discovers their test files automatically

**Auto-detect mode (for branch completion review):**
- Used by: finishing-a-development-branch
- Input: None (reviewer auto-detects uncommitted or committed changes)
- Reviewer: Uses git status/diff to find all changes

**2. Dispatch code-reviewer subagent:**

Use Task tool with 1337-skills:code-reviewer type, fill template at `code-reviewer.md`

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

[Dispatch 1337-skills:code-reviewer subagent]
  WHAT_WAS_IMPLEMENTED: Verification and repair functions for conversation index
  PLAN_OR_REQUIREMENTS: Task 2 from PLAN.md
  FILES_CHANGED: src/index-verifier.ts,src/index-repairer.ts
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready to proceed

You: [Fix progress indicators]
[Continue to Task 3]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

**Executing Plans:**
- Review after all tasks complete
- Final check before merging

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: requesting-code-review/code-reviewer.md
