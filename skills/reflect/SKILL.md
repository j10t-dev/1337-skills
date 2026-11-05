---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Locate the active transcript

Locate this conversation's transcript with the rules in [../shared/transcripts.md](../shared/transcripts.md), applying that reference's active-session selection rule. If none matches, stop and say so.

## 2. Spawn three reviewers in parallel

Dispatch three reviewers in parallel under `working-with-subagents`; reviewers need the tools the harness exposes to look up what the transcript references.

| Lens | Tier | Prompt template |
|---|---|---|
| Judgement | strongest | `references/judgment-reviewer.md` |
| Tooling | standard | `references/tooling-reviewer.md` |
| Divergent | strongest | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript path where marked. Reviewers return findings in their responses.

## 3. Synthesise

Dispatch one synthesiser on the strongest tier with `references/synthesizer.md`, inlining each reviewer's full output where marked. It returns an Accepted / Rejected / Backlog list.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog.

## 5. Apply

Present the synthesiser's full Accepted / Rejected / Backlog output and wait for explicit approval before applying any Accepted edit. The user picks the subset and may redirect routings. Skill changes affect every future agent in the org. Do not auto-apply.

List each Backlog item in your reply; only the Accepted list waits for approval.

Before approval, show each edit's destination: this pack's `skills/<skill>/` for a pack skill, `<repo>/.agents/skills/<skill>/` for a project skill. Never open a PR or push.

Follow each approved row's Routing exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): the parent does it directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): follow `writing-for-agents`.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): revise the description under `writing-for-agents`.
- `new skill via writing-for-agents: <kebab-name>`: hand creation to `writing-for-agents`. Do not invent the shape ad hoc.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done.

## 6. Summarise for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog: `<item>`. One line each.
- Dropped: one line per rejected finding + reason from the synthesiser.
