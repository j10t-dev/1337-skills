---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute
---

# Executing Plans

Execute inline when requested or subagents are unavailable.

When executing standalone, read the approved design as the source of truth and
validate the plan against it. When delegated, use only the supplied brief and
context; ask the controller for gaps rather than locating the parent design.

## Planned implementation

Execute the supplied production and test code, interfaces, exclusions and cases
under TDD. Local syntax or naming adjustments may fit repository conventions;
equivalent outputs do not justify a different implementation structure. Missing
code or integration decisions need clarification before dependent work. Additional
behaviour or architectural machinery requires user approval.

Preserve exact cases and independently derived expectations. Parameterise one
behaviour's inputs; keep distinct operations separate. Use TDD's prose/configuration
exception where no useful executable test exists, retaining required checks.

## Start or Resume

1. Read the plan, its required skills and constraints, `Builds On`, `Feature Bookmark`, and one `Commit` subject per task. Stop on missing, duplicate or ambiguous metadata.
2. Initialise ignored scratch with `../subagent-driven-development/scripts/sdd-workspace` and use its `progress.md` as the ledger. On a fresh run, resolve and record the full `Builds On` identities, require the feature bookmark to be absent, reject unexplained edits, position empty `@` on the run base, write the ledger, then create the feature bookmark there. Establish the required-check baseline under `verification-before-completion` before source edits; on resume retain applicable baseline evidence.
3. On resume, load `../subagent-driven-development/recovery.md`. Require the same plan metadata and run-base identities. Verify completed commits form one exact-subject, exact-parent path and the feature bookmark identifies the accepted tip. Combined repairs use the amended prospective plan subject; reconcile recorded scope/subject intent before continuing and stop on incomplete or inconsistent intent.
4. Resume only the recorded task or final fix. If its exact accepted commit exists while the bookmark or ledger lags, advance the bookmark if needed, then record the full IDs. Stop on any other mismatch or divergence.

Ledger: plan path, bookmark names, run-base IDs and task/fix states: `in progress`, `pending (subject ...)`, or `change <full-id>, commit <full-id> (complete)`.

## Task Loop

For each task in order:

1. Confirm the ledger and feature bookmark identify the accepted tip. Write `Task N -> in progress` before new work; preserve that entry when resuming.
2. Keep `@` undescribed with the feature bookmark at `@-`.
3. Follow the plan's skills and TDD steps. Use `verification-before-completion` for required checks.
4. Only after verification passes for all authorised scopes, including a combined repair, accept the task. Resolve any findings under Controller triage below before acceptance:
   - inspect the actual diff for correctness, approved scope and unnecessary complexity;
   - confirm changed paths contain only approved work, with no scratch material;
   - confirm non-empty undescribed `@` has the feature bookmark as its sole parent;
   - run `jj commit -m "<exact planned subject>"`;
   - run `jj bookmark set "<Feature Bookmark>" -r @-`;
   - record `@-`'s full change and commit IDs as complete.
5. Mark the task complete in the tracker and continue in the new empty `@`.

Inline execution has no task-review subagent and must not invent one. Verification is its acceptance gate. Never amend accepted work or move another bookmark.

## Controller triage and repairs

When executing standalone, you carry controller responsibility for failures and
findings. Investigate failures against the baseline, changed code and environment.
When delegated, report the command, actual output and evidence to the controller.
Continue only independent authorised work; do not dismiss failures as pre-existing
or silently enlarge scope.

For findings or unrelated failures, load
`../subagent-driven-development/review-handling.md`. Apply its evidence-backed
rejection, three-round cap and user-escalation rules. A false finding can resolve
at round 0 without a replacement passing verdict; genuine Critical/Important
fixes require re-review and remaining genuine defects at round 3 require user
escalation, not controller deferral.

For a repair beyond approved scope, obtain user agreement first. For an agreed
bounded blocking repair, record a separate scratch brief and scope ruling, then
record original/replacement prospective subjects and reason and amend only the
still-unaccepted task's plan subject. Perform the repair serially, inline on this
execution path, preserving the original edits. Verify both scopes before one
combined task acceptance. Include both requirements and reports explicitly in
the existing final review, or any applicable repair re-review. This adds no
mandatory per-task subagent. Substantial repairs or consequential redesign need
user approval; no history or bookmark permissions expand.

Report unrelated findings with evidence and agree their disposition with the user;
do not automatically create a repair programme. Record agreed separate repairs
using the existing unblocking/final-fix pending subject forms. Resolve failures
before delivery unless the user explicitly accepts a stated limitation. Acceptance uses this skill's Task Loop, with the recorded
pending subject for separately reviewed fixes.

## Final Review and Fixes

Review from the recorded run base through the feature bookmark, supplying all
repair requirements/reports, original rejected findings and rulings for independent
reassessment. Triage findings first. For genuine defects requiring fixes:

1. Record an exact pending `fix:` subject before changing work.
2. Apply and verify the fix in undescribed `@`, then review from run base through `@`.
3. After re-review and resolution of findings under Controller triage, repeat the acceptance sequence using the pending subject. Track fix rounds in the fix report without changing ledger forms; at three, escalate genuine unresolved Critical/Important defects instead of dispatching another wave.
4. Reuse that review if the accepted content and requirements are unchanged.

Before delivery, read the resulting implementation across affected execution paths
and validate it against the approved design. Resolve failures and agreed repairs,
or record explicit user-accepted limitations. Report results and consequential
rulings concisely, then remove scratch after delivery. Keep approved designs/plans,
not review history or execution logs. Enter `finishing-development` at Step 3 with
the existing evidence.

## Stop and Ask

Escalate missing requirements, scope changes or permissions to the controller.
Continue independent authorised work; the controller scopes repairs and resolves
blocking failures before acceptance, and separately managed failures before delivery.

Stop on unexplained edits, malformed state, identity mismatch, divergence or
undocumented recovery. Do not improvise history changes, integration or bookmark movement.

## Integration

**Required workflow skills:**
- `test-driven-development` for task implementation
- `verification-before-completion` before reporting success
- `finishing-development` after final review
