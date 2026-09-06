---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks
---

# Writing Plans

## Overview

Write implementation plans as behaviour contracts for a skilled engineer with no session history. Supply the decisions, interfaces, concrete cases, files and verification needed for each reviewable task. The implementer writes routine production and test bodies, choosing private mechanics within those contracts. DRY. YAGNI. TDD.

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

Private helpers, local algorithms, and equivalent implementation mechanics may
be left to the implementer when they preserve approved behaviour, boundaries, and
contracts. Binding an approved dependency as private state of the unit that owns
an unchanged method is equivalent local mechanics when the design leaves binding
unspecified; it does not permit ambient or global state or a new public contract.

## File Structure

Before defining tasks, map every approved programme-design file to its created,
modified, or removed plan path and responsibility. Preserve the approved
boundaries; planning supplies necessary contract decisions but leaves routine
private details to implementation.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure — but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

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
**Implementation decisions:** Binding choices and implementer discretion
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

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **Implementation handoff:** Use the `subagent-driven-development` skill (recommended where the harness supports subagent dispatch) or the `executing-plans` skill to implement this plan task-by-task.

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

---
```

## Task Contract

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

**Private mechanics:** Leave routine function and test bodies, private helpers,
local algorithms and fixture construction to the implementer. Equivalent
mechanics need no permission when binding requirements stay unchanged. Mark
optional snippets explicitly **Illustrative**; equivalent correct code need not
match their syntax. A snippet marked **Binding** remains a constraint.

**Cases and verification:** Specify actual inputs, preconditions, expected
results and side effects. Require one parameterised case table when inputs
exercise the same behaviour; keep independently different behaviours in separate
tests. Derive expectations independently of implementation (see
@../test-driven-development/writing-good-tests.md). Require TDD's RED before
implementation, focused GREEN and integrated outcome verification, with exact
commands and expected results. Apply TDD's prose/configuration exception when no
useful executable test exists; required project checks still apply.

### Representative Task (Illustrative)

This example describes a hypothetical Python invitation service, not this skill
repository. Its paths and check command are illustrative, not commands to run
here. Within such a task, the interfaces, decisions and case outcomes are
binding; routine production and test bodies are intentionally absent.

```markdown
## Task 1: Reject expired invitation acceptance without writes

**Commit:** `feat: reject expired invitation acceptance`

**Behaviour:** Acceptance rejects expired invitations without changing stored state.
**Scenario:** Existing acceptance entrypoint -> expiry decision -> existing successful acceptance path when unexpired.
**Observable outcome:** Expired acceptance returns expired with no writes; unexpired acceptance returns accepted and stores the acceptance.
**Dependencies:** None.

**Files:**
- Modify: `src/invitations/acceptance.py`
- Create: `tests/invitations/test_acceptance.py` (test)

**Interfaces:**
- Preserve `accept_invitation(invitation_id: str, now: datetime) -> Literal["expired", "accepted"]`.
- Existing invitation records expose `expiresAt: datetime`; both timestamps are UTC-aware.
- Preserve existing repository reads and successful acceptance writes.

**Implementation decisions:** `expiresAt <= now` is expired. Check expiry before any write. Private helper choice and local fixtures belong to the implementer. Public results, dependencies and architectural responsibilities stay unchanged.
**Exclusions:** Invitation revocation, new dependencies and changes to other acceptance preconditions.

**Concrete cases:** One parameterised acceptance test table. In every row the invitation exists, is pending, and meets all other acceptance preconditions; `now` is `2030-01-01T12:00:00Z`.

| Case | expiresAt | Expected result | Expected effects |
| --- | --- | --- | --- |
| `expiresAt < now` | `2030-01-01T11:59:59Z` | `expired` | No writes; stored state unchanged |
| `expiresAt == now` | `2030-01-01T12:00:00Z` | `expired` | No writes; stored state unchanged |
| `expiresAt > now` | `2030-01-01T12:00:01Z` | `accepted` | Existing successful acceptance writes; acceptance stored |

**Verification:**
1. Construct the parameterised test against the acceptance entrypoint with controlled storage and independently derived expectations. Run `pytest tests/invitations/test_acceptance.py::test_acceptance_expiry -v`; verify RED for the missing expiry behaviour, not fixture or syntax errors.
2. Implement the expiry decision; run the same command for GREEN: three cases pass.
3. That entrypoint test must verify returned results and persisted state/write effects together, demonstrating the integrated outcome. Run the project's required checks as well.
```

## Completeness, Not Full Bodies

An omitted routine production or test body is not a placeholder. A plan with
complete contracts and cases is ready for implementer-written code and tests.
These remain blocking gaps:

- Necessary behaviour or decisions left as "TBD", "TODO", "add validation" or
  "handle edge cases" without actual rules and outcomes.
- Tests requested without concrete cases and independently derived expectations.
- An undecided boundary, such as whether `expiresAt == now` is expired; clarify
  before dependent implementation.
- "Similar to Task N" instead of the requirements the extracted brief needs.
- Consumed types, functions or contracts neither supplied nor available in
  explicitly named repository context.

## Remember
- Exact file paths always
- Complete behaviour contracts and concrete cases, not routine bodies
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
- **Contract completeness:** Every task contains all required fields, necessary decisions and independently derived case expectations; routine bodies may be absent. Parameterise the same behaviour's inputs; keep distinct behaviours separate.
- **Binding versus illustrative:** Optional snippets are explicitly illustrative; public contracts, security, dependencies, architectural boundaries and required decisions remain binding.
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
