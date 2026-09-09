---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks
---

# Writing Plans

## Overview

Write code-complete implementation plans for an engineer with no session history. Supply actual production and test code, exact files, interfaces, cases and verification for each reviewable task. Choose the simplest implementation that satisfies the approved design. Resolve implementation structure during planning, not through implementer improvisation. DRY. YAGNI. TDD.

**Determine filenames from project conventions:**
- Use the user-provided feature slug, current jj bookmark/change description, or ask for a slug
- Design and plan documents always live in an external docs repo, separate from the code repo
- `$DOCS_ROOT` is the docs repo root. Resolve it from the `DOCS_ROOT` environment variable, or from the default defined in your instructions file. Expand it to an absolute path before using it in a file-tool path or a subagent prompt. If neither defines it, ask the user — never guess a path, and never fall back to writing docs in-repo
- Designs: `$DOCS_ROOT/$projectName/designs/`
- Plans: `$DOCS_ROOT/$projectName/plans/`
- Determine `$projectName` from the repo directory name unless the user specifies a different docs project name
- Determine the document slug:
  - If the current jj bookmark or change description is a good semantic identifier, you may reuse its slug
  - Otherwise ask the user for a feature/plan slug
- File naming:
  - Design file: `$DOCS_ROOT/$projectName/designs/<slug>.md`
  - Plan file: `$DOCS_ROOT/$projectName/plans/<slug>.md`

**Before writing:**
- Create the target directories if they don't exist
- Read the design file to understand architecture and design decisions
- Include architecture summary in the plan header

## Scope Check

If the design covers multiple independent subsystems, it should have been broken into sub-project designs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## Design Conformance

Read the approved design's `Program Design` section before choosing files or
tasks. Treat its file layout, unit boundaries and responsibilities, public
interfaces and consequential internal seams, and representative scenario call
paths as constraints.

Validate those artefacts against the repository before planning. If the plan
would move a responsibility, restructure approved files, introduce a public
dependency, change a public signature or error contract, or replace an approved
orchestration path, return `DesignRevisionRequired`, stop planning, and route the
change through design revision and review. Name the approved artefact, proposed
replacement, and exact conflict before stopping. Do not hide a material redesign
in a task brief.

Specify private helpers, algorithms and integration code in the plan. Implementers
may make local syntax or naming adjustments that preserve the planned structure,
behaviour and contracts. Binding an approved dependency as private state of the unit that owns
an unchanged method is equivalent local mechanics when the design leaves binding
unspecified; it does not permit ambient or global state or a new public contract.

## File Structure

Before defining tasks, map every approved programme-design file to its created,
modified, or removed plan path and responsibility. Preserve the approved
boundaries and supply the concrete implementation within them.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- Follow existing patterns. File size alone does not justify a split; additional architectural machinery requires user approval.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Plan Structure: Tasks and Subtasks

**PLAN.md = Feature/Overall Change**
- The complete approved change and its implementation sequence.

**Task = One reviewable vertical behaviour increment**
- One subagent and one fresh review gate per task.
- Normally suitable for one commit.
- Traverses every affected layer needed to demonstrate one behaviour; it need
  not span UI to persistence when the affected system has fewer layers.

**Subtask = Logical phase within a task**
- Failing test, minimal implementation, focused verification, refactor, and
  integrated outcome verification.

**Step = Meaningful implementation or verification action**
- State the requirement or exact check and expected result; size steps by the
  meaningful work.

A normal task is one reviewable vertical behaviour increment. Write every task,
including a decomposition-only or outline response, with each bold field below
in this order:

```markdown
**Behaviour:** What becomes possible after this task
**Scenario:** The approved scenario or branch this task implements
**Observable outcome:** The integrated check that demonstrates the behaviour
**Dependencies:** Earlier tasks required before this task
**Files:** Every cross-layer file created, modified, or removed
**Interfaces:** Exact contracts consumed and produced
**Implementation:** Complete production and test code, in execution order
**Exclusions:** Explicit non-goals
**Concrete cases:** Inputs, preconditions and independently derived expected outcomes
**Verification:** Exact commands, expected results and integrated outcome check
```

## Vertical Task Boundaries

Choose the smallest increment that has its own test cycle, observable integrated
outcome, and meaningful review gate. The first task is normally a tracer bullet
through the primary approved scenario, proving the boundaries and main call
path. Then prefer core behaviour, the smallest viable slice, highest novelty or
integration risk, remaining scenario branches, and finally hardening or polish
that cannot fit naturally into an earlier slice.

Split an oversized task by smaller observable behaviour or scenario branch, not
by technical layer. Treat each independently observable branch as a separate task
by default. Combine branches only when they form one coherent outcome and
coupling or task size would make separation impractical. Migrations, shared
infrastructure, scaffolding, and preparatory refactors belong to the first
behaviour slice that needs them unless
they form an independently safe, testable, and reviewable prerequisite.

A separate foundation task must state:

- why no observable vertical increment is practical;
- the independently verifiable state it produces;
- the later behaviour that consumes it.

Every task ends with integrated verification of its observable outcome. Unit
checks alone are insufficient when the approved scenario crosses boundaries.

