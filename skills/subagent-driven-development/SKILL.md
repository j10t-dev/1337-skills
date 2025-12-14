---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session - dispatches fresh subagent for each task with code review between tasks, enabling fast iteration with quality gates
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with code review after each.

**Core principle:** Fresh subagent per task + review between tasks = high quality, fast iteration

**Announce at start:** "I'm using the subagent-driven-development skill to execute this plan."

## Overview

**vs. Executing Plans (parallel session):**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Code review after each task (catch issues early)
- Faster iteration (no human-in-loop between tasks)

**When to use:**
- Staying in this session
- Tasks are mostly independent
- Want continuous progress with quality gates

**When NOT to use:**
- Need to review plan first (use executing-plans skill)
- Tasks are tightly coupled (manual execution better)
- Plan needs revision (use brainstorming skill first)

## The Process

### 1. Load Plan

Read PLAN.md (Required Files with @ syntax are already in context), note skills from "Skills to Use:" section, create TodoWrite with all tasks.

### 2. Execute Task with Subagent

For each task:

**Dispatch fresh subagent:**
```
Task tool (general-purpose):
  model: "sonnet"
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N from PLAN.md.

    Read that task carefully. Apply skills from "Skills to Use:" section.

    Your job is to:
    1. Implement exactly what the task specifies
    2. Apply specified skills (e.g., test-driven-development)
    3. Verify implementation works
    4. Report back

    Work from: [directory]

    Report: What you implemented, what you tested, test results, files changed, any issues
```

**Subagent reports back** with summary of work.

### 3. Review Subagent's Work

**Dispatch code-reviewer subagent:**
```
Task tool (1337-skills:code-reviewer):
  model: "opus"
  Use template at requesting-code-review/code-reviewer.md

  WHAT_WAS_IMPLEMENTED: [from subagent's report]
  PLAN_OR_REQUIREMENTS: Task N from PLAN.md
  FILES_CHANGED: [comma-separated list from subagent report]
  DESCRIPTION: [task summary]
```

**Subagent must report which files it modified** in its final report.

**Code reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment

### 4. Apply Review Feedback

**If Critical or Important issues found:**
1. Dispatch fix subagent to address issues
2. **Re-review after fixes:**
   - Dispatch code-reviewer again on same files
   - Check fixes actually resolved issues
   - Loop until no Critical/Important issues remain
3. **Only then proceed to Step 5**

**Dispatch fix subagent:**
```
Task tool (general-purpose):
  model: "sonnet"
  description: "Fix code review issues"
  prompt: |
    Fix these issues from code review:
    [list Critical and Important issues]

    Files affected: [files from review]

    Report: What you fixed, verification tests run, results
```

**After fix completes, re-review:**
```
Task tool (1337-skills:code-reviewer):
  model: "opus"
  Use same template as Step 3

  WHAT_WAS_IMPLEMENTED: Fixes for [list issues]
  PLAN_OR_REQUIREMENTS: Original Task N from PLAN.md
  FILES_CHANGED: [same files as before]
  DESCRIPTION: Code review fix validation
```

**If re-review finds more Critical/Important issues:** Repeat from step 1

**If only Minor issues remain:** Note them and proceed to Step 5

### 5. Mark Complete, Next Task

- Mark task as completed in TodoWrite
- Move to next task
- Repeat steps 2-5

### 6. Final Review

After all tasks complete, dispatch final code-reviewer:
- Reviews entire implementation
- Checks all plan requirements met
- Validates overall architecture

### 7. Complete Development

After final review passes:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use 1337-skills:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

## Example Workflow

```
You: I'm using Subagent-Driven Development to execute this plan.

[Load plan, create TodoWrite]

Task 1: Hook installation script

[Dispatch implementation subagent]
Subagent: Implemented install-hook with tests, 5/5 passing

[Get git diff, dispatch code-reviewer]
Reviewer: Strengths: Good test coverage. Issues: None. Ready.

[Mark Task 1 complete]

Task 2: Recovery modes

[Dispatch implementation subagent]
Subagent: Added verify/repair, 8/8 tests passing

[Dispatch code-reviewer]
Reviewer: Strengths: Solid. Issues (Important): Missing progress reporting

[Dispatch fix subagent]
Fix subagent: Added progress every 100 conversations

[Re-review after fix]
Reviewer: Fix verified. Progress reporting working. No remaining Critical/Important issues.

[Mark Task 2 complete]

...

[After all tasks]
[Dispatch final code-reviewer]
Final reviewer: All requirements met, ready to merge

Done!
```

## Advantages

**vs. Manual execution:**
- Subagents follow TDD naturally
- Fresh context per task (no confusion)
- Parallel-safe (subagents don't interfere)

**vs. Executing Plans:**
- Same session (no handoff)
- Continuous progress (no waiting)
- Review checkpoints automatic

**Cost:**
- More subagent invocations
- But catches issues early (cheaper than debugging later)

## Red Flags

**Never:**
- Skip code review between tasks
- Skip re-review after applying fixes
- Mark task complete while Critical/Important issues remain
- Proceed with unfixed Critical issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Implement without reading plan task

**If subagent fails task:**
- Dispatch fix subagent with specific instructions
- Don't try to fix manually (context pollution)

## Integration

**Required workflow skills:**
- **writing-plans** - REQUIRED: Creates the plan that this skill executes
- **requesting-code-review** - REQUIRED: Review after each task (see Step 3)
- **finishing-a-development-branch** - REQUIRED: Complete development after all tasks (see Step 7)

**Subagents must use:**
- **test-driven-development** - Subagents follow TDD for each task

**Alternative workflow:**
- **executing-plans** - Use for parallel session instead of same-session execution

See code-reviewer template: requesting-code-review/code-reviewer.md
