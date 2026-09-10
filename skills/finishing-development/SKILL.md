---
name: finishing-development
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work
---

# Finishing Development Work

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

For formal plans, read `.agents/sdd/progress.md` on entry and update it as finishing progresses.

**Core principle:** Verify tests → Present options → Execute choice → Clean up.

## The Process

### Step 1: Verify Tests

Use `verification-before-completion` to reuse existing results and fill gaps. If verification and review are complete, enter Step 3, retaining its outstanding-work gate.

```bash
# Run project's test suite
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**
```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot deliver until tests pass or the user explicitly changes the delivery requirement.
```

Stop affected delivery unless the user explicitly accepts the stated limitation.

**If tests pass:** Continue to Step 2.

### Step 2: Code Review

Reuse a completed review of unchanged code; otherwise review the whole feature from its run base, including uncommitted fixes. For other work, perform required review or ask about optional review:

```
Question: "Tests pass. Want code review before finishing?"
Options:
  - "Yes, review changes" → Dispatch code-reviewer
  - "No, skip review" → Proceed to Step 3
```

**When review is required or requested:**

Dispatch code-reviewer with an explicit jj boundary:
```
Subagent/delegation tool (code-reviewer):
  description: "Review completion boundary"
  prompt: |
    Use the template at requesting-code-review/code-reviewer.md.

    Review scope:
    - JJ_BOUNDARY: [use `@`, a specific jj change ID, bookmark, or explicit range]
    - PLAN_REFERENCE: [absolute path to the relevant plan document, if available]
    - DESCRIPTION: completion review for the implemented work

    Do not infer scope from session history or auto-detect from ambient repository state.
```

If a documentation path needs resolution before dispatch, read `../shared/docs-root.md`.

Fix genuine issues, verify the changes and re-review until clean; explain mistaken findings directly and escalate blockers.

After a clean final review of a formal plan, absorb fixes into its task commits with `jj absorb --from @ --into '<run-base>..<Feature Bookmark>'`. If changes remain, squash them into the relevant task commit or ask if ownership is unclear. Refresh completed commit IDs in the progress file; leave the run base and other features untouched. Reuse verification and review when the code is unchanged.

### Step 3: Present Completion Options

Deliver when required checks pass and review is complete, or state the limitations the user explicitly accepted.

Report the outcome, checked scope and consequential decisions concisely.

**Do not perform integration operations** (rebase shared work, move bookmarks, submit externally, create/update PRs, or advance the target bookmark) unless the user explicitly asks. The user controls final jj/git-colocated integration.

## Common Mistakes

**Skipping test verification**
- **Problem:** Ask the user to advance the target bookmark or submit externally with broken code
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" → ambiguous
- **Fix:** Ask for the specific decision needed

## Red Flags

**Never:**
- Deliver with unresolved failures without an explicit user change to the delivery requirement
- Delete work without confirmation
- Push, submit, move bookmarks, or rewrite shared history without explicit request

**Always:**
- Verify tests before offering options

## Integration