Mark implementation tasks parallel only when they do not conflict in files,
interfaces, migrations or state transitions and the executor provides isolated
working copies. Shared-copy SDD implementation stays serial; independent
read-only legwork may run alongside it. Reduced parallelism is preferable to
deferring integration. Sequence shared entrypoints and stateful changes rather
than claiming unsafe independence.

Retain practical sizing discipline: normally 1–5 tasks per plan and 10 minutes
to 2 hours of work per task. A task must justify fresh subagent context transfer,
remain small enough for one review gate, and group files that change together.
Do not create micro-tasks for setup overhead or split tightly coupled files only
to increase apparent parallelism.

## Plan Document Header

Keep global constraints, shared contracts and required repository context before
the first task heading so `scripts/task-brief` includes them in every handoff.

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

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

## Shared contracts

[Exact interfaces and cross-task decisions every task needs, or "None".]

---
```

## Task implementation

Retain `## Task N:` headings and all plan metadata. Every task requires exactly
one `**Commit:**` conventional-commit subject describing delivered behaviour,
with no task number, plan slug, run ID or metadata. This is the exact subject
supplied to the controller helper. A missing subject blocks execution until the
user supplies it.

Use the fields above to make each extracted brief self-sufficient. Copy exact
values, signatures, cases and constraints verbatim; supply producer/consumer
contracts without requiring access to neighbouring tasks. The controller keeps
the full design and plan; task-scoped agents receive only their brief, supplied
context and explicitly named artefacts.

**Binding:** Behaviour, scenario, observable outcome, dependencies, files,
public contracts, security properties, architectural boundaries and explicitly
required decisions or snippets constrain implementation. Include exact consumed
and produced names, parameters, return/error contracts and necessary boundary
decisions. State exclusions. Escalate consequential redesign for controller
resolution and any required user approval.

**Code:** Include complete changed function bodies, new helpers, test bodies and
fixture construction. Name the existing code to reuse and show integration edits.
The plan fixes implementation structure as well as behaviour. An equivalent public
result does not justify a different private architecture. Local syntax or naming
adjustments are acceptable; missing implementation decisions go to the controller.

**Cases and verification:** Specify actual inputs, preconditions, expected
results and side effects. Require one parameterised case table when inputs
exercise the same behaviour; keep independently different behaviours in separate
tests. Derive expectations independently of implementation (see
@../test-driven-development/writing-good-tests.md). Require TDD's RED before
implementation, focused GREEN and integrated outcome verification, with exact
commands and expected results. Apply TDD's prose/configuration exception when no
useful executable test exists; required project checks still apply.

### Representative task

This hypothetical Python invitation service illustrates the required code detail.
Its paths and commands are examples, not checks to run in this skill repository.

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

Code steps require actual code. These are blocking gaps:

- Necessary behaviour or decisions left as "TBD", "TODO", "add validation" or
  "handle edge cases" without actual rules and outcomes.
- Production or test bodies left to the implementer, including generic instructions
  to add validation, helpers, fixtures or integration without showing the code.
- Tests requested without concrete cases and independently derived expectations.
- An undecided boundary, such as whether `expiresAt == now` is expired; clarify
  before dependent implementation.
- "Similar to Task N" instead of the requirements the extracted brief needs.
- Consumed types, functions or contracts neither supplied nor available in
  explicitly named repository context.

## Remember
- Exact file paths always
- Complete production/test code and concrete cases
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
- **Code completeness:** Every code step supplies its actual implementation or test body, with existing context and integration edits. Preserve independently derived expectations; parameterise the same behaviour's inputs.
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

- Load the `requesting-document-review` skill and run it on the plan document
  you just wrote (`type=plan`, `design-ref` = the design document this plan
  implements).
- This handoff always runs — there is no trivial-skip path for "the plan
  looks fine."
- Once that skill's loop terminates, proceed to Execution Handoff with the
  resulting plan.

## Execution Handoff

**VCS for the docs repo is the user's responsibility. Do not run jj/git commands in `$DOCS_ROOT` unless the user explicitly asks.**

Keep approved designs and plans after delivery. Review history, task reports and
verification logs remain in ignored scratch storage, outside commits. Amend plans
only for operative corrections or approved requirement changes. The executor runs
and records the required-check baseline before source edits; planning-only work
does not need a development test run.

If the user requested planning only, report the saved plan and stop. If they
already requested implementation and the plan preserves the approved design,
continue with their chosen executor without another approval prompt. Otherwise
use SDD when native subagents are available, or inline execution when they are
not, provided this preserves required review guarantees. Ask about the options
below only when that choice genuinely needs the user's decision:

**"Plan complete and saved to `<plan-file>`. Two execution options:**

**1. Subagent-Driven (recommended where the harness supports subagents)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, with its verification and final-review gates

**Which approach?"**

If the current harness has no subagent support, skip the question and use Inline Execution.

**If Subagent-Driven chosen:**
- Load the `subagent-driven-development` skill via the current harness's skill-loading mechanism
- Stay in this session
- Fresh subagent per task + code review

**If Inline Execution chosen:**
- Load the `executing-plans` skill via the current harness's skill-loading mechanism
- Continuous execution with verification and final review; pause only for consequential decisions or missing authority
