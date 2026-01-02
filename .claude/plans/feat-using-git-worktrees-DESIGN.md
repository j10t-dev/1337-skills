# Using Git Worktrees - Design

## Purpose

Standalone skill for creating isolated workspaces for parallel feature development. Each worktree gets its own directory, allowing multiple Claude sessions to work on different features simultaneously.

## Commands

| Command | Description |
|---------|-------------|
| `/worktree <branch-name>` | Create worktree and set up environment |
| `/worktree remove <branch-name>` | Remove worktree |
| `/worktree list` | List all worktrees for current project |

## Worktree Location

Global path: `~/.config/1337-skills/worktrees/<project>/<branch-dir>/`

Example: `~/.config/1337-skills/worktrees/myproject/feat-user-auth/`

Branch names converted: `feat/user-auth` -> `feat-user-auth`

## Create Flow

```
/worktree feat/user-auth
        |
        v
Check if worktree exists for branch
        |
  [exists] -> Error: "Worktree already exists at <path>. To resume: cd <path> && claude"
  [new]    -> Continue
        |
        v
Create worktree at global path
  mkdir -p ~/.config/1337-skills/worktrees/<project>
  git worktree add <path> -b <branch-name>
        |
        v
cd into worktree (for Bash commands)
        |
        v
Read project docs (CLAUDE.md, README.md, CONTRIBUTING.md) for setup command
  [not found] -> Ask user: "No setup instructions found. What command installs dependencies?"
  [found]     -> Run setup command
        |
        v
Read project docs for test command
  [not found] -> Ask user: "No test command found. What command runs tests?"
  [found]     -> Run tests
        |
        v
  [tests fail] -> Block: Show failures, abort. User must fix main branch first.
  [tests pass] -> Report ready
        |
        v
Output:
  Worktree ready at ~/.config/1337-skills/worktrees/myproject/feat-user-auth
  Dependencies installed
  Tests passing (N tests)

  To work in this worktree:
    cd ~/.config/1337-skills/worktrees/myproject/feat-user-auth && claude
```

## Remove Flow

```
/worktree remove feat/user-auth
        |
        v
Derive path from branch name
  project=$(basename "$(git rev-parse --show-toplevel)")
  branch_dir=$(echo "feat/user-auth" | tr '/' '-')
  path=~/.config/1337-skills/worktrees/$project/$branch_dir
        |
        v
Check exists
  [not found] -> Error: "No worktree found at <path>"
  [found]     -> git worktree remove <path>
        |
        v
Output: "Removed worktree at <path>"
```

## List Flow

```
/worktree list
        |
        v
project=$(basename "$(git rev-parse --show-toplevel)")
ls ~/.config/1337-skills/worktrees/$project/
        |
        v
Output:
  Worktrees for myproject:
    feat-user-auth    ~/.config/1337-skills/worktrees/myproject/feat-user-auth
    fix-login-bug     ~/.config/1337-skills/worktrees/myproject/fix-login-bug
```

## Integration

### With brainstorming

After design doc is committed, suggest worktree creation:

```
Design committed to .claude/plans/feat-user-auth-DESIGN.md

Ready to create isolated worktree? Run:
  /worktree feat/user-auth

Or continue here to implementation planning.
```

### With other skills

No integration needed - `writing-plans`, `subagent-driven-development`, etc. work in whatever directory Claude is launched. Worktree is transparent.

### Cleanup

Manual only. No auto-cleanup. User runs `/worktree remove` or `git worktree remove <path>` in regular terminal when done.

## Error Cases

| Situation | Response |
|-----------|----------|
| Worktree already exists | Error with path, suggest `cd <path> && claude` |
| Invalid branch name (no /) | Error: "Branch name should include prefix (e.g., feat/user-auth)" |
| Setup docs not found | Ask user for install command |
| Test docs not found | Ask user for test command |
| Baseline tests fail | Block, show failures, tell user to fix main first |
| Remove non-existent worktree | Error: "No worktree found at <path>" |

## Skill Structure

```
skills/
  using-git-worktrees/
    SKILL.md
```

### Frontmatter

```yaml
---
name: using-git-worktrees
description: Use when starting feature work that needs isolation, or running parallel features - creates git worktree at global location, installs dependencies, verifies test baseline, reports launch command for new Claude session
---
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Creating worktree without checking tests pass | Always run test baseline before reporting ready |
| Assuming package manager from file presence | Read project docs for setup/test commands |
| Forgetting to report launch command | User needs full `cd <path> && claude` command |
| Leaving orphaned worktrees | Use `/worktree list` periodically, clean up with `/worktree remove` |

## Red Flags

**Never:**
- Create worktree if one already exists for that branch
- Proceed if baseline tests fail
- Guess setup/test commands without checking docs

**Always:**
- Read project documentation for setup instructions
- Verify tests pass before reporting ready
- Report full path with launch command
