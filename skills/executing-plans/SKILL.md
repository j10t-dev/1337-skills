---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report completion.

**Core principle:** Follow the plan systematically, stop when blocked.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan
1. Find the plan in the external docs repo: `$DOCS_ROOT/$projectName/plans/`
2. Determine `$projectName` from the repo directory name unless the user specifies a different docs project name
3. Use the agreed feature slug, jj bookmark/change description, or user-provided slug to identify the correct plan file: `$DOCS_ROOT/$projectName/plans/<slug>.md`
4. Note which skills to use from "Skills to Use:" section
5. Check for any blockers or ambiguities that prevent starting
6. If blockers: Ask specific questions using the current harness's user-question mechanism before starting
7. If clear: create a task list in the current harness's task tracker and proceed

### Step 2: Execute All Tasks

For each task:
1. Mark as in_progress
2. Apply skills specified in "Skills to Use:" section using the current harness's skill-loading mechanism
3. Follow each step exactly (plan has bite-sized steps)
4. Keep task work in a task-sized jj change when the plan or workflow requires local change management
5. Run verifications as specified
6. Mark as completed

### Step 3: Report Completion

After all tasks complete:
- Summarise what was implemented
- Show final verification output
- List files changed

### Step 4: Complete Development

After all tasks complete and verified:
- Announce: "I'm using the finishing-development skill to complete this work."
- Use the `finishing-development` skill
- Follow that skill to verify tests, present options, execute choice

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails and you have attempted to fix them yourself, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## Remember
- Load the correct plan document from `$DOCS_ROOT/$projectName/plans/` and note skills/files
- Apply skills specified in "Skills to Use:"
- Follow plan steps exactly
- Don't skip verifications
- Stop when blocked, don't guess

## Integration with Other Skills

**Uses:**
- Skills specified in the plan document’s "Skills to Use:" section
