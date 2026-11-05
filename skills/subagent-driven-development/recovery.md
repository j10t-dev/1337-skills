# Recovery

Read `.agents/sdd/progress.md` and use jj state to resume the active plan without repeating completed tasks.

- Confirm the plan, run base and feature bookmark match the active work; ask if they do not.
- If a completed task's commit exists but the progress file or bookmark lags, update them from jj.
- Resume an unfinished task with its existing edits, any agreed repair and its recorded `fix round N of 5` count; do not start a second implementer over it or reset the count.
- After reviewed fixes have been absorbed, use the stable change IDs to refresh completed commit IDs in the progress file.
- Recorded operative `ruling` rows in the plan's scope stand (rows whose scope is the plan path, with supersession chains resolved to their latest row); apply them rather than re-deciding. Read the last row in that scope for the last checkpoint, and check any inherited "verified" claim against the real artefact before building on it.
- Keep the run id from context; a controller with no run id is a new run (see `../show-me-your-work/SKILL.md`).
- If all tasks are complete, resume `finishing-development`, including any unfinished final-review fixes and their recorded fix-round count.
- Stop on unexplained edits, conflicts or history changes rather than guessing how to repair them.

SDD resumes its implementation or task review; inline execution resumes implementation and verification only.
