---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks for engineers with zero codebase context - creates comprehensive implementation plans with exact file paths, complete code examples, and verification steps assuming engineer has minimal domain knowledge
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Determine filenames from current branch:**
- Get current branch: `git branch --show-current`
- If on semantic branch (feat/*, fix/*, refactor/*, docs/*, chore/*):
  - Design file: `.claude/plans/${branch//\//-}-DESIGN.md`
  - Plan file: `.claude/plans/${branch//\//-}-PLAN.md`
- If on main or non-semantic branch: Ask user for feature name and offer to create branch

**Before writing:**
- Create `.claude/plans/` directory if it doesn't exist
- Read design file to understand architecture and design decisions
- Include architecture summary in plan header

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

> **For Claude:** REQUIRED SUB-SKILL: Use 1337-skills:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach - summarise from DESIGN.md]

**Tech Stack:** [Key technologies/libraries]

**Skills to Use:**
- 1337-skills:test-driven-development
- 1337-skills:verification-before-completion
- [Other relevant skills]

**Required Files:** (executor will auto-read these)
- @path/to/file1.py
- @path/to/file2.ts
- [Files the executor needs context from]

---
```

## Task Structure

```markdown
## Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

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

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `<plan-file>`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, executes all tasks

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use 1337-skills:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses 1337-skills:executing-plans
