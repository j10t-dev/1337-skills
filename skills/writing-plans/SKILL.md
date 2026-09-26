---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks
---

# Writing Plans

## Overview

Write implementation plans for an engineer with no session history. Specify the simplest implementation that satisfies the approved design using whichever form is clearest and most compact: code, precise instructions or references to inspected existing code. Settle implementation choices during planning. Supply exact files, interfaces, concrete tests and verification for each reviewable task. DRY. YAGNI. TDD.

@../shared/docs-root.md

**Before writing:**
- Read the design file to understand architecture and design decisions
- Inspect affected code and relevant helpers; identify suitable existing implementations to reuse before specifying new code
- Include architecture summary in the plan header

## Scope Check

If the design covers multiple independent subsystems, it should have been broken into sub-project designs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## Design Conformance

Follow the approved design; ask the user before changing its behaviour, structure, interfaces or dependencies.

## File Structure

Before defining tasks, map every approved programme-design file to its created, modified, or removed plan path and responsibility. Preserve the approved boundaries and supply the concrete implementation within them.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- Follow existing patterns. File size alone does not justify a split; additional architectural machinery requires user approval.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Plan Structure: Tasks and Subtasks

**PLAN.md = Feature/Overall Change**
- The complete approved change and its implementation sequence.

**Task = One reviewable vertical behaviour increment**
- SDD uses one implementer and task review per task. Inline execution verifies tasks and hands off to finishing for review.
- Normally suitable for one commit.
- Traverses every affected layer needed to demonstrate one behaviour; it need not span UI to persistence when the affected system has fewer layers.

**Subtask = Logical phase within a task**
- Failing test, minimal implementation, focused verification, refactor, and integrated outcome verification.

**Step = One action with a checkable result**
- State what changes or what is checked, and the observable result that establishes completion.

A normal task is one reviewable vertical behaviour increment. Write every task, including a decomposition-only or outline response, with each bold field below in this order:

```markdown
**Behaviour:** What becomes possible after this task
**Scenario:** The approved scenario or branch this task implements
**Observable outcome:** The integrated check that demonstrates the behaviour
**Dependencies:** Earlier tasks required before this task
**Files:** Every cross-layer file created, modified, or removed
**Interfaces:** Exact contracts consumed and produced
**Implementation:** Chosen implementation and integration edits, using code, precise instructions or named existing code, plus concrete tests, in execution order
**Exclusions:** Explicit non-goals
**Concrete cases:** Inputs, preconditions and independently derived expected outcomes
**Verification:** Exact commands, expected results and integrated outcome check
```

## Vertical Task Boundaries

Choose the smallest increment that has its own test cycle, observable integrated outcome, and meaningful review gate. The first task is normally a tracer bullet through the primary approved scenario, proving the boundaries and main call path. Then prefer core behaviour, the smallest viable slice, highest novelty or integration risk, remaining scenario branches, and finally hardening or polish that cannot fit naturally into an earlier slice.

Split an oversized task by smaller observable behaviour or scenario branch, not by technical layer. Treat each independently observable branch as a separate task by default. Combine branches only when they form one coherent outcome and coupling or task size would make separation impractical. Migrations, shared infrastructure, scaffolding, and preparatory refactors belong to the first behaviour slice that needs them unless they form an independently safe, testable, and reviewable prerequisite.

A separate foundation task must state:

- why no observable vertical increment is practical;
- the independently verifiable state it produces;
- the later behaviour that consumes it.

Every task ends with integrated verification of its observable outcome. Unit checks alone are insufficient when the approved scenario crosses boundaries.

Mark implementation tasks parallel only when they do not conflict in files, interfaces, migrations or state transitions and the executor provides isolated working copies. Shared-copy SDD implementation stays serial; independent read-only legwork may run alongside it. Reduced parallelism is preferable to deferring integration. Sequence shared entrypoints and stateful changes rather than claiming unsafe independence.

