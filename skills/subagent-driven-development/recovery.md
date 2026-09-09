# Recovery

Use the progress tracker and jj state to resume the active plan without repeating completed tasks.

- Confirm the plan, run base and feature bookmark match the active work; ask if they do not.
- If a completed task's commit exists but the tracker or bookmark lags, update them from jj.
- Resume an unfinished task with its existing edits and any agreed repair; do not start a second implementer over it.
- After reviewed fixes have been absorbed, use the stable change IDs to refresh completed commit IDs in the tracker.
- If all tasks are complete, resume `finishing-development`, including any unfinished final-review fixes.
- Stop on unexplained edits, conflicts or history changes rather than guessing how to repair them.

SDD resumes its implementation or task review; inline execution resumes implementation and verification only.
