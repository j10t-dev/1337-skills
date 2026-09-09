---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute
---

# Executing Plans

Execute inline when requested or subagents are unavailable.

Execute the approved plan and supplied context; do not reopen design or plan approval. Ask the controller about missing requirements, or the user when working standalone.

## Planned implementation

Execute the supplied production and test code, interfaces, exclusions and cases under TDD. Local syntax or naming adjustments may fit repository conventions; equivalent outputs do not justify a different implementation structure. Missing code or integration decisions need clarification before dependent work. Additional behaviour or architectural machinery requires user approval.

Preserve exact cases and independently derived expectations. Parameterise one behaviour's inputs; keep distinct operations separate. Use TDD's prose/configuration exception where no useful executable test exists, retaining required checks.

## Start or Resume

1. Read the plan, its required skills and constraints, `Builds On`, `Feature Bookmark`, and one `Commit` subject per task. Stop on missing, duplicate or ambiguous metadata.
2. Initialise ignored scratch with `../subagent-driven-development/scripts/sdd-workspace` and use its `progress.md` as the ledger. On a fresh run, resolve and record the full `Builds On` identities, require the feature bookmark to be absent, reject unexplained edits, position empty `@` on the run base, write the ledger, then create the feature bookmark there. Establish the required-check baseline under `verification-before-completion` before source edits; on resume retain applicable baseline evidence.
3. On resume, load `../subagent-driven-development/recovery.md`. Require the same plan metadata and run-base identities. Verify completed commits form one exact-subject, exact-parent path and the feature bookmark identifies the accepted tip. Combined repairs use the amended prospective plan subject; reconcile recorded scope/subject intent before continuing and stop on incomplete or inconsistent intent.
4. Resume the recorded execution task. If its exact accepted commit exists while the bookmark or ledger lags, advance the bookmark if needed, then record the full IDs. Pending final-review work belongs to the caller or `finishing-development`, not this executor. Stop on any other mismatch or divergence.

Ledger: plan path, bookmark names, run-base IDs and task/fix states: `in progress`, `pending (subject ...)`, or `change <full-id>, commit <full-id> (complete)`.

## Task Loop

For each task in order:

1. Confirm the ledger and feature bookmark identify the accepted tip. Write `Task N -> in progress` before new work; preserve that entry when resuming.
2. Keep `@` undescribed with the feature bookmark at `@-`.
3. Follow the plan's skills and TDD steps. Use `verification-before-completion` for required checks.
4. Only after verification passes for the task and any agreed blocking repair, accept the task:
   - confirm changed paths contain only approved work, with no scratch material;
   - confirm non-empty undescribed `@` has the feature bookmark as its sole parent;
   - run `jj commit -m "<exact planned subject>"`;
   - run `jj bookmark set "<Feature Bookmark>" -r @-`;
   - record `@-`'s full change and commit IDs as complete.
5. Mark the task complete in the tracker and continue in the new empty `@`.

Verification is the execution gate. Do not commission plan, task, repair or final reviews here. Never amend accepted work or move another bookmark.

## Failures and blockers

Investigate verification failures against the baseline, changed code and environment. Fix introduced regressions within scope. Report commands, actual output and attribution evidence; do not dismiss failures as pre-existing or treat a passing rerun as a diagnosis. Escalate repairs beyond approved scope to the controller, or the user when standalone. Continue only independent authorised work while blocked.

For an agreed blocking repair, preserve the task's edits, record its scope and evidence in scratch, and verify both scopes. If the prospective task subject needs correction, record the original and replacement subjects and reason before updating the still-unaccepted plan entry. Never amend an accepted commit. Separate work needs an explicit assignment, not an automatic repair programme.

## Completion

Report completed tasks, verification evidence and unresolved blockers to the caller. Preserve the ledger and scratch evidence for the finishing handoff. When executing standalone, invoke `finishing-development` from Step 1 with that evidence. Execution completion does not claim final acceptance; review, final code validation and delivery belong to the caller or finishing workflow.

## Stop and Ask

Escalate missing requirements, scope changes or permissions to the controller. Continue independent authorised work; the controller scopes repairs and resolves blocking failures before acceptance, and separately managed failures before delivery.

Stop on unexplained edits, malformed state, identity mismatch, divergence or undocumented recovery. Do not improvise history changes, integration or bookmark movement.

## Integration

**Required workflow skills:**
- `test-driven-development` for task implementation
- `verification-before-completion` before reporting success
- `finishing-development` after standalone execution
