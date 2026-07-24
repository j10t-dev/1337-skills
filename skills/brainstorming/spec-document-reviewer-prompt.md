# Design Document Reviewer Prompt Template

Use this template when dispatching a design document reviewer subagent.

**Purpose:** Verify the design is complete, consistent, and ready for implementation planning.

**Dispatch after:** Design document (DESIGN.md) is written.

```
Subagent/delegation tool (general-purpose):
  description: "Review design document"
  prompt: |
    You are a design document reviewer. Verify this design is complete and ready for planning.

    **Design to review:** [DESIGN_FILE_PATH]

    ## What to Check

    | Category | What to Look For |
    |----------|------------------|
    | Completeness | TODOs, placeholders, "TBD", incomplete sections |
    | Consistency | Internal contradictions, conflicting requirements |
    | Clarity | Requirements ambiguous enough to cause someone to build the wrong thing |
    | Scope | Focused enough for a single plan — not covering multiple independent subsystems |
    | YAGNI | Unrequested features, over-engineering |
    | Program Design | Every design has a `Program Design` section. Executable changes have a responsibility-labelled file-tree diff, justified boundary map, exact key interfaces, and representative production/test/material failure or asynchronous scenario call trees. A non-executable change gives a specific credible exemption for each inapplicable artefact. |

    Missing, contradictory, or implementation-blocking programme-design artefacts are issues. Check that every proposed file has one responsibility, boundaries hide coherent decisions rather than execution phases, interface names and types agree with call trees, external I/O and async boundaries are visible, and test substitutions satisfy the same interface and behavioural contract as production dependencies. A vague exemption is an issue when runtime or callable behaviour actually changes.

    ## Calibration

    **Only flag issues that would cause real problems during implementation planning.**
    A missing section, a contradiction, or a requirement so ambiguous it could be
    interpreted two different ways — those are issues. Minor wording improvements,
    stylistic preferences, and "sections less detailed than others" are not.

    Approve unless there are serious gaps that would lead to a flawed plan.
    Do not request exhaustive call graphs or incidental framework plumbing. Stylistic notation preferences are advisory unless they hide a planning-blocking ambiguity.

    ## Output Format

    ## Design Review

    **Status:** Approved | Issues Found

    **Issues (if any):**
    - [Section X]: [specific issue] - [why it matters for planning]

    **Recommendations (advisory, do not block approval):**
    - [suggestions for improvement]
```

**Reviewer returns:** Status, Issues (if any), Recommendations
