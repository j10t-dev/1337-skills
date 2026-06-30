# 1337-skills

Harness-neutral skills collection with thin adapters for individual coding harnesses.

This repository is the canonical home for the `1337-skills` collection. Parent directories such as `~/.agents`, `~/.claude`, and `~/.pi` should link to this repository; they should not own or version-manage this content.

**Original:** Forked from [obra/superpowers](https://github.com/obra/superpowers) v3.4.1

## Layout

- `skills/` - canonical skill files.
- `hooks/` - hook scripts/configuration for harnesses that support them.
- `.claude-plugin/`, `.claude/` - Claude Code adapter metadata.

## Installed Links

Skill discovery:

```text
~/.agents/skills/1337-skills -> ~/.agents/1337-skills/skills
```

Claude Code plugin compatibility:

```text
~/.claude/plugins/local/1337-skills -> ~/.agents/1337-skills
```

Pi and other harnesses should consume the shared skill tree through `~/.agents/skills/`.

## Skills

**Testing & Verification**
- `test-driven-development`
- `verification-before-completion`

**Debugging**
- `systematic-debugging`

**Workflow & Collaboration**
- `brainstorming`
- `writing-plans`
- `requesting-pi-review`
- `executing-plans`
- `subagent-driven-development`
- `requesting-code-review`
- `receiving-code-review`
- `handling-github-pr-reviews`
- `finishing-development`

**Meta**
- `using-skills`
- `writing-skills`

## Intentional Divergences from Upstream

Deliberate deltas from obra/superpowers. Anything not listed here that differs from upstream is fair game for a sync.

- **UK English** throughout skill content.
- **jj, not git.** All VCS instructions, scripts, and examples use jj. Raw git commands are never used.
- **Harness neutrality.** Canonical skill content avoids harness-specific tool names ("task tracker", "current harness's skill mechanism"); harness specifics live in adapter files.
- **External docs repo.** Designs and plans live in `$DOCS_ROOT/$projectName/{designs,plans}/` (default `~/dev/j10t-docs`), not in-repo under `docs/superpowers/`.
- **pi-review handoff (addition, not replacement).** After the inline self-review checklist, brainstorming and writing-plans hand the document to `requesting-pi-review` (on the `feat/requesting-pi-review` branch) for independent cross-harness confirmation. Self-review still runs first. Upstream's subagent document-reviewer prompts are no longer routed to.
- **Renames:** `finishing-a-development-branch` → `finishing-development`, `using-superpowers` → `using-skills`.
- **No git worktrees.** `using-git-worktrees` is not onboarded; jj covers the isolation need.
- **No brainstorming visual companion.** The browser-based mockup companion is intentionally excluded.
- **No `dispatching-parallel-agents`.** Intentionally excluded; harnesses know how to parallelise their own subagents.
- **Trimmed skill descriptions.** Upstream description tails that summarise workflow ("- requires X; evidence before assertions always") are stripped: descriptions carry triggering conditions only, per the writing-skills SDO guidance.

## Upstream

```bash
jj git fetch --remote upstream
jj log -r 'upstream/main' --limit 20
jj diff --from @ --to 'upstream/main' -- skills/some-skill/SKILL.md
jj new <change-id>
```

Keep canonical skill content harness-neutral. Put harness-specific behaviour in adapter files or explicit mapping docs.

## License

MIT License - see `LICENSE`.
