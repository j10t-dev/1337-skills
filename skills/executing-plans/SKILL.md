---
name: executing-plans
description: "Use when executing an implementation plan inline, without task subagents: the user chose inline execution or no subagent tool is available"
---

# Executing Plans

Execute inline when requested or subagents are unavailable.

Execute the approved plan and supplied context; do not reopen design or plan approval. Ask the controller about missing requirements, or the user when working standalone. Execute all authorised tasks without routine continuation prompts.

## Planned implementation

Implement the plan's decisions, whether supplied as code, precise instructions or references to existing code, following TDD. Preserve approved behaviour, responsibilities, interfaces, exclusions and exact cases. Missing production bodies alone do not block execution; unresolved implementation or integration decisions need clarification before dependent work. Additional behaviour or architectural machinery requires user approval.

Extract small local helpers to remove demonstrated duplication. If you find suitable existing code the planner missed, inspect its contract, prefer reuse and report the substitution. These adjustments must preserve the planned behaviour, architectural boundaries and dependency constraints. Escalate consequential changes or unresolved conflicts to the controller, or the user when standalone; continue independent specified work.

Preserve exact cases and independently derived expectations. Parameterise one behaviour's inputs; keep distinct operations separate. Use TDD's prose/configuration exception where no useful executable test exists, retaining required checks.

## Start or Resume

1. Read the plan, its required skills and constraints, `Builds On`, `Feature Bookmark`, and one `Commit` subject per task; stop on missing, duplicate or ambiguous metadata. Read the design the plan's `Design:` line names; stop if it is missing, and escalate a plan-design conflict the same way as any other.
2. Keep the plan path, bookmarks, run-base IDs and task progress in `.agents/sdd/progress.md`; before its first write, create `.agents/sdd/.gitignore` containing `*` if absent, never overwriting an existing one, and tell the user if the file is already tracked. Read it on resume and update it as work progresses. Its `plan:` line identifies the plan it records; a fresh run overwrites an existing file only when it shows `Final review -> complete`, otherwise stop and ask. On a fresh run, require the feature bookmark to be absent, stop on unexplained edits, position empty `@` on the run base and create the declared bookmark there. Rulings do not arise here; log baseline, task-accepted (check results and commit ID), blocker and stop rows to `.agents/sdd/decisions.tsv` under `../show-me-your-work/SKILL.md`, each with this run's id and the plan path as scope.
3. On resume, follow `../subagent-driven-development/recovery.md`; resume the unfinished execution task, not completed work or final review.
4. Establish the baseline under `verification-before-completion` before source edits; reuse applicable results on resume.

## Task Loop

For each task in order:

1. Confirm the progress file and feature bookmark identify the accepted tip, then mark the task `in progress`.
2. Keep `@` undescribed with the feature bookmark at `@-`.
3. Follow the plan's skills and TDD steps. Use `verification-before-completion` for required checks; send long output to a file under `.agents/sdd/` and read its tail.
4. Accept the task, and any agreed blocking repair, only when:
   - each specified test was seen failing before implementation and passes in a focused run, or the inspection a prose-exception task names has been done;
   - each `Verification` expected result matches actual output;
   - each required project check named by `../shared/verification.md` passes; a failure blocks acceptance until fixed within scope or escalated;
   - each reported substitution or extraction is recorded as `Task N note: <what>`.
5. Accept in one call:
   - confirm non-empty undescribed `@` has the feature bookmark as its sole parent;
   - run `jj commit -m "<exact planned subject>"`;
   - run `jj bookmark set "<Feature Bookmark>" -r @-`;
   - record `@-`'s full change and commit IDs as complete, with one `Task N check: <command as typed> -> <last non-blank output line>` per required check beneath.
6. Continue in the new empty `@`.

Verification is the execution gate. Do not commission plan, task, repair or final reviews here. Never amend accepted work or move another bookmark.

## Failures and blockers

Investigate verification failures against the baseline, changed code and environment. Fix introduced regressions within scope. Report commands, actual output and attribution evidence; do not dismiss failures as pre-existing or treat a passing rerun as a diagnosis. Escalate repairs beyond approved scope to the controller, or the user when standalone. Continue only independent authorised work while blocked.

Preserve the task's edits when fixing an agreed blocker, verify both scopes, and update the unaccepted plan entry if the repair changes its instructions or commit subject.

## Completion

Report completed tasks, check results and unresolved blockers to the caller; when standalone, pass these and the progress file to `finishing-development` from Step 1.

## Stop and Ask

Escalate missing requirements, scope changes or permissions while continuing independent authorised work.

Stop on unexplained edits, malformed state, identity mismatch, divergence or undocumented recovery. Do not improvise history changes, integration or bookmark movement.

## Integration

**Required workflow skills:**
- `test-driven-development` for task implementation
- `verification-before-completion` before reporting success
- `finishing-development` after standalone execution
