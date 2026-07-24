---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Determine filenames from project conventions:**
- Use the user-provided feature slug, current jj bookmark/change description, or ask for a slug
- Design and plan documents always live in an external docs repo, separate from the code repo
- `$DOCS_ROOT` is the docs repo root. Use the `DOCS_ROOT` environment variable if set; otherwise default to `~/dev/j10t-docs`
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
be resolved in the plan when they preserve approved behaviour, boundaries, and
contracts. Binding an approved dependency as private state of the unit that owns
an unchanged method is equivalent local mechanics when the design leaves binding
unspecified; it does not permit ambient or global state or a new public contract.

## File Structure

Before defining tasks, map every approved programme-design file to its created,
modified, or removed plan path and responsibility. Preserve the approved
boundaries; planning fills in private details but does not redesign public
structure.

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

**Step = Individual action (2–5 minutes)**
- Exact content, command, and expected result.

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

Mark tasks parallel only when they do not conflict in files, interfaces,
migrations, or state transitions. Reduced parallelism is preferable to
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

**Architecture:** [2-3 sentences about approach - summarise from DESIGN.md]

**Builds On:** `feature-a`
**Feature Bookmark:** `feature-b`

`Builds On` must resolve to exactly one existing local bookmark target. `Feature Bookmark` must be absent at fresh-run start. `Feature Bookmark` is the new local output bookmark. The first feature may build on `main`; every dependent feature names the preceding feature bookmark. No value is guessed from an older plan, current working copy, plan slug, or stale ledger. A plan missing either field is incomplete and must not execute until the user supplies it.

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

## Task Structure

```markdown
## Task N: [Observable behaviour]

**Commit:** `feat: add recovery modes`

This is the exact conventional-commit subject supplied to the controller helper. It describes delivered behaviour and contains no task number, plan slug, run ID, or metadata. A plan missing this field for any task is incomplete and must not execute until the user supplies it.

**Behaviour:** [What becomes possible]
**Scenario:** [Exact approved call tree or branch]
**Observable outcome:** [Human or automated integrated observation]
**Dependencies:** [Task references or `None`]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [exact names, parameters, and return types from approved design or earlier tasks]
- Produces: [exact names, parameters, and return types later tasks use]

### Subtask N.1: Write and verify the failing behaviour test

**Step 1:** Write the failing test

```python
def test_specific_behaviour():
    result = function(input)
    assert result == expected
```

**Step 2:** Run the test to verify RED

Run: `pytest tests/path/test.py::test_specific_behaviour -v`
Expected: FAIL for the missing behaviour, not a fixture or syntax error.

### Subtask N.2: Implement and verify the behaviour

**Step 1:** Write the minimal approved implementation

```python
def function(input):
    return expected
```

**Step 2:** Run focused verification

Run: `pytest tests/path/test.py::test_specific_behaviour -v`
Expected: PASS.

**Step 3:** Verify the observable integrated outcome

Run: `[exact entrypoint or integration-test command]`
Expected: `[exact externally observable output, state transition, or effect]`.
```

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
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
- **TDD shape:** Behaviour changes include failing-test steps before implementation steps.
- **Verification:** Every task has exact commands and expected output.
- **No placeholders:** Scan for the patterns in the No Placeholders section above and fix them.
- **Type consistency:** Types, method signatures, and property names used in later tasks match what earlier tasks defined. A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.
- **Context sufficiency:** A competent executor with no session history can complete the task from the plan plus listed required files.
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

- Load the `requesting-pi-review` skill and run it on the plan document you
  just wrote (`type=plan`, `design-ref` = the design document this plan
  implements).
- This handoff always runs — there is no trivial-skip path for "the plan
  looks fine."
- Once that skill's loop terminates, proceed to Execution Handoff with the
  resulting plan.

## Execution Handoff

**VCS for the docs repo is the user's responsibility. Do not run jj/git commands in `$DOCS_ROOT` unless the user explicitly asks.** Proceed directly to offering execution choice:

**"Plan complete and saved to `<plan-file>`. Two execution options:**

**1. Subagent-Driven (recommended where the harness supports subagents)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?"**

If the current harness has no subagent support, skip the question and use Inline Execution.

**If Subagent-Driven chosen:**
- Load the `subagent-driven-development` skill via the current harness's skill-loading mechanism
- Stay in this session
- Fresh subagent per task + code review

**If Inline Execution chosen:**
- Load the `executing-plans` skill via the current harness's skill-loading mechanism
- Batch execution with checkpoints for review
