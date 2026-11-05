# Verification maintenance at completion

Before final code review of a completed feature or ad-hoc change, check whether the change invalidates project verification. This gate runs once for the completed scope, including uncommitted work. Task acceptance and intermediate task reviews do not each start a maintenance pass. Reuse a recorded assessment and proof when they still cover the final code, verification files and environment; revisit only what later fixes invalidate, following [verification.md](verification.md).

## Assess applicability

Identify the complete change boundary and existing evidence. Locate project verification skills through project instructions and `.agents/skills/`, including any other documented locations. Read their feature maps and formal coverage records; names alone do not establish coverage. Record any absent kind of project verification. If neither kind exists, record which locations were checked and which verification is absent, retain the project's existing required checks, and report the gap. Absence does not establish that a feature is verified and does not authorise generating a new skill.

When project verification exists, dispatch one read-only assessment agent under `working-with-subagents`. Supply the change boundary, the project skill paths, changed source and configuration, and available verification evidence. The agent checks:

- Which mapped user journeys, launch instructions, prerequisites, selectors or harness commands the change affects, including new or removed user-facing behaviour missing from the map.
- Which formal properties, covered functions, model assumptions or bounds the change affects. Trace renamed or moved code, callers and new writers of shared state; a file-name intersection alone is insufficient.
- Whether relevant existing evidence covers the changed behaviour and current verification instructions, and where coverage or evidence is missing.

The agent returns each selected project skill and journey or property, the changed source or configuration that justifies selection, evidence that can be reused, and gaps or blockers. An unaffected result names the inspected boundary and why coverage still applies. The agent neither edits files nor drives the application. If delegation is unavailable, the controller performs the same assessment and records that it was inline.

## Maintain the affected scope

For each affected application skill, invoke `maintain-verification-skill` with its absolute path, the selected journeys, new or removed behaviour, the change boundary and reusable evidence. For affected formal coverage, invoke `maintain-formal-verification-skill` with its absolute path and selected properties and covered code. These are scoped completion passes; an explicit full audit retains the maintainer's complete coverage pass.

The controller owns maintenance and live driving. Reuse assessment/source-reader findings when they supply the evidence the maintainer requires. Add missing journeys to an existing map when source establishes the intended behaviour. For a selected formal check, inspect every change to its covered code since its sync commit, including working-copy edits. Changes to shared launch code, harnesses or assumptions can affect several journeys or properties; expand the scope when the evidence requires it.

Prove corrected instructions by following them. Rerun affected properties and demonstrate that changed formal checks still detect a deliberately broken variant, as the formal maintainer requires. Reuse applicable live and formal results under the shared verification policy; a changed recipe, model or dependency invalidates the evidence it affects.

Maintenance edits verification artefacts only. Report product bugs to the controller for handling within the development task's authority. Preserve the required behaviour and properties; a failure is not permission to weaken either. Missing required coverage, unreachable prerequisites and blocked verification are explicit gaps, handled under the shared failure policy before affected completion claims. Keep unrelated authorised work moving.

## Hand off to final review

Record the assessed change boundary, selected scope or reason no maintenance applies, maintenance outcomes, evidence paths and remaining gaps in the existing progress record or task report. No separate ledger is required. Include all maintenance edits and this result in the final code review. If review fixes invalidate it, maintain the affected portion and include those edits in the next review.

For a maintenance-only task, its completed scope and proof supply the gate result; do not invoke maintenance recursively. Maintenance grants no additional commit, external-action or production-access authority.