Retain practical sizing discipline: normally 1–5 tasks per plan and 10 minutes to 2 hours of work per task. A task must justify fresh subagent context transfer, remain small enough for one review gate, and group files that change together. Do not create micro-tasks for setup overhead or split tightly coupled files only to increase apparent parallelism.

## Plan Document Header

Keep global constraints, shared contracts and required repository context before the first task heading so `scripts/task-brief` includes them in every handoff.

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **Controller handoff:** Use `subagent-driven-development` or `executing-plans` to execute this plan. Task-scoped agents follow only their assigned brief and must not start a plan executor.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach - summarise from the design]

**Design:** [absolute path to the approved design this plan implements]

**Builds On:** `feature-a`
**Feature Bookmark:** `feature-b`

`Builds On` must resolve to exactly one existing local bookmark target. `Feature Bookmark` must be absent at fresh-run start. `Feature Bookmark` is the new local output bookmark. The first feature may build on `main`; every dependent feature names the preceding feature bookmark. No value is guessed from an older plan, current working copy, plan slug, or stale ledger. A plan missing either field is incomplete and must not execute until the user supplies it.

`Design` is the absolute path to the approved design in `$DOCS_ROOT/$projectName/designs/`. Expand it. A literal `$DOCS_ROOT`, `$projectName`, or `~` reaches the executor as text it cannot resolve. The controller and document reviewer use the design. Task-scoped implementers use only their brief, supplied context and explicitly named artefacts; they ask the controller for missing requirements rather than locating the design, parent plan or neighbouring task materials.

**Tech Stack:** [Key technologies/libraries]

**Skills to Use:**
- test-driven-development
- verification-before-completion
- [Other relevant skills]

**Required Files:** (executor will auto-read these)
- @path/to/file1.py
- @path/to/file2.ts
- [Files the executor needs context from]

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits, naming and copy rules, platform requirements — one line each, with exact values copied verbatim from the spec. Every task's requirements implicitly include this section.]

## Shared contracts

[Exact interfaces and cross-task decisions every task needs, or "None".]

## Review focus

[Input classes or failure modes implied by the approved behaviour that the initial task tests missed. Name each expected outcome and the owning task, then add its test there. Write "None" when the check finds no gaps. New features require scope agreement.]

---
```

## Task implementation

Retain `## Task N:` headings and all plan metadata. Every task requires exactly one `**Commit:**` conventional-commit subject describing delivered behaviour, with no task number, plan slug, run ID or metadata. This is the exact subject supplied to the controller helper. A missing subject blocks execution until the user supplies it.

Use the fields above to make each extracted brief self-sufficient. Copy exact values, signatures, cases and constraints verbatim; supply producer/consumer contracts without requiring access to neighbouring tasks. The controller keeps the full design and plan; task-scoped agents receive only their brief, supplied context and explicitly named artefacts.

**Binding:** Behaviour, scenario, observable outcome, dependencies, files, public contracts, security properties, architectural boundaries and explicitly required decisions or snippets constrain implementation. Include exact consumed and produced names, parameters, return/error contracts and necessary boundary decisions. State exclusions. Escalate consequential redesign for controller resolution and any required user approval.

**Implementation choices:** Specify the approach, components to reuse, integration edits and consequential algorithm, dependency or ordering decisions. Use code when it states these most clearly and compactly; use exact edit instructions or named existing implementations when copying bodies would add repetition. Keep short, useful snippets. Supply concrete test bodies and fixtures with independent expectations. Avoid prose that merely repeats the code. Missing production bodies are acceptable when the remaining specification settles the implementation choices.

**Implementation discretion:** Small local extractions may remove demonstrated duplication. Implementers who discover suitable existing code the planner missed should inspect its contract, prefer reuse and report the substitution. These adjustments must preserve approved behaviour, responsibilities, interfaces and dependency constraints. Consequential changes or unresolved conflicts go to the controller.

