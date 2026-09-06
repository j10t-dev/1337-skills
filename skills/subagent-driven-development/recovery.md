# Recovery

Load on resume, interruption or unexplained state. Root `SKILL.md` owns Durable Progress record forms and Version Control authority.

Legacy, stale, or foreign ledger formats have no migration or compatibility path: stop rather than guessing or converting.

Before any redispatch, prove:

- every completed ledger change ID and commit ID still resolve to the same snapshot;
- described commits after run base form one path in plan order;
- each recovered task has the exact plan subject and expected parent;
- completed task commits are never amended or redispatched.

## Combined repair intent

Before applying a recovery row to an unaccepted combined task, inspect its repair brief, reports and scope/subject rulings. Rulings explain intent, not completion; only `->` state lines identify accepted work.

If interrupted after repair scope was recorded but before subject amendment, reconcile the recorded original and replacement prospective subjects and reason against the still-unaccepted task. Complete the narrow plan-text correction only when that intent and repository state agree exactly. If the replacement is missing, contradictory or otherwise incomplete, stop affected work and ask rather than guessing. Regenerate the task brief from the amended plan before review. Resume only the recorded serial repair or dual-scope review, preserving its fix round; do not redispatch an original-only brief over repair edits.

After combined acceptance, use the amended plan's exact subject and the existing commit/ledger identities. A ruling never substitutes for those identities or authorises accepted-commit amendment.

## Recovery table

After those checks, perform only the action in the first matching recovery row. An unblocking fix uses the final-fix rows identically.

A recorded non-blocking follow-up does not own the active task's edits. While a
task is in progress, reconcile and resume that task first; pending-fix rows apply
only once the active task is accepted and the recorded repair owns the working
change. If the brief/ruling evidence does not establish ownership, stop and ask.
For inline execution, resume inline work or its existing final review rather
than adding a task subagent. The state and identity checks are unchanged.

| Observed state | One recovery action |
|---|---|
| initialised ledger, absent feature bookmark, no task commits | Create the missing bookmark at run base. |
| next exact task commit present while bookmark and ledger are behind | Advance the bookmark, then record its full identities. |
| bookmark advanced while ledger still says in progress | Record the commit's full identities. |
| completed final-fix commit with bookmark or ledger behind | Advance the bookmark, then record its full identities. |
| pending final fix plus empty `@` and no matching child | Resume the recorded final-fix wave. |
| pending final fix plus non-empty undescribed `@` | Resume run-base-through-`@` re-review. |
| task in progress plus empty `@` | Dispatch or resume the recorded task. |
| task in progress plus non-empty undescribed `@` | Dispatch or resume the recorded task. |
| empty `@` above feature bookmark with no pending entry | Start the first uncompleted task or final review. |
| unexplained non-empty `@`, described active `@`, divergence, or identity mismatch | Ambiguous: stop and ask. |

Do not use `jj op log` as a substitute ledger and do not repair any state outside this table. If no row matches exactly, stop and ask. Acceptance follows root `SKILL.md`, Accepting a Task or Final Fix.
