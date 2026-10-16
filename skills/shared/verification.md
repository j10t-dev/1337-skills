# Verification

Shared policy for establishing baselines, reusing evidence and handling failures. Project instructions supply required commands and additional constraints. Verification does not grant permission to access production data, run untrusted code, change devices, expand scope or perform VCS operations.

## Establish the baseline during design exploration

For a change to existing code or executable configuration, run required project checks during design exploration, before asking for design approval. Record the starting revision, commands, actual output, exit statuses, elapsed times and checked scope. Use failures and unavailable checks to inform the design's testing constraints and the plan, rather than discovering them only when implementation begins.

For direct work without a design phase, establish the baseline before implementation. For a supplied plan without applicable baseline evidence, establish it before dependent implementation and surface any consequence for the approved design. For a new project without executable checks, record that fact and specify how verification will be introduced. Read-only advice and prose-only changes need relevant inspection, not unrelated build, test or lint runs; designing an executable change is not exempt merely because the current deliverable is prose.

Carry the baseline evidence into planning and task handoffs. Planning specifies the required checks and their expected outcomes. Reuse applicable evidence rather than rerunning it to cross a workflow boundary.

## Reuse evidence

Run missing or invalidated checks for relevant code, configuration or environment changes, failures or a concrete unresolved doubt. Evidence survives handoffs, resumes and formatting differences; fix an incomplete report rather than rerunning a check whose result is already available. Complete required project checks without broadening the suite by default.

Investigate material, repeatable test-runtime changes or timeout failures, accounting for checked scope and environment. Ordinary timing variation alone does not require a diagnostic investigation.

## Failures and unavailable checks

Investigate failed or unavailable baseline checks. Continue only authorised work whose implementation and verification do not depend on the unresolved check. Record the limitation and its consequences before design approval; do not present a dependent design or task as verified. Fix introduced regressions within scope. Ask before broader repairs. Unresolved verification limitations still require explicit user acceptance before delivery.

Investigate subsequent failures against the baseline, changed code and environment. A pre-existing claim needs evidence; a passing rerun alone does not explain an intermittent failure. Scoped agents report the command, actual output and attribution evidence to the controller. Resolve failures before delivery unless the user explicitly accepts a stated limitation.

## Report supported claims

Make claims only for the scope supported by actual output and required review verdicts. Report results and remaining gaps concisely; task-only checks do not prove the whole feature passed. `verification-before-completion` checks whether this evidence supports acceptance and delivery claims.
