---
name: show-me-your-work
description: "Keep a reviewable decision trail for long-running, unattended or multi-phase work and for every formal plan run: a TSV log with one row per decision (what, why, evidence, result), each row naming its run and scope. Use for /show-me-your-work, autonomous or multi-phase runs, or work a human reviews after stepping away."
---

# Show me your work

Keep one canonical log.

## The format

A single TSV file, one row per decision. Cells stay single-line. Evidence is a pointer, not prose.

Copy `references/decision-log-template.tsv` (the header row) to start a clean log. Columns:

- **ts.** ISO8601 timestamp.
- **run.** The run id: the session id from the transcript lookup in [../shared/transcripts.md](../shared/transcripts.md), held in working context. A controller with no run id in context is a new run and, when the log already holds `<id>`, takes the next unused suffix (`<id>-2`, then `<id>-3`). Use `<yyyy-mm-dd>-<request slug>-<uuid>` when no session matches; generate a fresh random UUID with `uuidgen --random` for each new run.
- **scope.** The absolute plan path under a formal plan, or a one-line request slug for ad-hoc work. A plan switch changes the value the next rows carry and writes nothing.
- **phase.** The row type: `baseline`, `task`, `fix`, `wait`, `blocker`, `ruling`, `review`, `stop`.
- **decision.** What was chosen or done, one line.
- **why.** The reason in plain words. If a principle drove it, say it plainly, not as a jargon tag.
- **evidence.** A link or path that proves it: commit SHA, PR number, `file:line`, or an artefact, trace, or screenshot path. Never a paragraph.
- **result.** The outcome or predicate state: `tests green`, `reverted`, `pixel-diff 0`, `INCONCLUSIVE`, `open`.

An example, plain-spoken so a reviewer reads it at a glance.

```
ts	run	scope	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	run-a	/home/me/docs/widget/plans/widget.md	baseline	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	run-a	/home/me/docs/widget/plans/widget.md	baseline	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	run-a	/home/me/docs/widget/plans/widget.md	task	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	run-a	/home/me/docs/widget/plans/widget.md	fix	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## Logging a row

Write each entry the way you'd tell a teammate what you did. Plain words, concrete actions, no AI speak or abstract jargon (the **unslop** skill applies to log text too).

Use the helper `bash <skill dir>/scripts/log.sh <absolute logfile> <run> <scope> <phase> <decision> <why> <evidence> <result>` from any directory; paths are absolute. It requires `bash` and `flock`, and serialises initialisation and appends through a lock on the log file. It stamps `ts`, writes the header on first use, strips stray tabs/newlines, and prefixes any cell starting with `=`, `+`, `-`, or `@` with a single quote. A bare `printf` appending a row works too, but mind those same bytes if cells come from generated or user-supplied text.

Log decision points and checkpoints, not every action: a fork chosen, a unit completed with its verification result, a pivot or revert with its trigger, a blocker surfaced, a gate fixed. For loop runs, one row per iteration. Skip the trivial and self-evident.

Every checkpoint row carries a why or evidence that the plan ledger lacks: verdict summaries, commit IDs, elapsed times, reasons.

A run is one session transcript, including its later turns, a compaction of it and a harness-level resume of the same session; a new session or a replacement agent is a new run. Plan scope is every row whose scope is the plan path; run scope is every row whose run is the id. Two sessions may write at once; attribution never reads a neighbouring row.

### Rulings

A ruling row has phase `ruling`, decision `<what>`, why `<design clause>`, evidence `<design path>#<section>`, and result `applied` or `set aside`. These rows are the only ruling record. Ad-hoc work with no trail states rulings in the report instead.

## Where it lives

By default the log is `<repo>/.agents/sdd/decisions.tsv`, ignored by `<repo>/.agents/sdd/.gitignore`; before the first row create that file containing `*` if absent, never overwriting. If the log is already tracked, tell the user, since untracking needs instruction. Ask the user to commit it when a reviewer needs the trail to trust the result; that needs the ignore rule lifted, which is the user's VCS change.

## Rules

- Append-only. A wrong call gets a new row that supersedes it. Never edit or delete history.
- Prefer evidence produced by committed scripts over hand-made one-offs.

