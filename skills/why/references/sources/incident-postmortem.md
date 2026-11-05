# Incident and postmortem context

For defensive code, trace the change to its triggering bug using existing project evidence:

- Search jj history for the relevant symbols, bug fixes, reverts and regression tests around the change.
- Read linked PRs and issues through the repository's existing host tools, when available.
- Read incident notes, postmortems and relevant logs already supplied or documented by the project. Match their dates and symptoms to the change.

A defensive check alone does not prove that an incident occurred. If the record does not establish the trigger, report the reason as unknown.
