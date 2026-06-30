# 1337-skills

Harness-neutral skills collection with thin adapters for individual coding harnesses.

This repository is the canonical home for the `1337-skills` collection. Parent directories such as `~/.agents`, `~/.claude`, and `~/.pi` should link to this repository; they should not own or version-manage this content.

**Original:** Forked from [obra/superpowers](https://github.com/obra/superpowers) v3.4.1

## Layout

- `skills/` - canonical skill files.
- `commands/` - slash-command wrappers for harnesses that support them.
- `hooks/` - hook scripts/configuration for harnesses that support them.
- `.claude-plugin/`, `.claude/` - Claude Code adapter metadata.
- `.codex/` - Codex adapter notes.
- `agents/` - reusable subagent prompts where supported.

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