- Supersession: a row that corrects an earlier row keeps the earlier row's `scope`, `phase` and `decision` text and begins its `why` with `supersedes row <line>`, where `<line>` is the 1-based line number of the row it replaces, which may itself be a superseding row (the header is line 1; rows are never deleted, so line numbers are stable). Supersession is explicit only. Rows linked by such references form a chain; the operative row of a chain is its latest row in the file, and every other member is dropped. Rows that merely repeat text are independent events. Rows are identified by line number everywhere, including reviewer flags, not by timestamp, which `log.sh` records only to the second. `stop` rows are never superseded; an audit that finds one wrong reports it in the `Attention` block.

## Stopping and resuming

A stop is any end of the run's turn that awaits the user: delivery, a blocker or fix-cap question, an open design question, or a deliberate pause. On any stop the run's last row has phase `stop`. Under a formal run its decision is the verified-state claim and its evidence the key paths; the next action stays in `progress.md`. Its `why` is `delivery`, `blocker`, `fix cap`, `design question` or `pause`. Its result is `reviewed: <n> flags` after a successful review; `unreviewed: <reason>` when the review was skipped or failed (`no transcript`, `review failed twice`, `no cross-family reviewer`, `reviewer provider unknown`); `awaiting: <blocker | fix cap | design question | pause>` for a non-delivery stop, which runs no audit and no review. At delivery the order is: audit, cross-model review, then the `stop` row. Under an ad-hoc run the `stop` row also names the next action, since no `progress.md` exists. On resume under a formal run, `recovery.md` applies. On resume with no `progress.md`, take the request the user names, otherwise the scope of the newest ad-hoc `stop` row; redo nothing a row in that scope records as done, and check any inherited "verified" claim against the real artefact before building on it.

## Audit the log against the transcript

At the end of the run, before handing back, check the log told the truth. Find this run's transcript through [../shared/transcripts.md](../shared/transcripts.md); read only its first line, its last 200 lines or 64 KB, whichever is smaller, and search hits for each in-scope row's decision text. Walk this run's rows against what actually happened. This run's rows are those whose run cell is this run's id.

- Check that every row maps to a real decision or action.
- Check that each row's evidence resolves and shows what the row claims.
- A fork, pivot, or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records neither a real decision nor a real action, or its claim or evidence is wrong, add a row that supersedes it with what actually happened and a pointer that resolves. A missing event you recover is an ordinary row carrying the scope it belongs to. If this run's own work shows one of them is wrong, supersede it like any wrong call.

Whenever `finishing-development` runs for the work, its Step 3 owns this audit and the review below, audit first; run them yourself only when the run ends without it.

## Cross-model review of the trail

Before handing back, have a strongest-tier subagent of a different model family review the trail, through an external-reviewer adapter where the harness provides one, otherwise under `working-with-subagents`. A different family is a different provider from the model that did the work. Self-review is not a substitute. The subagent reads the audit trail and the run's transcript, then flags what the user should pay attention to. Not a redo of the work, a scan for what's suboptimal or risky.

The reviewer receives [references/trail-reviewer-prompt.md](references/trail-reviewer-prompt.md), the log, its path, the transcript path and the run id, and reviews only rows whose run is that id. The `reviewed by` line has the form `reviewed by <provider>/<model>`; an adapter prints it, otherwise write it from the dispatch you made. Compare the provider with the one the running harness reports for its own model: different means reviewed; the same adds `(same family)` and the stop result `unreviewed: no cross-family reviewer`; unknown on either side adds `(provider unknown)` and `unreviewed: reviewer provider unknown`. A review succeeds when the invocation exits zero and the body after the `reviewed by` line begins with the `Attention` heading; otherwise retry once, then record the failure in the block. When no such reviewer exists, the block records `reviewed by none` and the reason. When no transcript was found, skip the audit and review and record `reviewed by none` with `no transcript found`.


- Decisions logged with weak or absent evidence.
- Verification steps skipped or claimed without proof in the transcript.
- Choices that look risky in hindsight (premature, scope-creeping, papering over a symptom).
- Gaps the user would otherwise miss on a casual skim.

The hand-back for a run that produced a trail ends with an `Attention` section: the delivery report under `finishing-development`, or the final reply of a run that ends without it. Lead with the `reviewed by <provider>/<model>` line, then list each flag pointing at a row by line number or a transcript moment. `No flags` is a valid value. Intermediate replies carry none.

## Reviewing the trail

Read top to bottom, follow the evidence pointers, spot-check. GitHub renders a committed TSV as a table. `column -s$'\t' -t decisions.tsv` renders it in a terminal.

## Composing this skill

Other skills route their audit trail here instead of inventing one. Reference it by name and let it own the format. Don't restate the columns.
