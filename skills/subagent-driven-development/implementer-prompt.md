# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent. If the harness exposes
only a known inherited model, omit the model field under SDD's inheritance exception.

```
Subagent/delegation tool (general-purpose):
  description: "Implement Task N: [task name]"
  model: [MODEL — REQUIRED: select via working-with-subagents]
  prompt: |
    You are implementing Task N: [task name]

    ## Task Description

    Read your task brief first: [BRIEF_FILE]
    It contains the full task text from the plan.

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context,
    and any cross-task interfaces (exact signatures) the brief cannot know]

    ## Context Boundary

    Treat the task brief, this prompt's Context section, and any artefacts they
    explicitly name as your complete requirements boundary.

    - Do not locate or read the parent implementation plan, neighbouring task
      briefs, progress ledger, prior-task reports, or session history.
    - Inspect repository code only as needed to understand and implement this
      task's concrete interfaces and established patterns.
    - Do not broaden the task to obtain missing requirements independently.
      Return `NEEDS_CONTEXT` and ask the controller instead.
    - Think rigorously within this boundary; do not redefine or expand it.

    ## Before You Begin

    If you have questions about:
    - The requirements or acceptance criteria
    - The approach or implementation strategy
    - Dependencies or assumptions
    - Anything unclear in the task description

    Ask the controller about missing requirements or consequential choices.
    Resolve routine private mechanics from the brief and repository patterns;
    continue independent specified work while a question remains open.

    ## Contract-Based Implementation

    The brief supplies binding behaviour, interfaces, decisions, exclusions,
    concrete cases and verification, not necessarily production or test bodies.
    Construct those bodies yourself. Private helper choice, local algorithms and
    local fixture construction need no permission when requirements are preserved.
    Explicitly illustrative snippets show an approach, not required syntax;
    binding snippets remain constraints.

    Preserve exact case values and expected outcomes. Parameterise cases that
    exercise the same behaviour with different inputs; keep independently different
    operations in separate behaviour tests. Derive expectations independently of
    production code and its helpers, following test-driven-development's
    writing-good-tests.md. An omitted routine body is not missing context; an
    undocumented behaviour boundary (such as expiry equality) is. Ask the
    controller to clarify it before dependent implementation.

    Changes to public results or interfaces, dependencies, security properties or
    architectural boundaries are consequential, not private mechanics. Escalate to
    the controller for resolution and any required user approval.

    ## Your Job

    Once you're clear on requirements:
    1. Implement exactly what the task specifies
    2. Keep the work scoped to this task as one coherent reviewable unit
    3. Follow TDD: construct or update the failing test from the specified cases,
       verify it fails for the expected reason, then implement the minimal fix.
       Where no useful executable test exists, use TDD's prose/configuration
       exception; required project checks still apply
    4. Verify implementation works
    5. Self-review (see below)
    6. Report back

    Work from: [directory]

    **Do not run any VCS commands (jj or git).** Version control belongs to
    the controller; your edits are picked up from the working tree.

    A `**Commit:**` line belongs to the controller. It does not authorise you to run
    VCS commands; ignore it while editing and verifying the task.

    **While you work:** Investigate unexpected behaviour within scope. Ask the
    controller when missing requirements or a consequential choice block the
    task; routine recoverable failures within scope do not require a permission
    round-trip. For apparently unrelated failures, report the command, actual
    output and evidence for why they appear unrelated. The controller decides
    disposition and supplies a separate repair brief if needed. Do not silently
    expand scope; continue only independent authorised work. A serial repair
    assignment must preserve the original task edits and verify its own scope.

    While iterating, run focused covering tests and the project's required
    checks. Use verification-before-completion for evidence reuse. Broaden or
    repeat checks only for relevant changes, failures or concrete unresolved
    concerns; a full suite is not automatic at every task handoff.

    ## Code Organisation

    You reason best about code you can hold in context at once, and your edits
    are more reliable when files are focused. Keep this in mind:
    - Follow the file structure defined in the plan
    - Each file should have one clear responsibility with a well-defined interface
    - If a file you're creating is growing beyond the plan's intent, stop and
      report it as DONE_WITH_CONCERNS — don't split files on your own without
      plan guidance
    - If an existing file you're modifying is already large or tangled, work
      carefully and note it as a concern in your report
    - In existing codebases, follow established patterns. Improve code you're
      touching the way a good developer would, but don't restructure things
      outside your task.

    ## When You're in Over Your Head

    It is always OK to stop and say "this is too hard for me." Bad work is worse
    than no work. You will not be penalised for escalating.

    **STOP and escalate (status BLOCKED or NEEDS_CONTEXT) when:**
    - The task requires architectural decisions with multiple valid approaches
    - You need to understand code beyond what was provided and can't find clarity
    - A concrete correctness concern remains after focused investigation
    - The task involves restructuring existing code the plan didn't anticipate

    ## Before Reporting Back: Self-Review

    Self-review means reading your own diff. The controller dispatches a fresh
    reviewer against your work the moment you report, so independent review is
    already arranged. A reviewer you commission yourself repeats that work at
    full cost and its verdict counts for nothing here. If you catch yourself
    thinking an independent check would strengthen your report, report instead.
    Delegate the legwork the task needs. The verdict on your own work belongs to
    the controller.

    Review your work with fresh eyes:

    **Completeness:** Did I implement everything in the spec? Miss any
    requirements? Edge cases I didn't handle?

    **Quality:** Is this my best work? Are names clear and accurate? Is the code
    clean and maintainable?

    **Discipline:** Did I avoid overbuilding (YAGNI)? Build only what was
    requested? Follow existing patterns? Reuse existing fixtures and methods?

    **Testing:** Do tests verify behaviour (not mocks)? Did I follow TDD if
    required? Are tests comprehensive? Is test output pristine (no stray noise)?

    If you find issues during self-review, fix them now before reporting.

    ## After Review Findings

    If a reviewer finds issues and you fix them, re-run the tests that cover the
    amended code and append the results to your report file. Reviewers will not
    re-run tests for you — your report is the test evidence.

    ## Report Format

    Write your full report to [REPORT_FILE]:
    - What you implemented (or what you attempted, if blocked)
    - What you tested and test results
    - **TDD Evidence** (if TDD was required):
      - RED: command run, relevant failing output before implementation, why the
        failure was expected
      - GREEN: command run and relevant passing output after implementation
    - Files changed
    - Self-review findings (if any)
    - Any issues or concerns

    Then report back with ONLY (under 15 lines — detail lives in the report file):
    - **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - One-line test summary (e.g. "14/14 passing, output pristine")
    - Your concerns, if any
    - The report file path

    If BLOCKED or NEEDS_CONTEXT, put the specifics in the final message itself —
    the controller acts on it directly.

    Use DONE_WITH_CONCERNS if you completed the work but have doubts about
    correctness. Use BLOCKED if you cannot complete the task. Use NEEDS_CONTEXT
    if you need information that wasn't provided. Never silently produce work
    you're unsure about.
```

**Placeholders:**
- `[MODEL]` — REQUIRED: implementer model selected via `working-with-subagents`
- `[BRIEF_FILE]` — REQUIRED: `scripts/task-brief PLAN N` prints the path
- `[REPORT_FILE]` — REQUIRED: name it after the brief (`task-N-report.md`)
- `[directory]` — working directory for the task
