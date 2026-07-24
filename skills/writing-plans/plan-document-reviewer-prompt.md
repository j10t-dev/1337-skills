# Plan Document Reviewer Prompt Template

Use this template when dispatching a plan document reviewer subagent.

**Purpose:** Verify the plan is complete, matches the design, and has proper task decomposition.

**Dispatch after:** The complete plan is written.

```
Subagent/delegation tool (general-purpose):
  description: "Review plan document"
  prompt: |
    You are a plan document reviewer. Verify this plan is complete and ready for implementation.

    **Plan to review:** [PLAN_FILE_PATH]
    **Design doc for reference:** [DESIGN_FILE_PATH]

    ## What to Check

    | Category | What to Look For |
    |----------|------------------|
    | Completeness | TODOs, placeholders, incomplete tasks, missing steps |
    | Design Alignment | Plan covers design requirements, no major scope creep |
    | Task Decomposition | Tasks have clear boundaries, steps are actionable |
    | Buildability | Could an engineer follow this plan without getting stuck? |
    | Linear Position | Exactly one `Builds On` resolving to one existing local bookmark target and exactly one distinct semantic `Feature Bookmark` absent at fresh-run start; a dependent design names its preceding feature bookmark |
    | Commit Subjects | Every task has exactly one conventional subject describing delivered behaviour, with no task number, plan slug, or run metadata |
    | Program Design Conformance | Planned file layout, responsibilities, public interfaces, consequential seams, and scenario call paths match the approved design; material conflicts explicitly return to design revision |
    | Vertical Increments | Every normal task delivers one observable behaviour across every affected layer needed for that behaviour, rather than completing a technical layer or deferring tests/integration |
    | Integrated Verification | Every task ends with an exact check of its observable integrated outcome, not only unit or component checks |
    | Foundation Exceptions | A foundation-only task explains why no vertical slice is practical, proves an independently verifiable state, and names the later behaviour that consumes it |
    | Task/Commit Coherence | Each task is one coherent reviewable unit normally suitable for one commit; unrelated behaviours are not bundled |

    A silent redesign or horizontal layer batch is a blocking issue. Also block a task that lacks an observable integrated outcome, an unjustified foundation-only task, or unsafe parallelism across shared files, interfaces, migrations, or state transitions.

    ## Calibration

    **Only flag issues that would cause real problems during implementation.**
    An implementer building the wrong thing or getting stuck is an issue.
    Minor wording, stylistic preferences, and "nice to have" suggestions are not.

    Approve unless there are serious gaps — missing requirements from the design,
    contradictory steps, placeholder content, or tasks so vague they can't be acted on.
    Return Issues Found for missing, duplicate, malformed, ambiguous, or unresolved `Builds On` values. Return Issues Found for missing, duplicate, malformed, or pre-existing `Feature Bookmark` values. Return Issues Found for guessed or unsuitable commit-subject values.
    Do not require UI-to-database breadth when the affected system has fewer layers, and do not reject private implementation details that preserve approved boundaries and behaviour.

    ## Output Format

    ## Plan Review

    **Status:** Approved | Issues Found

    **Issues (if any):**
    - [Task X, Step Y]: [specific issue] - [why it matters for implementation]

    **Recommendations (advisory, do not block approval):**
    - [suggestions for improvement]
```

**Reviewer returns:** Status, Issues (if any), Recommendations
