# Review handling

Load for review findings, unverifiable requirements or implementer escalation. Root `SKILL.md` retains the acceptance gate and controller-only VCS authority. Inline controllers use the triage and repair rules with `../executing-plans/SKILL.md`'s verification and final-review pattern, not SDD's per-task dispatch or verdict requirements. Its inline repair sequence replaces the SDD dispatch steps below.

## Findings and Handling Reviewer items

Triage each finding against requirements and repository evidence at any round, including round 0. A factually false finding is resolved immediately by a durable ruling containing the original finding, evidence, rejection reason and cost if wrong. Use root `SKILL.md`'s existing `Ruling:` form. Keep the original finding and ruling available to final review. No fix or replacement passing reviewer verdict is required solely to confirm that rejection; rejection consumes no fix round.

Disagreement or an arguable preference is not evidence that a finding is false. Genuine Critical/Important findings require fixes, applicable verification and re-review. Minor findings remain recorded for final triage. A user may explicitly accept an exception; record its scope and consequences. Controller-only deferral cannot resolve a genuine Critical/Important defect.

For `⚠️ Cannot verify from diff`, the controller checks the missing plan or cross-task evidence and records a ruling for each item. A confirmed gap follows the genuine-defect path. Unresolved evidence blocks acceptance, not independent authorised work.

## Fix Rounds

Rounds one and two go back to the same implementer. Round three goes to a fresh implementer on the most capable available model, even when that was already the model in use. Three rounds is the cap.

Record the round on the task's in-progress ledger line before dispatch. Each fix assignment carries the implementer contract, covering test files and required checks; confirm its report gives commands and actual output before re-review of the same boundary. Re-review covers both spec compliance and quality, including any repair requirements.

At round 3, triage remaining findings without dispatching another fix round. Reject demonstrably false findings with evidence. If a genuine Critical/Important defect remains, escalate to the user and pause acceptance unless the user explicitly grants an exception. Do not reset the cap by calling the same defect a repair or final fix. Acceptance follows root `SKILL.md`, Accepting a Task or Final Fix.

## NEEDS_CONTEXT and BLOCKED

For NEEDS_CONTEXT, supply missing requirements and re-dispatch within the original boundary. Routine private mechanics remain the implementer's choice.

For BLOCKED, assess the evidence. Supply context for a context gap; use a more capable model for a reasoning gap. A routine plan correction needs a recorded ruling carried in the brief. Substantial repairs, consequential redesign and reserved actions require user escalation. Never force an unchanged retry or silently enlarge the implementer's scope. Continue only independent authorised work.

## Apparently unrelated failures

The implementer reports the command, actual failure output and evidence for why it appears unrelated. The controller determines disposition, not the implementer. Record every such failure as repair work with requirements, verification and review.

### Bounded blocking repair in the active change

Use this exception only for a bounded repair needed to pass the active task's required checks, without consequential redesign or new action permissions.

1. Record a scope ruling identifying the failure, evidence, repair brief/report paths and why the repair is bounded and blocking. Keep the task in progress; this repair is not a separately accepted commit or a new ledger state.
2. Before combined acceptance, record the original and replacement prospective commit subjects and reason in a ruling. Amend only the still-unaccepted task's `**Commit:**` subject in the plan. This narrow plan-text authority grants neither documentation-repository VCS nor accepted-commit amendment. Regenerate its task brief so exact-subject reconciliation uses the amended plan.
3. Dispatch a separate serial fixer with its own brief, binding interfaces and tests. Wait for the current implementer to stop editing first. Preserve original edits and task-scoped context boundaries; no splitting, rebasing or extra bookmark permissions arise.
4. Give the task reviewer the original task requirements, repair brief and both reports explicitly. Review `@-` through `@` for both scopes, with spec and quality verdicts covering each. Both must pass applicable checks and all findings must be resolved under root `SKILL.md`'s acceptance gate.
5. Accept once through root `SKILL.md`, Accepting a Task or Final Fix, using the amended prospective subject. Record the usual task commit identities, not a fictitious separate repair commit.

If the repair proves substantial or requires consequential redesign, stop affected work and ask the user. Do not improvise a history operation to separate existing edits. On interruption, load `recovery.md` before continuing.

### Non-blocking separate repair

Record a durable unblocking/final-fix work item using root `SKILL.md`'s existing pending subject forms, with its own brief and evidence. Keep it out of the active task's implementation scope; dispatch serially at a safe boundary after active-task acceptance. Verify and review it against its requirements before accepting it via root `SKILL.md`, Accepting a Task or Final Fix. Continue independent authorised work, but resolve every recorded failure before final delivery unless the user explicitly changes that requirement.

Final review receives all repair work items, original rejected findings and rulings and may reassess them independently. Cleanup must preserve unresolved work and unreported rulings.
