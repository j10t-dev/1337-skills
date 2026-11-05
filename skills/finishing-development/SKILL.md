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

Complete the [verification maintenance gate](../shared/verification-maintenance.md) before dispatching the final reviewer, including when execution enters directly at this step. Pass its result and maintenance edits with the review.

Select the most capable available model explicitly for the whole-feature review, with its reasoning effort, under `working-with-subagents`. Reuse a completed review of unchanged code; otherwise review the whole feature from its run base, including uncommitted fixes. For other work, perform required review or ask about optional review:

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
  model: [most capable available model, selected under working-with-subagents]
  reasoning effort: [set together with the model]
  prompt: |
    Use the template at requesting-code-review/code-reviewer.md.

    Review scope:
    - JJ_BOUNDARY: [use `@`, a specific jj change ID, bookmark, or explicit range]
    - PLAN_REFERENCE: [absolute path to the relevant plan document, if available]
    - DESCRIPTION: completion review for the implemented work

    Do not infer scope from session history or auto-detect from ambient repository state.
```

If a documentation path needs resolution before dispatch, read `../shared/docs-root.md`.

Without a subagent tool, read `../requesting-code-review/code-reviewer.md` and perform that review yourself as a separate pass over the same boundary. Label it a self-review in the delivery report and ask whether that is enough; under a formal plan, keep `Final review -> in progress` until the user accepts, then write `Final review -> complete (self-review: no subagent tool)`. If the user rejects, dispatch a reviewer when one is available.

Handle findings under `receiving-code-review`, within the rounds and five-round cap of `../subagent-driven-development/review-handling.md`; read it again before each fix pass. Under a formal plan, record `Final review -> in progress (fix round N of 5)` in `.agents/sdd/progress.md`. Under a formal plan or when a trail exists, log to `.agents/sdd/decisions.tsv` under `../show-me-your-work/SKILL.md`: a `ruling` row for each finding or Declined-to-judge line the approved design settles, a `fix` row when a fix round opens and a `review` row with the final outcome. For ad-hoc work without a trail, the user's request settles findings, with the reason stated in the delivery report. Everything else at the cap goes to the user. Explain mistaken findings directly and escalate blockers.

After a clean final review of a formal plan, absorb fixes into its task commits with `jj absorb --from @ --into '<run-base>..<Feature Bookmark>'`. List what remains with `jj diff --summary -r @`: squash task files into their task commit, ask if ownership is unclear, and put files that belong to no task (notes, scratch output) to the user. Refresh completed commit IDs in the progress file; leave the run base and other features untouched. Reuse verification and review when the code is unchanged.

### Step 3: Present Completion Options

Deliver when required checks pass and review is complete, or state the limitations the user explicitly accepted.

Confirm the maintenance gate's result covers the final state. If it is missing or invalidated, complete it and review any resulting edits before delivery; a direct entry at this step does not bypass the gate.

Report the outcome, checked scope, the scope's operative ruling rows in order (or, without a trail, the rulings stated during review), and the Declined-to-judge lines left for the user, concisely. When `.agents/sdd/decisions.tsv` holds a row whose run is this run's id, first audit this run's rows against the transcript, derive the scope's operative ruling rows, run the cross-model trail review, and log the stop row, all under `../show-me-your-work/SKILL.md` ("Stopping and resuming"), and end the report with the `reviewed by` line and the `Attention` block.

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
