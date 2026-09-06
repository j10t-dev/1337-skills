---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute
---

# Executing Plans

Execute inline when requested or subagents are unavailable.

The plan and supplied context are your requirements. Ask the controller for
missing context, or the user when executing standalone. Do not read the design.

## Start or Resume

1. Read the plan, its required skills and constraints, `Builds On`, `Feature Bookmark`, and one `Commit` subject per task. Stop on missing, duplicate or ambiguous metadata.
2. Use `.agents/sdd/progress.md` as the active-plan ledger. On a fresh run, resolve and record the full `Builds On` identities, require the feature bookmark to be absent, reject unexplained edits, position empty `@` on the run base, write the ledger, then create the feature bookmark there.
3. On resume, require the same plan metadata and run-base identities. Verify completed commits form one exact-subject, exact-parent path and the feature bookmark identifies the accepted tip.
4. Resume only the recorded task or final fix. If its exact accepted commit exists while the bookmark or ledger lags, advance the bookmark if needed, then record the full IDs. Stop on any other mismatch or divergence.

Ledger: plan path, bookmark names, run-base IDs and task/fix states: `in progress`, `pending (subject ...)`, or `change <full-id>, commit <full-id> (complete)`.

## Task Loop

For each task in order:

1. Confirm the ledger and feature bookmark identify the accepted tip. Write `Task N -> in progress` before new work; preserve that entry when resuming.
2. Keep `@` undescribed with the feature bookmark at `@-`.
3. Follow the plan's skills and TDD steps. Use `verification-before-completion` for required checks.
4. Only after verification passes, accept the task:
   - confirm non-empty undescribed `@` has the feature bookmark as its sole parent;
   - run `jj commit -m "<exact planned subject>"`;
   - run `jj bookmark set "<Feature Bookmark>" -r @-`;
   - record `@-`'s full change and commit IDs as complete.
5. Mark the task complete in the tracker and continue in the new empty `@`.

Inline execution has no task-review subagent and must not invent one. Verification is its acceptance gate. Never amend accepted work or move another bookmark.

## Final Review and Fixes

Review from the recorded run base through the feature bookmark. For findings:

1. Record an exact pending `fix:` subject before changing work.
2. Apply and verify the fix in undescribed `@`, then review from run base through `@`.
3. After clean re-review, repeat the acceptance sequence using the pending subject.
4. Reuse that review if the accepted content and requirements are unchanged.

After final review passes with no pending fix, remove `.agents/sdd/` and enter `finishing-development` at Step 3 with the existing evidence.

## Stop and Ask

Escalate missing requirements, scope changes or permissions to the controller.
Continue independent work; repair failures before acceptance.

Stop on unexplained edits, malformed state, identity mismatch, divergence or
undocumented recovery. Do not improvise history changes, integration or bookmark movement.

## Integration

**Required workflow skills:**
- `test-driven-development` for task implementation
- `verification-before-completion` before reporting success
- `finishing-development` after final review
