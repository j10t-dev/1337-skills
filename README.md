# 1337-skills

A forked and evolving skills library for Claude Code - iterating towards custom cognitive patterns and workflows.

**Original:** Forked from [obra/superpowers](https://github.com/obra/superpowers) v3.4.1

## What You Get

- **Testing Skills** - TDD, async testing, anti-patterns
- **Debugging Skills** - Systematic debugging, root cause tracing, verification
- **Collaboration Skills** - Brainstorming, planning, code review, parallel agents
- **Development Skills** - Git worktrees, finishing branches, subagent workflows
- **Meta Skills** - Creating, testing, and sharing skills

Plus:
- **Slash Commands** - `/1337-skills:brainstorm`, `/1337-skills:write-plan`, `/1337-skills:execute-plan`
- **Automatic Integration** - Skills activate automatically when relevant
- **Evolving Workflows** - Customize and iterate towards your preferred patterns

## Installation

### Local Installation

Clone this repository to your Claude Code plugins directory:

```bash
cd ~/.claude/plugins/local
git clone https://github.com/j10t-dev/1337-skills.git
```

### Verify Installation

Check that commands appear:

```bash
/help
```

```
# Should see:
# /1337-skills:brainstorm - Interactive design refinement
# /1337-skills:write-plan - Create implementation plan
# /1337-skills:execute-plan - Execute plan in batches
```

## Quick Start

### Using Slash Commands

**Brainstorm a design:**
```
/1337-skills:brainstorm
```

**Create an implementation plan:**
```
/1337-skills:write-plan
```

**Execute the plan:**
```
/1337-skills:execute-plan
```

### Automatic Skill Activation

Skills activate automatically when relevant. For example:
- `test-driven-development` activates when implementing features
- `systematic-debugging` activates when debugging issues
- `verification-before-completion` activates before claiming work is done

## What's Inside

### Skills Library

**Testing** (`skills/testing/`)
- **test-driven-development** - RED-GREEN-REFACTOR cycle
- **condition-based-waiting** - Async test patterns
- **testing-anti-patterns** - Common pitfalls to avoid

**Debugging** (`skills/debugging/`)
- **systematic-debugging** - 4-phase root cause process
- **root-cause-tracing** - Find the real problem
- **verification-before-completion** - Ensure it's actually fixed
- **defense-in-depth** - Multiple validation layers

**Collaboration** (`skills/collaboration/`)
- **brainstorming** - Socratic design refinement
- **writing-plans** - Detailed implementation plans
- **executing-plans** - Batch execution with checkpoints
- **dispatching-parallel-agents** - Concurrent subagent workflows
- **requesting-code-review** - Pre-review checklist
- **receiving-code-review** - Responding to feedback
- **using-git-worktrees** - Parallel development branches
- **finishing-a-development-branch** - Merge/PR decision workflow
- **subagent-driven-development** - Fast iteration with quality gates

**Meta** (`skills/meta/`)
- **writing-skills** - Create new skills following best practices
- **sharing-skills** - Contribute skills back via branch and PR
- **testing-skills-with-subagents** - Validate skill quality
- **using-superpowers** - Introduction to the skills system

### Commands

All commands are thin wrappers that activate the corresponding skill:

- **brainstorm.md** - Activates the `brainstorming` skill
- **write-plan.md** - Activates the `writing-plans` skill
- **execute-plan.md** - Activates the `executing-plans` skill

## How It Works

1. **SessionStart Hook** - Loads the `using-superpowers` skill at session start
2. **Skills System** - Uses Claude Code's first-party skills system
3. **Automatic Discovery** - Claude finds and uses relevant skills for your task
4. **Iterative Evolution** - Modify skills directly, test immediately, iterate towards your preferred patterns

## Philosophy

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success
- **Domain over implementation** - Work at problem level, not solution level

## Tracking Upstream

This is a fork - you can selectively pull interesting changes from upstream:

```bash
# See what's new in upstream
git fetch upstream
git log upstream/main --oneline --since="1 month ago"

# Examine interesting changes
git show upstream/main:skills/some-skill/SKILL.md

# Cherry-pick if useful
git cherry-pick <commit-hash>
```

## Philosophy

- **Iterate towards better** - Modify, test, iterate based on actual use
- **Your patterns** - Evolve skills to match your thinking, not dogma
- **Selective upstream** - Mine upstream for ideas, not obligations

## License

MIT License - see LICENSE file for details

## Links

- **This Fork**: https://github.com/j10t-dev/1337-skills
- **Original**: https://github.com/obra/superpowers
