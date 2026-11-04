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

Without a subagent tool, read `../requesting-code-review/code-reviewer.md` and perform that review yourself as a separate pass over the same boundary. Fix or dismiss its findings under the rules below, absorb the fixes as described below, then present the delivery report, stating that the final review was a self-review and asking whether that is enough. Under a formal plan, keep `Final review -> in progress` until the user accepts; then write `Final review -> complete (self-review: no subagent tool)`. Ad-hoc work has nothing to write. If the user rejects, dispatch a reviewer when one becomes available or the user names another route.

Handle the report under `receiving-code-review`. For a formal plan: rule on findings and Declined-to-judge lines the approved design settles, one `Ruling:` line each in `.agents/sdd/progress.md`, and put the rest to the user; fix genuine issues, verify the changes and re-review until clean, within the rounds and five-round cap of `../subagent-driven-development/review-handling.md`, recorded as `Final review -> in progress (fix round N of 5)`; where no implementer is dispatched, fix your own work under the same cap. Read `../subagent-driven-development/review-handling.md` again before every final-review fix pass, including self-review passes; the cap and its record do not survive compaction otherwise.

For ad-hoc work, with no plan and no progress file: the same five-round cap applies, counted in the conversation; a finding the user's request settles may be dismissed with the reason stated in the delivery report; at the cap everything else goes to the user. No progress file or design is required. In either case, explain mistaken findings directly and escalate blockers.

After a clean final review of a formal plan, absorb fixes into its task commits with `jj absorb --from @ --into '<run-base>..<Feature Bookmark>'`. Before squashing what remains, list it with `jj diff --summary -r @`. Put files that belong to no task (notes, scratch output, drafts) to the user: keep in a separate change, move out of the repository, or delete. Squash the rest into the relevant task commit, or ask if ownership is unclear. Refresh completed commit IDs in the progress file; leave the run base and other features untouched. Reuse verification and review when the code is unchanged.

### Step 3: Present Completion Options

Deliver when required checks pass and review is complete, or state the limitations the user explicitly accepted.

Report the outcome, checked scope, every `Ruling:` line from the progress file in order, and the Declined-to-judge lines left for the user, concisely.

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
