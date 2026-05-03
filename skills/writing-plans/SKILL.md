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

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure — but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Plan Structure: Tasks and Subtasks

**PLAN.md = Feature/Overall Change**
- The big picture: "User CSV Export", "Code Review Workflow Simplification"

**Task = Unit of work for one subagent**
- One subagent dispatched per Task
- Sized based on coupling, dependencies, file conflicts, and logical coherence (see Task Boundaries below)

**Subtask = Logical phase within a task**
- Contains specific steps for the subagent to execute

**Step = Individual action (2-5 minutes)**
- Granular instruction with exact commands and expected output

## Task Boundaries - What Makes a Good Task?

A task is the smallest unit that carries its own test cycle and is worth a
fresh reviewer's gate. Fold setup, configuration, scaffolding, and
documentation steps into the task whose deliverable needs them; split only
where a reviewer could meaningfully reject one task while approving its
neighbour. Each task ends with an independently testable deliverable.

Consider multiple factors when defining Task boundaries:

**Coupling & Dependencies:**
- Tightly coupled changes → same Task
- If B depends on A's output → consider combining into one Task
- Can run independently? → separate Tasks

**File Conflicts:**
- Multiple Tasks editing same files → will conflict in parallel execution
- Related edits to same file group → same Task

**Logical Coherence:**
- Does this make sense as a reviewable unit?
- Natural boundary: service layer, API endpoint, UI component, documentation set

**Reviewable Stack Shape:**
- Each Task should produce one coherent reviewable unit unless the plan explicitly says otherwise
- Order tasks so foundations come first and dependent behaviour builds later
- Keep unrelated changes separate so feedback on an earlier unit can be addressed without untangling later work
- Avoid mixing mechanical refactors, behaviour changes, and polish in the same Task unless they must happen together

**Subagent Efficiency:**
- Justify context transfer overhead (10min-1hr of work per Task)
- Avoid micro-Tasks that are pure overhead

**Independence for Parallel Execution:**
- Can Tasks 1, 2, 3 be dispatched simultaneously?
- If they must be sequential, consider if they should be one Task

**Rule of thumb:**
- 1-5 Tasks per PLAN typically
- Each Task = 10min-2hr of work
- Simple Task might have 1 Subtask, complex Task might have 5-10 Subtasks

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **Implementation handoff:** Use the `subagent-driven-development` skill (recommended where the harness supports subagent dispatch) or the `executing-plans` skill to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach - summarise from DESIGN.md]

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
## Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — exact signatures]
- Produces: [what later tasks rely on — exact function names, parameter and
  return types. A task's implementer sees only their own task; this block is
  how they learn the names and types neighbouring tasks use.]

### Subtask N.1: Write and verify failing test

**Step 1:** Write the failing test

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2:** Run test to verify it fails

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

### Subtask N.2: Implement and verify solution

**Step 1:** Write minimal implementation

```python
def function(input):
    return expected
```

**Step 2:** Run test to verify it passes

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS
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

Fix any issues inline before sharing the plan.

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
