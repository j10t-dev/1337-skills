---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

@../working-with-subagents/SKILL.md

# Subagent-Driven Development

Dispatch a fresh implementer and task reviewer for each task, then a final whole-branch reviewer after implementation.

The approved design is the source of truth. Follow the plan; ask before adding behaviour or architecture. Execute authorised tasks without routine continuation prompts.

## Dispatch

Every implementer, fixer, and task-reviewer dispatch explicitly supplies a model selected under `working-with-subagents`. Every final-review dispatch does the same. Use known inheritance when no explicit model is exposed. The final whole-branch reviewer handles architecture and high-risk judgement, so use the most capable available model.

Keep implementation serial in a shared working copy. Independent read-only work may run concurrently. Only the controller performs VCS operations.

Every implementer, fixer, and task-reviewer dispatch includes:

- the complete task, common plan requirements, required code and interfaces;
- scope, writable paths, necessary tools and exclusions;
- relevant baseline commands, results and elapsed times;
- the task-scoped context boundary from the prompt template.

Supply this context directly or by reference when a file is useful. `scripts/task-brief PLAN_FILE N` extracts common plan requirements and the selected task, ignoring headings inside code blocks. Check handoff completeness before dispatch. Further delegation requires controller permission.

## Start or resume

1. Read the plan, its required context and skills, `Builds On`, `Feature Bookmark`, and each task's `Commit` subject. Derive a missing subject from the approved task and record it before execution. Ask about other missing or conflicting requirements; do not infer run bases or feature identity.
2. Resolve `Builds On` to one local bookmark target and retain its full change and commit IDs as the run base.
3. Read `.agents/sdd/progress.md` if it exists. On resume, follow [recovery.md](recovery.md); do not restart completed tasks.
4. On a fresh run, require the feature bookmark to be absent and stop on unexplained edits. Position empty `@` on the run base with `jj new <Builds On>` if needed, then create the declared feature bookmark there.
5. Inspect the design/plan baseline under [the shared verification policy](../shared/verification.md). Reuse applicable results; fill missing or invalidated checks before dependent implementation and surface any consequence for the approved design.

## Progress

Keep the repository's current progress in `.agents/sdd/progress.md`, ignored by VCS. This is the single record of completed work, work underway and where to resume after compaction.

```text
plan: /absolute/path/to/plan.md
builds on: feature-a
feature bookmark: feature-b
run base: change <full change ID>, commit <full commit ID>

Task 1 -> change <full change ID>, commit <full commit ID> (complete)
Task 2 -> in progress
Task 3 -> pending
Final review -> pending | in progress | complete
```

Create the file when starting a plan and update it as work progresses.

## Task loop

1. Mark the next task `in progress` and keep its undescribed `@` directly above the feature bookmark.
2. Dispatch a fresh implementer using [implementer-prompt.md](implementer-prompt.md).
3. For `DONE`, send the task, implementer response and diff to a fresh reviewer using [task-reviewer-prompt.md](task-reviewer-prompt.md). For `DONE_WITH_CONCERNS`, include the concerns. For `NEEDS_CONTEXT` or `BLOCKED`, supply the missing context or resolve the blocker before continuing.
4. Require passing checks and both spec-compliance and code-quality verdicts. Handle feedback under [review-handling.md](review-handling.md); fix genuine defects and re-review.
5. Accept the task using the sequence below, mark it complete and continue.

The controller uses the reviewers' verdicts and reported check results; it does not conduct an additional code review.

### Accepting a task

1. Confirm the non-empty, undescribed `@` has the feature bookmark as its sole parent.
2. Run `jj commit -m "<exact planned subject>"`.
3. Run `jj bookmark set "<Feature Bookmark>" -r @-`.
4. Read `@-` with `jj log -r @- --no-graph -T 'change_id ++ " " ++ commit_id'` and update the task's completed IDs.

This authorises only the declared feature bookmark and planned task commits. Reviewed final fixes are absorbed during finishing; other history changes, integration and external actions still require user permission.

## Review handoffs

Task reviews cover `@-` through `@`; the final review covers the run base through the feature bookmark, or through `@` while fixes are uncommitted.

Supply the diff directly, or use `scripts/review-package BASE HEAD` when a file helps. Supply requirements and relevant test results, not the session's history. Do not tell reviewers which findings to suppress or how to grade them. Reuse applicable checks rather than asking reviewers to rerun the suite.

Each fix assignment names the defect and tests that exercise the changed behaviour. The implementer reports the result before re-review.

## Finish

After all tasks are complete, pass the run base, feature bookmark, progress file and test results to `finishing-development` at Step 2 for final review and delivery.

## Context boundaries

Every implementer, fixer, and task-reviewer dispatch must say that the supplied brief, context and named artefacts are its complete task boundary. Missing requirements go to the controller. This restriction does not apply to the final whole-branch reviewer.

Never:

- Let a task-scoped subagent locate or read the parent plan, neighbouring tasks, progress ledger, prior-task materials or session history.
- Dispatch parallel implementers into the shared working copy.
- Let an implementer commission its own reviewer or perform VCS operations.
- Skip task review or accept unresolved correctness defects without an explicit user exception.
- Ask the user to settle a routine matter already answered by the approved requirements.

## Integration

- `writing-plans` supplies the approved implementation plan.
- `test-driven-development` governs implementation.
- `shared/verification.md` governs baselines, evidence reuse and failure handling; `verification-before-completion` checks acceptance and delivery claims.
- `requesting-code-review` supplies the final reviewer template.
- `finishing-development` handles final review, fixes and delivery.
- `executing-plans` is the inline alternative without task subagents.
