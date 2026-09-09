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

Stop affected delivery. If the user explicitly changes the delivery requirement, record the exception and remaining evidence gap before proceeding.

**If tests pass:** Continue to Step 2.

### Step 2: Code Review

Reuse completed review. After inline plan execution, this step owns the independent final review from the recorded run base through the feature bookmark, including agreed repairs and their evidence. The executor does not run that review. For other work, perform required review or ask about optional review if a specific concern merits it:

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

Use absolute paths. Expand `$DOCS_ROOT`, `$projectName` and `~` before dispatch; reviewers do not inherit your environment. See `writing-plans` for docs-root rules.

**After review:**
- Triage findings under `requesting-code-review`; reject factually false findings with evidence-backed rulings
- Fix and re-review genuine Critical/Important issues before proceeding, unless the user explicitly accepts an exception
- Note Minor issues

**If user skips review:**
- Continue to Step 3

For final-review fixes after inline plan execution, keep ownership in this finishing step:

1. Record an exact pending `fix:` subject in the existing scratch ledger before editing.
2. Apply the authorised fix in undescribed `@`, verify it, and obtain re-review from the run base through `@`. Use `requesting-code-review` for finding disposition and its three-round escalation limit.
3. Once verification and review pass, confirm the non-empty `@` has the feature bookmark as its sole parent, commit with the recorded subject, advance only that bookmark to `@-`, and record the full change and commit IDs as complete.
4. Reuse the review when acceptance preserved its code and requirements. On interruption, reconcile the ledger and repository under `subagent-driven-development/recovery.md`, resuming finishing rather than the executor.

A formally executed feature consists of accepted task commits plus any separately reviewed final-fix commits, and its feature bookmark identifies the accepted tip. Leave that curated local stack unchanged unless the user explicitly requests history reshaping or integration.

### Step 3: Present Completion Options

Before delivery, the controller reads the resulting implementation across affected execution paths and validates it against approved requirements, with particular attention to correctness and unnecessary complexity. Inspect baseline evidence, failures and agreed repairs. Resolve failures or obtain an explicit user-accepted limitation; broader repairs require user agreement, not automatic expansion. Reviewer approval and task-only passing evidence do not replace this check.

Report the outcome, checked scope and consequential decisions concisely. Keep approved designs/plans in the external docs repository. Review history, reports and logs stay in ignored scratch storage, outside commits; remove scratch after delivery, preserving unresolved work unless the user accepted its disposition. Carry out the requested next step; ask only for an unresolved decision. Do not append a standard menu.

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

