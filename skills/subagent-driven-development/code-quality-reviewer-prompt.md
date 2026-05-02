# Code Quality Reviewer Prompt Template

Use this template when dispatching a code quality reviewer subagent.

**Purpose:** Verify implementation is well-built (clean, tested, maintainable)

**Only dispatch after spec compliance review passes.**

```
Subagent/delegation tool (1337-skills:code-reviewer):
  Use template at requesting-code-review/code-reviewer.md

  DESCRIPTION: [task summary / what was implemented]
  PLAN_REFERENCE: Task N from [plan-file]
  JJ_BOUNDARY: @
  FILES_CHANGED: [only if jj boundary is unavailable or misleading]
```

**Code reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment
