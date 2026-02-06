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
- **Slash Commands** - `/brainstorm`, `/write-plan`, `/execute-plan`
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
# /brainstorm - Interactive design refinement
# /write-plan - Create implementation plan
# /execute-plan - Execute plan in batches
```

## Quick Start

### Using Slash Commands

**Brainstorm a design:**
```
/brainstorm
```

**Create an implementation plan:**
```
/write-plan
```

**Execute the plan:**
```
/execute-plan
```

### Automatic Skill Activation

Skills activate automatically when relevant. For example:
- `test-driven-development` activates when implementing features
- `systematic-debugging` activates when debugging issues
- `verification-before-completion` activates before claiming work is done

## What's Inside

### Skills Library

All skills are located in `skills/` (flat structure), organised here by function:

**Testing**
- **test-driven-development** - Write test first, watch fail, write minimal code to pass
- **condition-based-waiting** - Replace arbitrary timeouts with condition polling for reliable async tests
- **testing-anti-patterns** - Prevent testing mock behaviour, production pollution, mocking without understanding

**Debugging**
- **systematic-debugging** - Four-phase framework ensuring understanding before attempting fixes
- **root-cause-tracing** - Trace bugs backward through call stack to find original trigger
- **verification-before-completion** - Run verification commands before claiming work complete
- **defense-in-depth** - Validate at every layer to make bugs structurally impossible

**Workflow & Collaboration**
- **brainstorming** - Refine rough ideas through collaborative questioning before coding
- **writing-plans** - Create comprehensive implementation plans with exact paths and code examples
- **executing-plans** - Load plan, review critically, execute tasks, report completion
- **subagent-driven-development** - Dispatch fresh subagent per task with code review between tasks
- **dispatching-parallel-agents** - Investigate and fix 3+ independent failures concurrently
- **requesting-code-review** - Dispatch code-reviewer subagent before merging
- **receiving-code-review** - Technical rigor and verification, not performative agreement
- **finishing-a-development-branch** - Structured options for merge, PR, or cleanup

**Meta**
- **using-skills** - Mandatory workflows for finding and using skills (loaded at session start)
- **writing-skills** - Apply TDD to process documentation, test with subagents before deployment
- **testing-skills-with-subagents** - Verify skills work under pressure and resist rationalisation

### Commands

All commands are thin wrappers that activate the corresponding skill:

- **brainstorm.md** - Activates the `brainstorming` skill
- **write-plan.md** - Activates the `writing-plans` skill
- **execute-plan.md** - Activates the `executing-plans` skill

## How It Works

1. **SessionStart Hook** - Loads the `using-skills` skill at session start
2. **Skills System** - Uses Claude Code's first-party skills system
3. **Automatic Discovery** - Claude finds and uses relevant skills for your task
4. **Iterative Evolution** - Modify skills directly, test immediately, iterate towards your preferred patterns

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
