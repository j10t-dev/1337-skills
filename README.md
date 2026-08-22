# 1337-skills

Harness-neutral skills collection with thin adapters for individual coding harnesses.

This repository is the canonical home for the `1337-skills` collection. Parent directories such as `~/.agents`, `~/.claude`, and `~/.pi` should link to this repository; they should not own or version-manage this content.

**Original:** Forked from [obra/superpowers](https://github.com/obra/superpowers) v3.4.1

## Layout

- `skills/` - canonical skill files.
- `adapters/` - harness-specific skills and scripts, deliberately outside the shared `skills/` tree.
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

Claude-only adapter skills:

```text
~/.claude/skills/requesting-pi-review -> ~/.agents/1337-skills/adapters/claude/skills/requesting-pi-review
```

Adapter skills live outside `skills/`, so harnesses consuming `~/.agents/skills/` never enumerate them.

Pi and other harnesses should consume the shared skill tree through `~/.agents/skills/`.

## Skills

**Testing & Verification**
- `test-driven-development`
- `verification-before-completion`

**Debugging**
- `systematic-debugging`

**Workflow & Collaboration**
- `brainstorming`
- `grill-me`
- `grill-with-docs`
- `grilling`
- `domain-modeling`
- `writing-plans`
- `requesting-document-review`
- `executing-plans`
- `working-with-subagents`
- `subagent-driven-development`
- `requesting-code-review`
- `receiving-code-review`
- `handling-github-pr-reviews`
- `finishing-development`

**Writing**
- `unslop`

**Language practice**
- `typescript-best-practices`

**Principles** (agent-only; `user-invocable: false`, so no slash command)
- `principle-type-system-discipline`
- `principle-boundary-discipline`

**Meta**
- `using-skills`
- `writing-for-agents`

**Claude-only adapters** (`adapters/claude/skills/`)
- `requesting-pi-review`

## Intentional Divergences from Upstream

Deliberate deltas from obra/superpowers. Anything not listed here that differs from upstream is fair game for a sync.

- **UK English** throughout skill content.
- **jj, not git.** All VCS instructions, scripts, and examples use jj. Raw git commands are never used.
- **Controller-owned task commits.** Formal plan execution commits each accepted task with the plan's exact conventional subject and advances one declared feature bookmark. Ad-hoc commits, integration, and `$DOCS_ROOT` VCS remain user-controlled.
- **Harness neutrality.** Canonical skill content avoids harness-specific tool names ("task tracker", "current harness's skill mechanism"); harness specifics live in adapter files.
- **External docs repo.** Designs and plans live in `$DOCS_ROOT/$projectName/{designs,plans}/` (configured via `DOCS_ROOT` or your instructions file), not in-repo under `docs/superpowers/`.
- **Independent document review (addition, not replacement).** After the inline self-review checklist, brainstorming and writing-plans hand the document to `requesting-document-review`, which dispatches a native reviewer subagent of the running harness using upstream's document-reviewer prompt templates. Self-review still runs first. `requesting-pi-review` is a Claude-only adapter that substitutes pi as the reviewer on explicit user request.
- **Mandatory programme design and vertical increments.** Brainstorming designs include a file-tree diff, boundary map, key interfaces, and representative scenario call trees (or a credible non-executable exemption); writing-plans preserves those decisions in observable vertical behaviour increments rather than horizontal layer batches.
- **Two-path brainstorming.** `brainstorming` routes between a direct path for one-session, single-task work that implements without a design or plan, and the existing full design-and-plan path. This fork does not adopt upstream's third path; prototype and spike handling remain absent pending adoption from an external skill set.
- **Renames:** `finishing-a-development-branch` → `finishing-development`, `using-superpowers` → `using-skills`.
- **No git worktrees.** `using-git-worktrees` is not onboarded; jj covers the isolation need.
- **No brainstorming visual companion.** The browser-based mockup companion is intentionally excluded.
- **Canonical subagent dispatch policy.** `working-with-subagents` centralises harness-neutral capability, tool, brief, and result-inspection guidance; SDD force-loads it while retaining orchestration-specific rules.
- **No `dispatching-parallel-agents`.** Intentionally excluded; harnesses know how to parallelise their own subagents.
- **`unslop` (third-party addition).** Not from upstream. Replicated from [cursor/plugins](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) `pstack/skills/unslop`, body verbatim; only the description was rewritten as an invocation pointer. It governs human-facing prose, not agent-facing documents, which follow `writing-for-agents`.
- **Matt Pocock grilling skills (third-party addition).** `grill-me`, `grill-with-docs`, `grilling`, and `domain-modeling` come from [mattpocock/skills](https://github.com/mattpocock/skills). Router wording is harness-neutral. `domain-modeling` maintains `CONTEXT.md` terminology only; ADR creation is deliberately excluded because this pack's design workflow owns decision documentation.
- **TypeScript practice skills (third-party addition).** `typescript-best-practices` (with `references/patterns.md`), `principle-type-system-discipline`, and `principle-boundary-discipline` come from [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack/skills) `pstack/skills`. Bodies are otherwise verbatim, with three deliberate deltas. First, UK English, per the convention above. Second, the principles carry `user-invocable: false` in place of upstream's `disable-model-invocation: true`: they are agent reference, not commands anyone would type, and the upstream flag would additionally block the citing skill from reaching them, since Claude Code refuses the call and tells the user to run the skill themselves. Third, upstream's `**principle-name** principle skill` prose is rewritten as explicit invocation instructions, and the pointer to `encode-lessons-in-structure` is dropped rather than dragging a fourth principle in. Upstream resolves these references through `poteto-mode`, which inlines all twenty-one principles in an index; this fork has no equivalent, so the principles stand alone and are invoked directly.

- **Trimmed skill descriptions.** Upstream description tails that summarise workflow ("- requires X; evidence before assertions always") are stripped: descriptions remain compact invocation pointers, per `writing-for-agents`.

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
