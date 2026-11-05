# Review handling

Use the reviewer's technical findings to decide the next action. The `ruling` rows in `.agents/sdd/decisions.tsv` are the only decision record.

- Rule on a finding the approved design settles: fix it when the design requires the behaviour, set it aside when the design excludes it, and log a `ruling` row. A ruling never adds behaviour. Put a finding the design leaves open to the user.
- Fix genuine defects. A round is one fix dispatch, or one inline fix pass, and its re-review; write `fix round N of 5` on the task's progress line first. Rounds 1 to 3 reuse the original implementer, or a fresh one on the same model if it is unavailable. Rounds 4 and 5 use one fresh implementer on a more capable model selected under `working-with-subagents`, or the same model when none is stronger, told "A prior implementer attempted this task N times; you own it now" with the open findings and history in the prompt's `Fix history:` slot. Without an implementer, the executor fixes its own work under the same cap. After each fix, run the tests that exercise the change, then have the reviewer mark each finding resolved or open with file:line evidence and check for new defects.
- At the cap, after round 5, a ruling may dismiss only a finding the design settles as not a defect; everything still open goes to the user with the fix history. Never dispatch a sixth round.
- If a finding is wrong, explain why directly; ask the user when a consequential disagreement cannot be resolved.
- If the reviewer lacks context, supply it and let the reviewer finish the assessment.
- For `NEEDS_CONTEXT`, provide the missing requirements or code without enlarging the task.
- For `BLOCKED`, resolve the blocker under the approved design or ask the user; retry only when something relevant has changed.
- Investigate failures against the baseline and agree out-of-scope repairs with the user before assigning them.
- Review an agreed blocking repair together with its task, and update the unaccepted task's plan instructions if necessary.

Continue until the review is clean or the cap is reached; escalate genuine blockers rather than declaring them resolved. Final-review fixes in `finishing-development` follow the same rounds and cap on the `Final review` line. Inline execution reports blockers to its caller and leaves review to finishing.
