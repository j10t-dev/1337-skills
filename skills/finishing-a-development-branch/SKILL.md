---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

**Before presenting options, verify tests pass:**

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

**Ask user if they want code review:**

Use AskUserQuestion tool:
```
Question: "Tests pass. Want code review before finishing?"
Options:
  - "Yes, review changes" → Dispatch code-reviewer
  - "No, skip review" → Proceed to Step 3
```

**If user wants review:**

Dispatch code-reviewer in auto-detect mode:
```
Task tool (code-reviewer):
  model: "opus"
  description: "Review branch completion"
  prompt: |
    You are reviewing code changes for production readiness.

    Use auto-detect mode:
    - Run git status to check for uncommitted changes
    - If uncommitted: review via git diff
    - If clean: review via git diff main..HEAD

    Review against: PLAN.md requirements (if exists) or general code quality

    Follow review checklist from code-reviewer.md template
```

**After review:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues

**If user skips review:**
- Continue to Step 3

### Step 3: Report Completion

Inform user:
```
Work complete, all tests passing.
```

**Do not perform git operations** (commit, push, PR, merge) - user controls all git workflow.

## Common Mistakes

**Skipping test verification**
- **Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" → ambiguous
- **Fix:** Present exactly 4 structured options

## Red Flags

**Never:**
- Proceed with failing tests
- Delete work without confirmation
- Force-push without explicit request

**Always:**
- Verify tests before offering options

## Integration

