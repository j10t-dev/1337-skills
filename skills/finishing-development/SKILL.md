---
name: finishing-development
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work
---

# Finishing Development Work

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Present options → Execute choice → Clean up.

## The Process

### Step 1: Verify Tests

Use `verification-before-completion` to reuse existing results and fill gaps.
If verification and review are complete, enter Step 3.

```bash
# Run project's test suite
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**
```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot proceed until tests pass.
```

Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

### Step 2: Optional Code Review

Reuse completed review. Otherwise perform required review, or ask about optional
review if a specific concern merits it:

```
Question: "Tests pass. Want code review before finishing?"
Options:
  - "Yes, review changes" → Dispatch code-reviewer
  - "No, skip review" → Proceed to Step 3
```

**If user wants review:**

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

Use absolute paths. Expand `$DOCS_ROOT`, `$projectName` and `~` before dispatch;
reviewers do not inherit your environment. See `writing-plans` for docs-root rules.

**After review:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues

**If user skips review:**
- Continue to Step 3

A formally executed feature already consists of accepted task commits plus any separately reviewed final-fix commits, and its feature bookmark identifies the accepted tip. Leave that curated local stack unchanged unless the user explicitly requests history reshaping or integration.

### Step 3: Present Completion Options

Report the outcome and evidence. Carry out the requested next step; ask only for
an unresolved decision. Do not append a standard menu.

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
- Proceed with failing tests
- Delete work without confirmation
- Push, submit, move bookmarks, or rewrite shared history without explicit request

**Always:**
- Verify tests before offering options

## Integration

