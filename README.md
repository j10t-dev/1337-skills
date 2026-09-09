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
- **Artefact lifetime.** Approved designs/plans remain in `$DOCS_ROOT/$projectName/{designs,plans}/`. Review history, reports and logs stay in ignored scratch storage, outside commits, and are removed after delivery. Plans/designs hold operative instructions, not review commentary. Existing directories do not authorise additional permanent artefacts.
- **Independent document review (addition, not replacement).** After the inline self-review checklist, brainstorming and writing-plans hand the document to `requesting-document-review`, which dispatches a native reviewer subagent of the running harness using upstream's document-reviewer prompt templates. Self-review still runs first. `requesting-pi-review` is a Claude-only adapter that substitutes pi as the reviewer on explicit user request.
- **Mandatory programme design and vertical increments.** Brainstorming designs include a file-tree diff, boundary map, key interfaces, and representative scenario call trees (or a credible non-executable exemption); writing-plans preserves those decisions in observable vertical behaviour increments rather than horizontal layer batches.
- **Code-complete implementation plans.** Plans supply actual production/test code, integration edits, exact interfaces, cases, exclusions and checks. Executors follow the planned structure; equivalent public results do not justify additional private architecture. Local syntax/naming adjustments are allowed; missing implementation decisions go to the controller. The approved design remains the source of truth.
- **Controller inspection and failure attribution.** Controllers inspect actual diffs before acceptance and resulting code against approved requirements before delivery. Required checks establish a recorded pre-edit baseline. Pre-existing claims need evidence; a green rerun alone is not a diagnosis. Fix introduced regressions within scope; agree broader repairs with the user. Resolve failures before delivery unless the user accepts a stated limitation. False findings may be rejected with scratch evidence; genuine Critical/Important fixes require re-review, with user escalation after three failed rounds.
- **Conditional SDD references.** Root `SKILL.md` retains ordinary execution, acceptance authority and ledger forms. Load `review-handling.md` for findings or implementer escalation; load `recovery.md` for resume or unexplained state, not both on every task. Exact-subject recovery uses the amended prospective subject after a combined repair; incomplete intent stops affected work.
- **Behaviour-based parameterisation.** Plans include test bodies with actual inputs, independently derived results and side effects. Parameterise one behaviour's inputs and keep distinct behaviours separate. Production code never computes test expectations. TDD and required project checks remain, including the prose/configuration exception.
- **Two-path brainstorming.** `brainstorming` assesses scope internally without compulsory classification or four-field output. Unknown files prompt investigation, not automatic full-path routing. The user request and agreed clarifications authorise direct work and supply its complete review requirements. Direct work retains TDD, unconditional independent review and finishing with applicable evidence. Separately committed tasks, consequential alternatives and explicit design/plan requests retain the full design-and-plan path and consequential approval. This fork does not adopt upstream's third path; prototype and spike handling remain absent pending adoption from an external skill set.
- **Renames:** `finishing-a-development-branch` → `finishing-development`, `using-superpowers` → `using-skills`.
- **No git worktrees.** `using-git-worktrees` is not onboarded; jj covers the isolation need.
- **No brainstorming visual companion.** The browser-based mockup companion is intentionally excluded.
- **Bounded delegation.** `working-with-subagents` owns model/tool selection, explicit writable paths, context and result inspection. Further delegation requires controller permission. SDD implementation stays serial in shared copies; independent read-only work may run concurrently. Task briefs include the common plan preamble and selected task, preserving shared requirements.
- **No `dispatching-parallel-agents`.** Intentionally excluded; harnesses know how to parallelise their own subagents.
- **`unslop` (third-party addition).** Not from upstream. Replicated from [cursor/plugins](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) `pstack/skills/unslop`, with a condensed body and rewritten invocation pointer. Its operative voice, plain-speech and style preferences remain applicable to every ordinary conversational reply as well as substantial human-facing prose. Agent-facing documents follow `writing-for-agents`.
- **Matt Pocock grilling skills (third-party addition).** `grill-me`, `grill-with-docs`, `grilling`, and `domain-modeling` come from [mattpocock/skills](https://github.com/mattpocock/skills). Router wording is harness-neutral. `domain-modeling` maintains `CONTEXT.md` terminology only; ADR creation is deliberately excluded because this pack's design workflow owns decision documentation.
- **TypeScript practice skills (third-party addition).** `typescript-best-practices` (with `references/patterns.md`), `principle-type-system-discipline`, and `principle-boundary-discipline` come from [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack/skills) `pstack/skills`. Bodies retain the source guidance with the deltas below. Invocation pointers now target implementation, type/API design and code-change review; reading TypeScript or inspecting a signature alone does not load implementation guidance. The body-level invocation from TypeScript practice to type-system discipline remains mandatory when practice applies. The other deliberate deltas are unchanged. First, UK English, per the convention above. Second, the principles carry `user-invocable: false` in place of upstream's `disable-model-invocation: true`: they are agent reference, not commands anyone would type, and the upstream flag would additionally block the citing skill from reaching them, since Claude Code refuses the call and tells the user to run the skill themselves. Third, upstream's `**principle-name** principle skill` prose is rewritten as explicit invocation instructions, and the pointer to `encode-lessons-in-structure` is dropped rather than dragging a fourth principle in. Upstream resolves these references through `poteto-mode`, which inlines all twenty-one principles in an index; this fork has no equivalent, so the principles stand alone and are invoked directly.

- **Applicable verification evidence.** Test and review evidence carries across messages, agents and completion handoffs while its relevant code, configuration and environment remain unchanged. Required project checks still apply; broaden or repeat only for changes, failures or concrete unresolved concerns. This follows the [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra) on unnecessary pauses, conflicting instructions and proportionate verification. Detailed workflows and review gates remain explicit.

- **Proportionate loading and prose compression.** Relevant, explicitly requested and workflow-required skills remain mandatory; current loaded guidance is reused and task-scoped subagents do not restart global routing. Repeated enforcement slogans, examples and warnings in using-skills, TDD, debugging, verification and review reception are condensed without changing test-first exceptions, root-cause investigation, controller findings/repair rules, review gates or evidence-based delivery. Hooks and helpers are unchanged. Loader deduplication is a separate unimplemented follow-up.

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
