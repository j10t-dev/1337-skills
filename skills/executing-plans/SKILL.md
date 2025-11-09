---
name: executing-plans
description: Use when partner provides a complete implementation plan to execute - loads plan, reviews critically, executes all tasks, reports completion
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report completion.

**Core principle:** Follow the plan systematically, stop when blocked.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan
1. Read PLAN.md
2. Note which skills to use from "Skills to Use:" section
3. Check for any blockers or ambiguities that prevent starting
4. If blockers: Ask specific questions using the AskUserQuestion tool before starting
5. If clear: Create TodoWrite and proceed

### Step 2: Execute All Tasks

For each task:
1. Mark as in_progress
2. Apply skills specified in "Skills to Use:" section (use Skill tool to load them)
3. Follow each step exactly (plan has bite-sized steps)
4. Run verifications as specified
5. Mark as completed

### Step 3: Report Completion

After all tasks complete:
- Summarise what was implemented
- Show final verification output
- List files changed

### Step 4: Complete Development

After all tasks complete and verified:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use 1337-skills:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails and you have attempted to fix them yourself, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## Remember
- Load PLAN.md and note skills/files
- Apply skills specified in "Skills to Use:"
- Follow plan steps exactly
- Don't skip verifications
- Stop when blocked, don't guess

## Integration with Other Skills

**Uses:**
- Skills specified in "Skills to Use:" section of PLAN.md
