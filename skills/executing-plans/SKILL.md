---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute
---

# Executing Plans

Execute inline when requested or subagents are unavailable.

Execute the approved plan and supplied context; do not reopen design or plan approval. Ask the controller about missing requirements, or the user when working standalone.

## Planned implementation

Implement the supplied production and test code, interfaces, exclusions and cases following TDD. Local syntax or naming adjustments must fit repository conventions; equivalent outputs do not justify a different implementation structure. Missing code or integration decisions need clarification before dependent work. Additional behaviour or architectural machinery requires user approval.

Preserve exact cases and independently derived expectations. Parameterise one behaviour's inputs; keep distinct operations separate. Use TDD's prose/configuration exception where no useful executable test exists, retaining required checks.

## Start or Resume

1. Read the plan, its required skills and constraints, `Builds On`, `Feature Bookmark`, and one `Commit` subject per task. Stop on missing, duplicate or ambiguous metadata.
2. Track the plan path, bookmarks, run-base IDs and each task's state in the harness or chat checklist. On a fresh run, require the feature bookmark to be absent, stop on unexplained edits, position empty `@` on the run base and create the declared bookmark there.
3. On resume, follow `../subagent-driven-development/recovery.md`; resume the unfinished execution task, not completed work or final review.
4. Establish the baseline under `verification-before-completion` before source edits; reuse applicable results on resume.

## Task Loop

For each task in order:

1. Confirm the progress tracker and feature bookmark identify the accepted tip, then mark the task `in progress`.
2. Keep `@` undescribed with the feature bookmark at `@-`.
3. Follow the plan's skills and TDD steps. Use `verification-before-completion` for required checks.
4. Only after verification passes for the task and any agreed blocking repair, accept the task:
   - confirm non-empty undescribed `@` has the feature bookmark as its sole parent;
   - run `jj commit -m "<exact planned subject>"`;
   - run `jj bookmark set "<Feature Bookmark>" -r @-`;
   - record `@-`'s full change and commit IDs as complete.
5. Mark the task complete in the tracker and continue in the new empty `@`.

Verification is the execution gate. Do not commission plan, task, repair or final reviews here. Never amend accepted work or move another bookmark.

## Failures and blockers

Investigate verification failures against the baseline, changed code and environment. Fix introduced regressions within scope. Report commands, actual output and attribution evidence; do not dismiss failures as pre-existing or treat a passing rerun as a diagnosis. Escalate repairs beyond approved scope to the controller, or the user when standalone. Continue only independent authorised work while blocked.

Preserve the task's edits when fixing an agreed blocker, verify both scopes, and update the unaccepted plan entry if the repair changes its instructions or commit subject.

## Completion

Report completed tasks, check results and unresolved blockers to the caller; when standalone, pass these and the progress tracker to `finishing-development` from Step 1.

## Stop and Ask

Escalate missing requirements, scope changes or permissions while continuing independent authorised work.

Stop on unexplained edits, malformed state, identity mismatch, divergence or undocumented recovery. Do not improvise history changes, integration or bookmark movement.

## Integration

**Required workflow skills:**
- `test-driven-development` for task implementation
- `verification-before-completion` before reporting success
- `finishing-development` after standalone execution