**Cases and verification:** Specify actual inputs, preconditions, expected results and side effects. Require one parameterised case table when inputs exercise the same behaviour; keep independently different behaviours in separate tests. Derive expectations independently of implementation (see @../test-driven-development/writing-good-tests.md). Require TDD's RED before implementation, focused GREEN and integrated outcome verification, with exact commands and expected results. Apply TDD's prose/configuration exception when no useful executable test exists; required project checks still apply.

### Representative task

This hypothetical Python invitation service keeps the short production body because code states the decision more compactly than prose. Its paths and commands are examples, not checks to run in this skill repository.

````markdown
## Task 1: Reject expired invitation acceptance

**Commit:** `fix: reject expired invitation acceptance`

**Behaviour:** Acceptance rejects invitations expiring at or before now.
**Scenario:** Existing acceptance function -> expiry check -> accepted-state update.
**Observable outcome:** Expired invitations remain unaccepted; a future invitation becomes accepted.
**Dependencies:** None.
**Files:** Modify `src/invitations/acceptance.py`; create `tests/invitations/test_acceptance.py`.
**Interfaces:** Preserve `accept_invitation(invitation: Invitation, now: datetime) -> Literal["expired", "accepted"]`. Existing `Invitation` is a dataclass with `expires_at: datetime` and `accepted: bool = False`, in the same module. Both timestamps are UTC-aware.

**Implementation:** Write this test first in `tests/invitations/test_acceptance.py`:

```python
from datetime import datetime

import pytest

from invitations.acceptance import Invitation, accept_invitation


@pytest.mark.parametrize(
    "expiry, expected_result, expected_accepted",
    [
        ("2030-01-01T11:59:59+00:00", "expired", False),
        ("2030-01-01T12:00:00+00:00", "expired", False),
        ("2030-01-01T12:00:01+00:00", "accepted", True),
    ],
)
def test_acceptance_expiry(expiry, expected_result, expected_accepted):
    invitation = Invitation(expires_at=datetime.fromisoformat(expiry))
    now = datetime.fromisoformat("2030-01-01T12:00:00+00:00")

    assert accept_invitation(invitation, now) == expected_result
    assert invitation.accepted is expected_accepted
```

After observing RED, replace the existing function in `src/invitations/acceptance.py` with this complete body. Retain the existing dataclass and imports of `datetime` and `Literal`:

```python
def accept_invitation(
    invitation: Invitation, now: datetime
) -> Literal["expired", "accepted"]:
    if invitation.expires_at <= now:
        return "expired"
    invitation.accepted = True
    return "accepted"
```

**Exclusions:** Persistence, invitation revocation, new dependencies and additional validation.
**Concrete cases:** The test supplies exact timestamps, return values and resulting accepted state for before/equal/after expiry. No additional layer participates in this example.
**Verification:** Run `uv run pytest tests/invitations/test_acceptance.py -v` before implementation and observe the two expired rows fail. After implementation, the same command passes all three rows and checks the returned result and state together. Run the project's required checks.
````

## No placeholders

Every task must settle the decisions its implementation needs. These are blocking gaps:

- Necessary behaviour or decisions left as "TBD", "TODO", "add validation" or "handle edge cases" without actual rules and outcomes.
- Unresolved implementation or integration choices hidden behind generic instructions to add validation, helpers or error handling.
- Tests requested without concrete cases and independently derived expectations.
- An undecided boundary, such as whether `expiresAt == now` is expired; clarify before dependent implementation.
- "Similar to Task N" instead of the requirements the extracted brief needs.
- Consumed types, functions or contracts neither supplied nor available in explicitly named repository context.

## Remember
- Exact file paths always
- Clear implementation decisions, concrete test code and cases
- Exact commands with expected results; label illustrative commands
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD
- Plan reviewable units that build cleanly on each other and can be revised independently

## Plan Review (before sharing with user)

Review the plan yourself before sharing it.

**Inline self-review checklist:**

