# Recovery

Read `.agents/sdd/progress.md` and use jj state to resume the active plan without repeating completed tasks.

- Confirm the plan, run base and feature bookmark match the active work; ask if they do not.
- If a completed task's commit exists but the progress file or bookmark lags, update them from jj.
- Resume an unfinished task with its existing edits, any agreed repair and its recorded `fix round N of 5` count; do not start a second implementer over it or reset the count.
- After reviewed fixes have been absorbed, use the stable change IDs to refresh completed commit IDs in the progress file.
- Recorded `Ruling:` lines stand; apply them rather than re-deciding.
- If all tasks are complete, resume `finishing-development`, including any unfinished final-review fixes and their recorded fix-round count.
- Stop on unexplained edits, conflicts or history changes rather than guessing how to repair them.

SDD resumes its implementation or task review; inline execution resumes implementation and verification only.
