# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

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

    **Ask them now.** Raise any concerns before starting work.

    ## Your Job

    Once you're clear on requirements:
    1. Implement exactly what the task specifies
    2. Keep the work scoped to this task as one coherent reviewable unit
    3. Follow TDD: write or update the failing test first, verify it fails for
       the expected reason, then implement the minimal fix
    4. Verify implementation works
    5. Self-review (see below)
    6. Report back

    Work from: [directory]

    **Do not run any VCS commands (jj or git).** Version control belongs to
    the controller; your edits are picked up from the working tree.

    A `**Commit:**` line belongs to the controller. It does not authorise you to run
    VCS commands; ignore it while editing and verifying the task.

    **While you work:** If you encounter something unexpected or unclear, **ask
    questions**. It's always OK to pause and clarify. Don't guess.

    While iterating, run the focused test for what you're changing; run the
    full suite once before reporting back, not after every edit.

    ## Code Organization

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
    - You feel uncertain about whether your approach is correct
    - The task involves restructuring existing code the plan didn't anticipate

    ## Before Reporting Back: Self-Review

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
