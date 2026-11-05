---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, postmortems, or data-backed thresholds. Investigates repository history, project documents and relevant linked discussions, then returns cited findings with explicit confidence. Use how for runtime behaviour."
---

# Why

Investigate the motivation and intent behind code. The companion `how` skill answers what the code does and how it works. `why` answers what forces led to its shape.

Investigators are standard-tier subagents and the synthesiser a strongest-tier subagent, selected under `working-with-subagents`. Investigators remain read-only.

## Operating Posture

Operate as a **careful, cautious, and precise investigator**. Be honest about what you know vs what you're inferring. Read `references/epistemics.md` for the full confidence framework and phrasing guide. The synthesiser must follow it.

## Step 1. Understand the Target and the Question

The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?" with no clear referent), make your best guess from conversation context (open files, recent edits, cursor location, what was just discussed). State your interpretation briefly so the user can redirect if you're off, then proceed.

## Step 2. Establish the Code Anchor

Before spawning investigators, build the seed context inline: file paths and line ranges, key symbols (functions, classes, constants), the last few commits touching the target, PR numbers from merge commits (pattern `(#1234)` in the subject line), and any linked ticket IDs. Run `jj file annotate <file>` for last-touch commits, `jj log -p -r 'files(root:"<file>")'` for file history with patches, `jj log -r 'files(root:"<file>")' -n 20` for recent commits with PR numbers visible, and `jj log -r <commit> --no-graph -T description` to extract PR numbers. For a GitHub repository with `gh` available, read relevant PR bodies and discussion with `gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`. Otherwise use the repository's existing host tools when available. This anchor goes to every investigator and to the synthesiser.

## Step 3. Investigate Relevant Sources

Start with repository history, code comments, tests and project documents. Follow the project's documented locations for designs and plans, including an external docs repository when configured. Read linked PRs and issues where they bear on the question.

Use sources already in use by the project or explicitly supplied for this question. Tool availability alone is not a reason to query a service. This skill does not install, connect or recommend additional services.

Use [references/source-playbook.md](references/source-playbook.md) to select the relevant search guidance. For defensive code, also use [references/sources/incident-postmortem.md](references/sources/incident-postmortem.md) to look for the triggering bug in the existing record.

For a narrow question, investigate and answer inline when the available evidence suffices, applying the confidence framework and output contract below. For a broader question, split the selected sources into non-overlapping assignments and run read-only investigators in parallel. Give each `references/investigator-prompt.md`, the applicable playbook, the code anchor and the user's question.

Record sources actually searched, including searches that returned nothing. Report unavailable evidence when a concrete reference or the question makes it relevant, such as a linked PR that cannot be read. Unused services are not missing coverage and require no skipped-source checklist.

## Step 4. Synthesise

After parallel investigation, spawn one synthesiser. For an inline investigation, apply the same synthesis guidance yourself. The synthesiser receives:
1. The investigator findings, including empty searches and relevant evidence that could not be retrieved
2. The code anchor
3. The user's original question
4. The epistemics framework from `references/epistemics.md`
5. The synthesiser prompt template from `references/synthesizer-prompt.md`

## Step 5. Present

Present the synthesiser's output to the user. You may lightly edit for clarity or add context from the conversation, but **do not rewrite the confidence language**.

## Output Format

The structure is the one in `references/synthesizer-prompt.md`: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Adapt as needed, but keep the confidence separation intact, and keep Sources Consulted as one line per source searched, including empty searches and relevant retrieval failures, with the reason.

After Sources Consulted, if the user's `why` question is a precursor to changing this code, convert the lineage findings into a Preserve / Change / Avoid / Risk constraint set for planning the change.

## Common Failure Modes to Avoid

- **Recency bias**. Assuming the most recent commit is authoritative. The current shape is often the accretion of many earlier decisions. Trace back.
