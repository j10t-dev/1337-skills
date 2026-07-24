---
name: requesting-document-review
description: Use when a design or implementation-plan document has been written and needs an independent review before proceeding
---

# Requesting a Document Review

## Overview

Hand a just-written design or plan document to an independent reviewer in a
fresh context, triage its findings, and loop until the document is approved or
the loop bound is reached.

**REQUIRED:** Use the `receiving-code-review` skill to triage every round's
findings — validate each claim against the actual document, never blind-apply.

Dispatch mechanics — role, model, and result inspection — follow the
`working-with-subagents` skill.

## The Loop

1. **Dispatch one reviewer for this round.** Use a fresh subagent of the
   current harness with no session history, and give it the prompt template
   for the document type:

   - `design`: the `brainstorming` skill's `spec-document-reviewer-prompt.md`.
     Resolve `[DESIGN_FILE_PATH]` to the document under review.
   - `plan`: the `writing-plans` skill's `plan-document-reviewer-prompt.md`.
     Resolve `[PLAN_FILE_PATH]` to the document under review and
     `[DESIGN_FILE_PATH]` to the design the plan must align with. A plan
     review always checks the plan against its design, so that reference is
     required.

   Instruct the reviewer to emit only the Status block — Status, Issues,
   Recommendations — as its entire response.

   If the dispatch fails, or the response contains no Status block, that is a
   failed invocation to diagnose and retry — it is not a review round and
   consumes nothing from the 3-round review bound. Stop after 2 consecutive
   failed invocations; report the failure plainly instead of retrying
   indefinitely.

2. **Load `receiving-code-review` and triage.** Check every finding against
   the actual document. Fix legitimate ones. Reject misreads with a one-line
   reason. Treat the prompt's "Recommendations (advisory)" as non-blocking —
   never a reason to keep looping.

3. **Dispatch a fresh reviewer** on the revised document.

4. **Stop when:**
   - the reviewer returns `Status: Approved`, or
   - 3 rounds have run (the initial review is round 1, so at most 2
     revise-and-recheck passes follow it), or
   - 2 consecutive failed invocations occur, or
   - the review has converged — every remaining finding is one already
     assessed and deliberately not actioned.

5. **Report:** rounds run, fixes applied (with a diff summary), findings
   rejected and why, final reviewer status. If issues remain at the cap, say
   so plainly — no false "done".

## Substituting an External Reviewer

When the user explicitly asks for a cross-harness check and this harness
provides an external-reviewer adapter skill, load that skill and use it as the
reviewer for every round. The dispatch mechanism is the only thing that
changes: triage, bounds, convergence, and reporting are exactly as above.

Never substitute an external reviewer on your own initiative — the automatic
path is always a native subagent.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Blind-applying the reviewer's findings | Triage under `receiving-code-review` every round |
| Reusing one reviewer across rounds | Dispatch a fresh context each round |
| Looping past convergence | Stop once remaining findings are already-assessed repeats |
| Treating advisory recommendations as blocking | Only "Issues Found" entries gate approval |
| Reaching for an external harness automatically | Native subagent unless the user asked for a cross-harness check |