- **Spec coverage:** Every requirement from the design has a task or explicit non-goal.
- **File accuracy:** Every referenced file path exists or is explicitly marked `Create:`.
- **Task boundaries:** Each task is large enough to justify subagent context transfer, but small enough to review independently.
- **Dependency order:** Sequential dependencies are ordered; independent tasks are marked as safe to parallelise only if they do not edit the same files.
- **TDD shape:** Behaviour changes specify concrete cases and RED before implementation, then GREEN; apply TDD's prose/configuration exception where appropriate.
- **Verification:** Every task has exact commands and expected results, with illustrative commands clearly labelled.
- **Implementation completeness:** Code, precise instructions and named references settle the implementation and integration choices. Existing reuse candidates have been considered. Test bodies retain independent expectations and parameterised cases for one behaviour.
- **Review focus:** Check for input classes and failure modes implied by the approved behaviour but missing from the initial tests. Add their cases to the owning tasks and summarise them in Review focus; keep new features outside this check.
- **Scope and complexity:** Every new mechanism serves the approved design. Equivalent outputs alone do not justify additional machinery.
- **Type consistency:** Types, method signatures, and property names used in later tasks match what earlier tasks defined. A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.
- **Context sufficiency:** A competent task-scoped executor can complete the task from its extracted brief, supplied context and named artefacts alone, with exact values preserved and no need to locate the full design or neighbouring tasks.
- **Linear position:** `Builds On` resolves to exactly one existing local bookmark target and `Feature Bookmark` is a distinct semantic output bookmark absent at fresh-run start; dependent plans form one explicit stack.
- **Commit subjects:** Every task has exactly one suitable conventional-commit subject describing its delivered behaviour, with no task number or plan/run metadata.
- **Programme-design conformance:** Planned files, responsibilities, public interfaces, consequential seams, and scenario paths match the approved `Program Design`; material conflicts returned to design revision.
- **Verticality:** Each normal task is one observable behaviour increment rather than a layer, component batch, or test-only follow-up.
- **Integrated outcome:** Every task states and verifies an observable integrated result after focused GREEN checks.
- **Foundation exceptions:** Every foundation-only task explains why no vertical increment is practical, proves independent state, and names its later consumer.
- **Task/commit coherence:** Each task is one coherent reviewable unit normally suitable for one commit.
- **Parallel safety:** Tasks marked parallel share no files, interfaces, migrations, or state transitions.

A plan missing any of the three required field classes is incomplete and must not execute until the user supplies it.

Fix any issues inline before sharing the plan.

## Independent Review

- Load the `requesting-document-review` skill and run it on the plan document you just wrote (`type=plan`, `design-ref` = the design document this plan implements).
- This handoff always runs — there is no trivial-skip path for "the plan looks fine."
- Once that skill's loop terminates, proceed to Execution Handoff with the resulting plan.

## Execution Handoff

**VCS for the docs repo is the user's responsibility. Do not run jj/git commands in `$DOCS_ROOT` unless the user explicitly asks.**

Preserve the user's existing execution choice. Otherwise recommend an approach based on task coupling, risk and the benefit of independent task reviews, then present these options:

**"Plan complete and saved to `<plan-file>`. Two execution options:**

**1. Subagent-Driven** - Fresh implementer per task and independent task review; useful when those reviews justify the context transfer

**2. Inline Execution** - Execute and verify in this session with less coordination overhead, then hand off to finishing-development for independent final review

**Which approach?"**

Offer only inline execution when subagents are unavailable.

**If Subagent-Driven chosen:**
- Load the `subagent-driven-development` skill via the current harness's skill-loading mechanism
- Stay in this session
- Fresh subagent per task + code review

**If Inline Execution chosen:**
- Load the `executing-plans` skill via the current harness's skill-loading mechanism
- Execute and verify, then hand off to finishing-development for final review and delivery; pause execution for consequential decisions or missing authority
