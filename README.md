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

Claude Code links:

```text
~/.claude-pihost/skills/1337-skills -> ~/.agents/1337-skills
~/.claude/skills/<name> -> ~/.agents/1337-skills/skills/<name>
```

`~/.agents/sync-claude-skills.sh` maintains the per-skill `~/.claude/skills/<name>` links.

Adapter skills live outside `skills/`, so harnesses consuming `~/.agents/skills/` never enumerate them.

Pi and other harnesses should consume the shared skill tree through `~/.agents/skills/`.

## Skills

**Testing & Verification**
- `test-driven-development`
- `verification-before-completion`

**Verification**

- `create-verification-skill` (user-invoked: `/create-verification-skill`)
- `maintain-verification-skill` (model-reachable for completion maintenance; `/maintain-verification-skill` for a full audit)
- `create-formal-verification-skill` (user-invoked: `/create-formal-verification-skill`)
- `maintain-formal-verification-skill` (model-reachable for completion maintenance; `/maintain-formal-verification-skill` for a full audit)

**Learning**

- `correct` (user-invoked: `/correct`)
- `reflect` (user-invoked: `/reflect`)

**Understanding**

- `how` (model-reachable on purpose)
- `why` (model-reachable on purpose)
- `teach` (model-reachable on purpose)

**Trail**

- `show-me-your-work` (model-reachable on purpose)

The pstack additions keep their upstream names. In Claude Code, use the `/1337-skills:` prefix where the collection is installed as a plugin, for example `/1337-skills:create-verification-skill`. Generated project skills live under `<repo>/.agents/skills/` and add a pointer to the project's `AGENTS.md`.

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

**Diagrams**
- `drawing-diagrams`
- `statechart` (user-invoked: `/statechart`)

**Language practice**
- `typescript-best-practices`

**Principles** (agent-only; `user-invocable: false`, so no slash command)
- `principle-type-system-discipline`
- `principle-boundary-discipline`
- `principle-reader-first-code`

Agents select applicable code principles and name the concrete decisions they shaped.

**Meta**
- `using-skills`
- `writing-for-agents`

## Intentional Divergences from Upstream

Deliberate deltas from obra/superpowers. Anything not listed here that differs from upstream is fair game for a sync.

