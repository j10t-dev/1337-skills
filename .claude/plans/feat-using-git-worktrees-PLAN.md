# Using Git Worktrees - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use 1337-skills:executing-plans to implement this plan task-by-task.

**Goal:** Add git worktree management to 1337-skills via `/worktree` slash command and supporting skill.

**Architecture:** Single slash command `/worktree` with subcommands (create/remove/list) routed via `$1` argument. Skill document provides the detailed workflow for creating worktrees. Command invokes skill for create, handles remove/list directly.

**Tech Stack:** Claude Code plugin commands (Markdown), git worktree, Bash

**Skills to Use:**
- 1337-skills:test-driven-development
- 1337-skills:writing-skills
- 1337-skills:verification-before-completion

**Required Files:**
- @.claude/plans/feat-using-git-worktrees-DESIGN.md
- @skills/brainstorming/SKILL.md

---

## Task 1: Create Slash Command

**Files:**
- Create: `commands/worktree.md`

### Subtask 1.1: Create the worktree command file

**Step 1:** Create the command with frontmatter and routing logic

Create `commands/worktree.md`:

```markdown
---
description: Manage git worktrees for parallel feature development
argument-hint: <branch-name> | remove <branch-name> | list
---

# Git Worktree Management

Based on the arguments provided, execute the appropriate action:

## If first argument is "remove"

Remove an existing worktree.

1. Get project name:
   ```bash
   project=$(basename "$(git rev-parse --show-toplevel)")
   ```

2. Convert branch name to directory name (replace `/` with `-`):
   ```bash
   branch_dir=$(echo "$2" | tr '/' '-')
   ```

3. Build path:
   ```bash
   path="$HOME/.config/1337-skills/worktrees/$project/$branch_dir"
   ```

4. Check if exists:
   ```bash
   if [ ! -d "$path" ]; then
     echo "No worktree found at $path"
     exit 1
   fi
   ```

5. Remove worktree:
   ```bash
   git worktree remove "$path"
   echo "Removed worktree at $path"
   ```

## If first argument is "list"

List all worktrees for current project.

1. Get project name:
   ```bash
   project=$(basename "$(git rev-parse --show-toplevel)")
   ```

2. Check if directory exists:
   ```bash
   worktree_dir="$HOME/.config/1337-skills/worktrees/$project"
   if [ ! -d "$worktree_dir" ]; then
     echo "No worktrees found for $project"
     exit 0
   fi
   ```

3. List worktrees:
   ```bash
   echo "Worktrees for $project:"
   for dir in "$worktree_dir"/*/; do
     if [ -d "$dir" ]; then
       name=$(basename "$dir")
       echo "  $name    $dir"
     fi
   done
   ```

## Otherwise (create new worktree)

The argument is a branch name like `feat/user-auth`. Use the `1337-skills:using-git-worktrees` skill to create the worktree.

**REQUIRED:** Invoke the skill with the branch name provided as $1.
```

**Step 2:** Verify command file exists and is valid

Run: `cat commands/worktree.md | head -20`
Expected: Shows frontmatter and start of command

### Subtask 1.2: Update plugin.json to include commands

**Step 1:** Read current plugin.json

Run: `cat .claude-plugin/plugin.json`

**Step 2:** Add commands directory reference

Edit `.claude-plugin/plugin.json` to add:
```json
{
  "name": "1337-skills",
  "description": "Forked skills library for evolving Claude Code thinking patterns: TDD, debugging, collaboration, and custom workflows",
  "version": "1.1.0",
  "author": {
    "name": "j10t-dev",
    "email": "j10t@j10t.dev"
  },
  "homepage": "https://github.com/j10t-dev/1337-skills",
  "repository": "https://github.com/j10t-dev/1337-skills",
  "license": "MIT",
  "keywords": [
    "skills",
    "tdd",
    "debugging",
    "collaboration",
    "workflows",
    "fork"
  ],
  "commands": "./commands/"
}
```

**Step 3:** Verify plugin.json is valid JSON

Run: `cat .claude-plugin/plugin.json | python3 -c "import json,sys; json.load(sys.stdin); print('Valid JSON')"`
Expected: "Valid JSON"

---

## Task 2: Create Skill Document

**Files:**
- Create: `skills/using-git-worktrees/SKILL.md`

### Subtask 2.1: Create skill directory and file

**Step 1:** Create directory

Run: `mkdir -p skills/using-git-worktrees`

**Step 2:** Create SKILL.md with full workflow

Create `skills/using-git-worktrees/SKILL.md`:

```markdown
---
name: using-git-worktrees
description: Use when starting feature work that needs isolation, or running parallel features - creates git worktree at global location, installs dependencies, verifies test baseline, reports launch command for new Claude session
---

# Using Git Worktrees

## Overview

Create isolated workspaces for parallel feature development. Each worktree gets its own directory, allowing multiple Claude sessions to work on different features simultaneously.

**Core principle:** Isolated workspace + verified baseline = reliable parallel development.

**Announce at start:** "I'm using the using-git-worktrees skill to create an isolated workspace."

## The Process

### Step 1: Validate Branch Name

Branch name must include a prefix with `/`:
- Valid: `feat/user-auth`, `fix/login-bug`, `refactor/api-cleanup`
- Invalid: `user-auth`, `my-feature`

If invalid, error: "Branch name should include prefix (e.g., feat/user-auth, fix/login-bug)"

### Step 2: Check for Existing Worktree

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
branch_dir=$(echo "<branch-name>" | tr '/' '-')
path="$HOME/.config/1337-skills/worktrees/$project/$branch_dir"

if [ -d "$path" ]; then
  echo "Worktree already exists at $path"
  echo "To resume: cd $path && claude"
  exit 1
fi
```

### Step 3: Create Worktree

```bash
mkdir -p "$HOME/.config/1337-skills/worktrees/$project"
git worktree add "$path" -b "<branch-name>"
cd "$path"
```

### Step 4: Install Dependencies

Read project documentation to find setup command:
1. Check CLAUDE.md for setup/install instructions
2. Check README.md for setup section
3. Check CONTRIBUTING.md for development setup

If no documentation found, ask user: "No setup instructions found in project docs. What command installs dependencies?"

Run the setup command from the worktree directory.

### Step 5: Verify Test Baseline

Read project documentation to find test command:
1. Check CLAUDE.md for test instructions
2. Check README.md for testing section
3. Check package.json scripts, Makefile, etc. if mentioned in docs

If no documentation found, ask user: "No test command found in project docs. What command runs tests?"

Run tests from the worktree directory.

**If tests fail:**
```
Baseline tests failing. Cannot proceed.

[Show test failures]

The main branch has failing tests. Fix these before creating a worktree.
```
Abort. Do not proceed.

**If tests pass:** Continue to Step 6.

### Step 6: Report Ready

```
Worktree ready at ~/.config/1337-skills/worktrees/<project>/<branch-dir>
Dependencies installed
Tests passing (N tests)

To work in this worktree:
  cd ~/.config/1337-skills/worktrees/<project>/<branch-dir> && claude
```

## Quick Reference

| Command | Action |
|---------|--------|
| `/worktree feat/foo` | Create worktree for new feature branch |
| `/worktree remove feat/foo` | Remove worktree |
| `/worktree list` | List all worktrees for current project |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Creating worktree without verifying tests | Always run test baseline before reporting ready |
| Guessing setup command | Read project docs; ask user if not found |
| Forgetting launch command | Always report full `cd <path> && claude` command |

## Red Flags

**Never:**
- Create worktree if one already exists for that branch
- Proceed if baseline tests fail
- Guess setup/test commands without checking docs first

**Always:**
- Validate branch name format
- Read project docs for setup/test commands
- Verify tests pass before reporting ready
- Report full launch command
```

**Step 3:** Verify skill file exists

Run: `ls -la skills/using-git-worktrees/`
Expected: Shows SKILL.md

---

## Task 3: Update Brainstorming Skill

**Files:**
- Modify: `skills/brainstorming/SKILL.md`

### Subtask 3.1: Add worktree suggestion after design commit

**Step 1:** Read current brainstorming skill

Run: `cat skills/brainstorming/SKILL.md`

**Step 2:** Update "After the Design" section

Find the "After the Design" section and update to include worktree suggestion:

```markdown
## After the Design

**Documentation:**
- Determine filename from current branch:
  - If on semantic branch (feat/*, fix/*, refactor/*, docs/*, chore/*): `.claude/plans/${branch//\//-}-DESIGN.md`
  - If on main or non-semantic branch: Ask user for feature name and offer to create branch
- Create `.claude/plans/` directory if it doesn't exist
- Write the validated design to determined filename
- Do not commit the design document

**Next Steps (offer choices):**

After saving the design, present options:

```
Design saved to .claude/plans/<filename>-DESIGN.md

Ready to create isolated worktree? Run:
  /worktree <branch-name>

Or continue here to implementation planning.
```

**Implementation (if continuing in same session):**
- Ask: "Ready to proceed to implementation planning?"
- **REQUIRED SUB-SKILL:** Use 1337-skills:writing-plans to create detailed implementation plan
```

**Step 3:** Verify change was made

Run: `grep -A 20 "After the Design" skills/brainstorming/SKILL.md`
Expected: Shows updated section with worktree suggestion

---

## Task 4: Verify

**Do not commit.** User controls all git operations.

**Files:**
- All files created/modified in Tasks 1-3

### Subtask 4.1: Verify files exist

**Step 1:** Check all expected files are present

Run: `git status`
Expected: Shows new/modified files from Tasks 1-3

### Subtask 4.2: Manual verification (user)

After implementation, user should test:

1. Run `/worktree list` - should show no worktrees or list existing ones
2. Run `/worktree feat/test-feature` - should create worktree (if project has docs)
3. Run `/worktree remove feat/test-feature` - should remove worktree
