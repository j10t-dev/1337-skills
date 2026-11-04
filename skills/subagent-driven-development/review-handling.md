# Review handling

Use the reviewer's technical findings to decide the next action. The `Ruling:` lines in `progress.md` are the only decision record.

- Rule on a finding the approved design settles: fix it when the design requires the behaviour, set it aside when the design excludes it, and record `Ruling: <what> because <design clause>`. A ruling never adds behaviour. Put a finding the design leaves open to the user.
- Fix genuine defects. A round is one fix dispatch, or one inline fix pass, followed by its re-review; write `fix round N of 5` on the task's progress line before starting it. Rounds 1 to 3 reuse the original implementer, or a fresh one on the same model when it is unavailable. Round 4 dispatches a fresh implementer on a more capable model, selected under `working-with-subagents`, and round 5 reuses it, with "A prior implementer attempted this task N times; you own it now" (N is the number of fix rounds completed so far), the open findings and the fix history in the prompt's `Fix history:` slot. When no more capable model is available (only an inherited model is exposed, or the original implementer already used the strongest), dispatch the fresh implementer on the same model with the same wording; the cap and escalation are unchanged. Where no implementer is dispatched, the executor fixes its own work in every round and the cap still applies. Run the tests that exercise the change, then ask the reviewer to mark each original finding resolved or open with file:line evidence and check for defects introduced by the fix.
- At the cap, when findings remain open after round 5: a ruling may only dismiss a finding the design settles as not a defect (for example a reviewer asking for behaviour the design excludes); it never authorises a further round. Every finding still open, including a defect the design settles, goes to the user with the open findings and the fix history. Do not dispatch a sixth round.
- If a finding is wrong, explain why directly; ask the user when a consequential disagreement cannot be resolved.
- If the reviewer lacks context, supply it and let the reviewer finish the assessment.
- For `NEEDS_CONTEXT`, provide the missing requirements or code without enlarging the task.
- For `BLOCKED`, resolve the blocker under the approved design or ask the user; retry only when something relevant has changed.
- Investigate failures against the baseline and agree out-of-scope repairs with the user before assigning them.
- Review an agreed blocking repair together with its task, and update the unaccepted task's plan instructions if necessary.

Continue until the review is clean or the cap is reached; escalate genuine blockers rather than declaring them resolved. Final-review fixes in `finishing-development` follow the same rounds and cap on the `Final review` line. Inline execution reports blockers to its caller and leaves review to finishing.
