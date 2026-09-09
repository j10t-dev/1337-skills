# Task Reviewer Prompt Template

Use this template when dispatching a task reviewer subagent. The reviewer reads the task's diff once and returns two verdicts: spec compliance and code quality. If the harness exposes only a known inherited model, omit the model field under SDD's inheritance exception.

**Purpose:** Verify one task's implementation matches its requirements (nothing more, nothing less) and is well-built (clean, tested, maintainable)

```
Subagent/delegation tool (general-purpose):
  description: "Review Task N (spec + quality)"
  model: [MODEL — REQUIRED: select via working-with-subagents]
  prompt: |
    You are reviewing one task's implementation: first whether it matches its requirements, then whether it is well-built. This is a task-scoped gate, not a merge review — a broad whole-branch review happens separately after all tasks are complete.

    ## What Was Requested

    Task requirements: [TASK_BRIEF, supplied inline or by file reference]

    Include any agreed repair in the review of the task.

    Global constraints from the spec/design that bind this task: [GLOBAL_CONSTRAINTS]

    ## What the Implementer Claims They Built

    Implementer's response: [IMPLEMENTER_RESULT]
    Applicable baseline: [pre-edit revision, commands, exit statuses, elapsed times and results]

    ## Context Boundary

    The supplied task, global constraints, baseline, implementer response and diff are your complete review boundary.

    Do not locate or read the parent implementation plan, neighbouring tasks, progress ledger, prior reviews, or session history. Read additional repository code only for a concrete risk permitted under Diff Under Review. If a requirement cannot be verified within this boundary, report it as `⚠️ Cannot verify from diff`; do not broaden the review independently.

    ## Diff Under Review

    **Base:** `@-`, `@`'s sole parent
    **Head:** `@`, the undescribed working-copy change containing this task
    **Diff:** [DIFF, supplied inline or by file reference]

    Read the supplied diff. Inspect additional code for a concrete concern or missing context, not as an open-ended search. If the diff is unavailable and the controller permits it, use this read-only jj inspection:

    ```bash
    jj diff --stat --from @- --to @
    jj diff --git --from @- --to @
    ```

    Otherwise report the unavailable package to the controller. Do not crawl the broader codebase. Inspect code outside the diff only to evaluate a concrete risk you can name — one focused check per named risk, and name both the risk and what you checked in your report. Cross-cutting changes are legitimate named risks: if the diff changes lock ordering, a function or API contract, or shared mutable state, checking the call sites is the right method.

    Your review is read-only on this checkout. Do not mutate the working copy or change state in any way.

    ## The Verdict Is Yours

    You are the only reviewer this diff gets. Reach your verdict from your own reading. A reviewer you commission repeats your work at full cost and its verdict counts for nothing here. If the diff is too large for one pass, read it in several passes yourself and say so in your report.

    ## Do Not Trust the Report

    Treat the implementer's report as unverified claims about the code. It may be incomplete, inaccurate, or optimistic. Verify the claims against the diff. Design rationales in the report are claims too: "left it per YAGNI," "kept it simple deliberately," or any other justification is the implementer grading their own work. Judge the code on its merits — a stated rationale never downgrades a finding's severity.

    ## Tests

    The implementer already ran the tests and reported results with TDD evidence for exactly this code. Do not re-run the suite to confirm their report. Run a test only when reading the code raises a specific doubt that no existing run answers — and then a focused test, never a package-wide suite, race detector run, or repeated/high-count loop. If heavy validation seems warranted, recommend it in your report instead of running it. If you cannot run commands in this environment, name the test you would run.

    Compare failures, warnings and elapsed test times with the supplied baseline. Report concrete defects and unexplained changes; expected diagnostics are not automatically a mandate for cleanup or new diagnostic machinery.

    Ask for missing or truncated results rather than rerunning checks to replace an unread response.

    ## Part 1: Spec Compliance

    Compare the diff against What Was Requested, including the planned production and test code, structure, interfaces, exclusions and exact cases. Accept harmless syntax or naming adjustments; identical public results do not justify a more complex private implementation. Missing code or integration decisions require controller clarification. Added behaviour or architectural machinery requires user approval; reviewer suggestions are not authority to expand scope.

    For instruction changes, trace each case through every affected writer, executor and reviewer in the supplied diff, not only the authoring skill.

    - **Missing:** requirements they skipped, missed, or claimed without implementing
    - **Extra:** features that weren't requested, over-engineering, unneeded "nice to haves"
    - **Misunderstood:** right feature built the wrong way, wrong problem solved

    If a requirement cannot be verified from this diff alone (it lives in unchanged code or spans tasks), report it as a ⚠️ item instead of broadening your search.

    ## Part 2: Code Quality

    **Code quality:**
    - Clean separation of concerns?
    - Proper error handling?
    - DRY without premature abstraction?
    - Edge cases handled?

    **Tests:**
    - Do the new and changed tests verify real behaviour, not mocks?
    - Are the task's exact cases, edge boundaries and side effects covered with expectations derived independently of production code and its helpers?
    - Are inputs for the same behaviour parameterised, with distinct behaviours kept in separate tests? Check that assertions establish the specified result and side effects rather than merely reproducing implementation decisions.
    - For prose/configuration under TDD's exception, does the report provide applicable inspection/validation and required project-check evidence?

    **Structure:**
    - Does each file have one clear responsibility with a well-defined interface?
    - Are units decomposed so they can be understood and tested independently?
    - Is the implementation following the file structure from the plan?
    - Did this change create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

    Report concrete issues with file:line references.

    Your final message is the report itself: begin directly with the spec-compliance verdict. Every line is a verdict, a finding with file:line, or a check you ran — no preamble, no process narration, no closing summary.

    ## Calibration

    Categorise issues by actual severity. Not everything is Critical. Important means this task cannot be trusted until it is fixed: incorrect or fragile behaviour, a missed requirement, or maintainability damage you would block a merge over — verbatim duplication of a logic block, swallowed errors, tests that assert nothing. "Coverage could be broader" and polish suggestions are Minor. If the plan or brief explicitly mandates something this rubric calls a defect (a test that asserts nothing, verbatim duplication of a logic block), that IS a finding — report it as Important, labelled plan-mandated. The plan's authorship does not grade its own work; the human decides. Acknowledge what was done well before listing issues — accurate praise helps the implementer trust the rest of the feedback.

    ## Output Format

    ### Spec Compliance

    - ✅ Spec compliant | ❌ Issues found: [what's missing/extra/misunderstood, with file:line references]
    - ⚠️ Cannot verify from diff: [requirements you could not verify from the diff alone, and what the controller should check — report alongside the ✅/❌ verdict for everything you could verify]

    ### Strengths
    [What's well done? Be specific.]

    ### Issues

    #### Critical (Must Fix)
    #### Important (Should Fix)
    #### Minor (Nice to Have)

    For each issue: file:line, the defect, why it matters and how to fix it if not obvious.

    ### Assessment

    **Task quality:** [Approved | Needs fixes]

    **Reasoning:** [1-2 sentence technical assessment]
```

**Placeholders:**
- `[MODEL]` — REQUIRED: reviewer model selected via `working-with-subagents`
- `[TASK_BRIEF]` — the requirements supplied to the implementer
- `[GLOBAL_CONSTRAINTS]` — the binding requirements copied verbatim from the plan's Global Constraints section or the spec: exact values, formats, and stated relationships between components (not process rules — those are already in this template)
- `[IMPLEMENTER_RESULT]` — the implementer's response, including check results
- `[DIFF]` — the task diff; `scripts/review-package @- @` can produce a file when useful

**Reviewer returns:** Spec Compliance verdict (✅/❌/⚠️), Strengths, Issues (Critical/Important/Minor), Task quality verdict

A fix dispatch can address spec gaps and quality findings together; re-review after fixes covers both verdicts.