- **UK English** throughout skill content.
- **jj, not git.** All VCS instructions, scripts, and examples use jj. Raw git commands are never used.
- **Controller-owned task commits.** Formal plan execution commits each accepted task with the plan's exact conventional subject and advances one declared feature bookmark. Ad-hoc commits, integration, and `$DOCS_ROOT` VCS remain user-controlled.
- **Harness neutrality.** Canonical skill content avoids harness-specific tool names ("task tracker", "current harness's skill mechanism"); harness specifics live in adapter files.
- **External docs repository.** Approved designs and plans remain in `$DOCS_ROOT/$projectName/{designs,plans}/`.
- **Independent document review (addition, not replacement).** After the inline self-review checklist, brainstorming and writing-plans hand the document to `requesting-document-review`, which dispatches a native reviewer subagent of the running harness using fork-maintained reviewer prompt templates derived from upstream's v6.2 templates (upstream removed its plan template in v6.4.2 and its design template in v7.0.0). Self-review still runs first. The design reviewer receives the design template and checks the headings against it. It also reads the design as the plan writer with no access to the author and returns ranked planning questions; `requesting-document-review` sorts them into answered, minor and user-owned, asks the user-owned ones in one message, and reports the calls it settled without the user, which brainstorming shows with the written design. There is no subagent-less fallback: an undispatchable review is a failed invocation, not a self-review.
- **Mandatory programme design and vertical increments.** Brainstorming designs include a file-tree diff, boundary map, key interfaces, and representative scenario call trees (or a credible non-executable exemption); writing-plans preserves those decisions in observable vertical behaviour increments rather than horizontal layer batches.
- **Implementation decisions before execution.** Plans use code, precise instructions or references to inspected code, whichever is clearest and most compact. Planners inspect reuse candidates and settle approach and integration choices; concrete test bodies, exact interfaces, cases, exclusions and checks remain required. Executors may extract small local helpers for demonstrated duplication or reuse suitable existing code the planner missed after checking its contract and reporting the substitution. Approved behaviour, responsibilities, interfaces and dependency constraints remain binding; consequential changes go to the controller. The approved design remains the source of truth.
- **Review focus.** Planning checks for input classes and failure modes implied by approved behaviour but missing from initial tests, adds their cases to the owning tasks and identifies them for reviewers.
- **Completion maintenance gate.** `shared/verification-maintenance.md` owns the once-per-feature applicability assessment and affected-scope maintenance. Shared verification policy, completion evidence checks, final review dispatch and finishing entry points route through it. A read-only agent compares the complete change with project feature maps and formal coverage; the controller maintains affected journeys and properties, reuses valid evidence, reports missing coverage and blockers, and includes maintenance edits in final review. Later fixes revisit only invalidated coverage. Missing skills are reported without automatic generation, and maintenance-only tasks reuse their own results without recursion. Both maintainer skills drop `disable-model-invocation` so this routing works; explicit full audits remain available.
- **Verification and review.** Compare required checks and elapsed times with a pre-edit baseline. Reviewers own code review; controllers use their verdicts rather than reviewing again. Fix and re-review until clean, within the fix cap below, then absorb final fixes into the relevant feature commits. Agree broader repairs with the user.
- **Conditional SDD references.** Root `SKILL.md` defines execution and the durable `.agents/sdd/progress.md` record. Read `review-handling.md` for feedback or blockers and `recovery.md` when resuming.
- **Bounded rulings and fix cap.** The fork adopted controller rulings and a fix-round cap in August 2026, removed both in September 2026, and restores a bounded form: the controller rules only on conflicts, ambiguities and reviewer findings the approved design settles, logs each as a `ruling` row in the decision trail `.agents/sdd/decisions.tsv`, and asks the user about anything the design leaves open; a ruling never adds behaviour. Fix rounds are capped at five per task and for final-review fixes, with rounds 4 and 5 on a fresh implementer and a more capable model; at the cap the controller dismisses by ruling only findings the design settles as not defects and puts every still-open defect to the user; no ruling authorises a further round. The trail is the only decision record.
- **Declined-to-judge routing.** `code-reviewer.md` grades defects on unnamed inputs by their effect on a reasonable user and requires a Declined to judge slot. The controller rules on Declined lines the design settles and lists the rest for the user in the delivery report. The SDD task reviewer carries neither.
- **Lean-plan question closed.** Production bodies stay allowed in plans ("whichever form is clearest and most compact"); upstream's signature-only default is not adopted. Transcript and proportion checks in the planner's self-review and the plan reviewer replace bodies the interfaces and tests already determine.
- **Behaviour-based parameterisation.** Plans include test bodies with actual inputs, independently derived results and side effects. Parameterise one behaviour's inputs and keep distinct behaviours separate. Production code never computes test expectations. TDD and required project checks remain, including the prose/configuration exception.
- **Test readability in `writing-good-tests.md`.** Three changes to the upstream file. First, a third principle, "Tests Read as Specifications", covers test structure, naming, fixtures, mocks and `Result` assertions, with three short extensions to the existing text for real I/O, oracle fakes and refactor pin tests. Second, its load line covers reviewing tests as well as writing and changing them. Third, the "Mock at the right level" example passes a runner mock in through the code's dependencies, typed as the dependency's method, in place of the module-mocking example.
- **Two-path brainstorming.** `brainstorming` assesses scope internally without compulsory classification or four-field output. Unknown files prompt investigation, not automatic full-path routing. The user request and agreed clarifications authorise direct work and supply its complete review requirements. Direct work retains TDD, unconditional independent review and finishing with applicable evidence. Separately committed tasks, consequential alternatives and explicit design/plan requests retain the full design-and-plan path and consequential approval. Upstream's v7 routing (sizing after intent, a short design document and plan for every small change, the opt-out offer) and its spike (the v6.3.0 route and the v7 throwaway form exempt from tests, review and the approval gate) are rejected. Prototyping belongs to the `prototype` skill, to be recovered from mattpocock/skills; that recovery is separate work.
- **Brainstorming questions.** Adapted from upstream v7.0.2: ask only when the answer changes what gets built, process steps are the agent's, why first with one open question on the full path, then the frontier in numbered rounds with a recommendation per question, one said-versus-inferred playback before approaches, a hard gate that defines implementation, how-choices stated in a line, and mockups or diagrams for anything the user will see. The design template gains `## Non-goals` and one line per rejected alternative under Architecture. Not adopted: vocabulary matching, motivational framing, the broadened description, alternating playback chunks, a written-design approval step, and leaving any part of the how to the plan.
- **Renames:** `finishing-a-development-branch` → `finishing-development`, `using-superpowers` → `using-skills`.
- **No git worktrees.** `using-git-worktrees` is not onboarded; jj covers the isolation need.
- **No brainstorming visual companion.** The browser-based mockup companion is intentionally excluded.
- **Bounded delegation.** `working-with-subagents` owns model/tool selection, explicit writable paths, context and result inspection. Further delegation requires controller permission. SDD implementation stays serial in shared copies; independent read-only work may run concurrently. Task briefs include the common plan preamble and selected task, preserving shared requirements.
- **No `dispatching-parallel-agents`.** Intentionally excluded; harnesses know how to parallelise their own subagents.
- **`unslop` (third-party addition).** Not from upstream. Replicated from [cursor/plugins](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) `pstack/skills/unslop`, with a condensed body and rewritten invocation pointer. Its operative voice, plain-speech and style preferences remain applicable to every ordinary conversational reply as well as substantial human-facing prose. Agent-facing documents follow `writing-for-agents`.
- **`writing-for-agents` replaces upstream `writing-skills`.** Upstream's `writing-skills` was removed at the v6.2 sync and replaced wholesale by `writing-for-agents` and `SKILL-MECHANICS.md`, which share no text with it. Do not reintroduce `writing-skills` on a sync.
- **Matt Pocock grilling skills (third-party addition).** `grill-me`, `grill-with-docs`, `grilling`, and `domain-modeling` come from [mattpocock/skills](https://github.com/mattpocock/skills). Router wording is harness-neutral. `domain-modeling` maintains `CONTEXT.md` terminology only; ADR creation is deliberately excluded because this pack's design workflow owns decision documentation.
- **TypeScript practice skills (third-party addition).** `typescript-best-practices` (with `references/patterns.md`), `principle-type-system-discipline`, and `principle-boundary-discipline` come from [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack/skills) `pstack/skills`. Bodies retain the source guidance with the deltas below. Invocation pointers now target implementation, type/API design and code-change review; reading TypeScript or inspecting a signature alone does not load implementation guidance. The body-level invocation from TypeScript practice to type-system discipline remains mandatory when practice applies. The other deliberate deltas are unchanged. First, UK English, per the convention above. Second, the principles carry `user-invocable: false` in place of upstream's `disable-model-invocation: true`: they are agent reference, not commands anyone would type, and the upstream flag would additionally block the citing skill from reaching them, since Claude Code refuses the call and tells the user to run the skill themselves. Third, upstream's `**principle-name** principle skill` prose is rewritten as explicit invocation instructions, and the pointer to `encode-lessons-in-structure` is dropped rather than dragging a fourth principle in. Reader-first additions: `typescript-best-practices` also invokes `principle-reader-first-code` at body level, next to the existing type-system invocation; it gains TypeScript rows for Result usage, return annotations, yes/no predicates, closed sets, collections, branch choice, guard runs, single-method ports, generic cost, value meaning and `async`, and `patterns.md` gains example sections for the Result library (including a transaction that throws to roll back), yes/no predicates, closed sets, collections and guard runs; the `patterns.md` parser examples return Result values, the upstream `sum`, `handle` and `renderChecks` examples gain return types, the `handle` Don't example passes `input.foo.bar` to `consume` in place of returning it, the `parseAgentId` and narrowing examples brace their `if` bodies, and its persisted-data bullet replaces the versioned-blob guidance; `principle-boundary-discipline` gains the boundary-trust refinement (port types are trusted, including one-line guards), the stored-local-data refinement, one-pass parsing through composed nested schemas, capability safeguards inside the opener that returns the capability, and configuration merged before each capability's subset is parsed. Exhaustiveness: in `principle-type-system-discipline`, the bullet is retitled "Exhaustive matching is the toolchain's job" and its checking question asks whether lint or the compiler will point to the missing case; the `never`-typed `default` patterns in `typescript-best-practices` (its Exhaustiveness row and `patterns.md`) and in `principle-type-system-discipline` are replaced by a `case` per variant with no `default`, enforced by `typescript/switch-exhaustiveness-check`, with a declared return type for value-returning switches and `assertNever(value)` after statement switches where that rule isn't configured; the `patterns.md` section holds the idiom. `typescript-best-practices` also gains `references/tooling-baseline.md`, the rule-backed lint, format, compiler, dead-code and CI settings, reached by a pointer after its table.
- **`drawing-diagrams` (addition).** Not from upstream. It renders Mermaid to dark blueprint SVGs with Pele through `scripts/render`, a bun script with tests. Its dependencies are unpinned caret ranges and `bun.lock` is gitignored. The SVGs target browsers and browser-engine harnesses.
- **`statechart` (third-party addition).** Copied from cursor/plugins `pstack/skills/statechart` at `519d36aa98955bf680db01bcde5fdfba686dc901`, MIT, copyright Lauren Tan. The licence is in `skills/statechart/LICENSE`. Everything not listed below, including `run.ts`, is upstream's code. The deltas:
  - `scripts/tla2tools` supplies the latest stable `tla2tools.jar` from an XDG cache, and the wrapper exports it as `TLA2TOOLS`, so TLC runs on the system Java without mise. A failure exits 2.
  - Charts always render through `drawing-diagrams` with `references/marks.css`, which replaces `references/render.md`.
  - `fast-check` uses a caret range, and the `test` script runs `test-tla2tools` and supplies `TLA2TOOLS`.
  - `test/render.test.ts` uses `drawing-diagrams`' Pele, unpinned Mermaid and jsdom, and `marks.css`.
  - The `SKILL.md` prose is in UK English, and identifiers keep upstream's spelling.
  - `scripts/statechart` runs `tla2tools` through `sh`, and `SKILL.md` invokes `statechart` and `render` through `sh`, so neither depends on executable bits.

  Upstream's scripts are not type-checked here. At the pinned commit, `tsc` reports four errors in upstream code: `run.ts:455` and `:471`, `test/cli.test.ts:430` and `:453`.

- **Applicable verification evidence.** Test and review evidence carries across messages, agents and completion handoffs while its relevant code, configuration and environment remain unchanged. Required project checks still apply; broaden or repeat only for changes, failures or concrete unresolved concerns. This follows the [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra) on unnecessary pauses, conflicting instructions and proportionate verification. Detailed workflows and review gates remain explicit.

- **Proportionate loading and prose compression.** Relevant, explicitly requested and workflow-required skills remain mandatory; current loaded guidance is reused and task-scoped subagents do not restart global routing. Repeated enforcement slogans, examples and warnings in using-skills, TDD, debugging, verification and review reception are condensed without changing test-first exceptions, root-cause investigation, controller findings/repair rules, review gates or evidence-based delivery. Hooks and helpers are unchanged. Loader deduplication is a separate unimplemented follow-up.

- **Trimmed skill descriptions.** Upstream description tails that summarise workflow ("- requires X; evidence before assertions always") are stripped: descriptions remain compact invocation pointers, per `writing-for-agents`.

- **Verification skills (third-party addition).** `create-verification-skill` and `maintain-verification-skill`, including the feature-map examples, are copied from [cursor/plugins](https://github.com/cursor/plugins/tree/fd268b808c786469e6dd8c8d9db864d0de4d669e/pstack/skills) at `fd268b808c786469e6dd8c8d9db864d0de4d669e`, MIT, copyright Lauren Tan. The generator remains user-invoked; the maintainer is model-reachable for scoped completion checks. The maintainer routes source-wave model and tool selection through `working-with-subagents`. Deltas: generated paths use `<repo>/.agents/skills/verify-<app>/`; generation adds an `AGENTS.md` pointer; "git refs" becomes "VCS refs"; the maintainer's description, changed outcome, triage and final step propose uncommitted corrections and await commit instruction instead of opening a PR when run standalone; completion passes return their edits and evidence to the controller under existing authority. `verification-before-completion` requires a drive through the project verify skill, where present, to claim a feature works for a user. The maintainer adds an explicit affected-scope mode, source/live evidence reuse, and coverage expansion when shared dependencies change; full audits retain whole-map coverage. Bare upstream slash-command names remain; the installation prefix is documented above.
- **Formal verification skills (third-party addition).** `create-formal-verification-skill` and `maintain-formal-verification-skill` are copied from cursor/plugins at `fd268b808c786469e6dd8c8d9db864d0de4d669e`, MIT, copyright Lauren Tan, with a user-invoked generator and a model-reachable maintainer. Deltas: generation writes `<repo>/.agents/skills/formal-<area>/SKILL.md` and an `AGENTS.md` pointer; sync points are jj commit IDs; jj file-history and text-search revsets are added where upstream names no commands; the standalone maintainer leaves changes uncommitted and asks for separate commit instruction; completion passes return selected-scope edits and proof to the controller. Scoped maintenance follows every covered change since each selected check's sync commit, including working-copy edits, reuses applicable evidence and preserves the ability-to-fail check; explicit audits retain full coverage. The generator directs agents to read this pack's installed `statechart` skill by path, while retaining `/statechart` as the user's typed alternative and copying none of its commands.
- **Learning loop skills (third-party addition).** `correct` and `reflect`, including reflect's four reference prompts, are copied from cursor/plugins at `fd268b808c786469e6dd8c8d9db864d0de4d669e`, MIT, copyright Lauren Tan. Both remain user-invoked. `correct` presents separate proposed changes with commits awaiting instruction, names the project's `AGENTS.md`, and scopes lint/CI enforcement to consumer repositories. `reflect` uses `shared/transcripts.md` instead of Cursor transcript discovery or a digest fallback; role selection goes through `working-with-subagents`, with strongest judgement/divergent/synthesis and standard tooling roles. Reviewers receive the transcript path and return their responses. Skill-use evidence in the reviewer prompts refers to harness/project skill directories and subagent prompts. `writing-for-agents` replaces `create-skill`, including description revision and routing names; the separate enforcement-principle pointer is removed. Backlog items are reported in the reply rather than filed externally. Approved edits target this pack or `<repo>/.agents/skills/`; the plugin-cache copy workflow is removed. The reference prompts retain generic MCP terminology and the illustrative `gpt-4` string.
- **Understanding skills (third-party addition).** `how`, `why`, `teach` and their reference prompts are copied from cursor/plugins at `fd268b808c786469e6dd8c8d9db864d0de4d669e`, MIT, copyright Lauren Tan. All three drop `disable-model-invocation`; their model-reachable descriptions deliberately spend context so explanation requests and cross-skill routing work. `using-skills` adds the routing sentence. `how` uses read-only standard explorers and a strongest explainer through `working-with-subagents`. `why` replaces model-rule and tool-mode instructions with standard read-only investigators and a strongest synthesiser; investigation starts with repository history, project documents and relevant linked PRs or issues. Sources must already be used by the project or supplied for the question; tool availability alone does not justify a query. Narrow questions can be answered inline, while broader investigations delegate non-overlapping sources. Git commands become jj annotate, history and `diff_lines` revsets; descriptions of rename traversal now state jj's actual file-history behaviour. Source-control investigator names replace git investigator names. Host-tool use is conditional on the repository and available tools. The six unused service playbooks for Datadog, Databricks, Linear, Slack, Notion and Sentry are removed, along with the mandatory seven-source roster and missing-MCP checklist. Incident guidance uses existing project evidence; the investigator and synthesis prompts report actual searches and relevant retrieval failures. The citation and confidence framework remains. `teach` keeps the teaching sequence and reply contract but replaces the diagram/image build-up with real code, `// so far:` annotations, numbered Java-analogue tables and narrated runtime logs; diagrams and standalone HTML are used on request. Its `why` invocation follows the selected project evidence without a skipped-category checklist.
- **`show-me-your-work` (third-party addition).** Copied from cursor/plugins at `fd268b808c786469e6dd8c8d9db864d0de4d669e`, MIT, copyright Lauren Tan; the upstream licence is in `skills/show-me-your-work/LICENSE`. Deltas: the model-reachable description includes formal plans and deliberately spends context; the TSV helper, usage and template gain `run` and `scope`, and a `flock` lock serialises header creation and row appends after a real concurrent-first-write check reproduced duplicate headers. Examples carry those cells and use checkpoint phases. Every row identifies its own writer and scope, replacing upstream `start` rows and stretches, whose attribution fails with concurrent sessions. Runs use transcript ids, unused numeric suffixes after lost context, or dated fallback labels with a fresh random UUID, avoiding same-second collisions. The helper is invoked through `bash <skill dir>/scripts/log.sh` with absolute paths. The log joins `.agents/sdd/`, with create-if-absent ignore handling and user-controlled tracking. Checkpoints carry evidence beyond the state ledger. Rulings are trail rows, replacing `Ruling:` lines across SDD, inline execution, recovery, review handling, receiving review and finishing; reviewer waits use the previous dispatch duration or 15 minutes, then doubling intervals. Supersession uses explicit stable line references and the latest connected correction, retaining scope/phase/decision; stop rows remain immutable. Stop/resume rules distinguish delivery from user-waiting stops, keep formal next actions in `progress.md`, and verify inherited claims. The audit samples only the selected transcript and run, adds missing events under their original scope and precedes review and the delivery stop row. The external-reviewer route replaces upstream model selection and adds provider/model labels, same/unknown-provider handling, exit/body validation and one retry; only delivery replies carry Attention. `finishing-development` Step 3 owns audit and review when used. A dedicated reviewer prompt is added with bounded transcript reads, line citations and the Attention contract. `skills/shared/transcripts.md` is added as the one canonical harness-specific reference, sectioned per harness for roots, project directories, top-level candidates, prompt matching and id-to-path reuse. A verified local correction honours `CODEX_HOME` and skips injected instruction/history messages when matching the live user request. The separate enforcement-principle pointer is removed. The Claude adapter adds trail argument/path validation, low default effort, optional guarded jq label lookup and prefix/suffix handling, leaving pi's exit status intact and transcript content out of inline arguments; its skill scopes document-review rules to design/plan modes.


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
