# Review handling

Use the reviewer's technical findings to decide the next action, not to create a decision history.

- Fix genuine defects, run the tests that exercise the change, and ask the reviewer to check the fix.
- If a finding is wrong, explain why directly; ask the user when a consequential disagreement cannot be resolved.
- If the reviewer lacks context, supply it and let the reviewer finish the assessment.
- For `NEEDS_CONTEXT`, provide the missing requirements or code without enlarging the task.
- For `BLOCKED`, resolve the blocker or ask the user; retry only when something relevant has changed.
- Investigate failures against the baseline and agree out-of-scope repairs with the user before assigning them.
- Review an agreed blocking repair together with its task, and update the unaccepted task's plan instructions if necessary.

Continue until the review is clean; escalate genuine blockers rather than declaring them resolved. Inline execution reports blockers to its caller and leaves review to finishing.
