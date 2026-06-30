---
name: requesting-pi-review
description: Use when a design or implementation-plan document has been written and needs an independent review before proceeding
---

# Requesting a pi Review

## Overview

Hand a just-written design or plan document to `pi` for an independent,
read-only review in a fresh context, triage its findings, and loop until the
document is approved or the loop bound is reached.

**REQUIRED:** Use the `receiving-code-review` skill to triage every round's
findings — validate each claim against the actual document, never blind-apply.

## The Loop

1. **Run the wrapper.** It is not on `PATH`. Invoke it by its absolute
   skill-relative path: canonical location
   `~/.agents/1337-skills/skills/requesting-pi-review/pi-review` (the Claude
   and pi skill symlinks both resolve here).

   ```
   ~/.agents/1337-skills/skills/requesting-pi-review/pi-review design <doc>
   ~/.agents/1337-skills/skills/requesting-pi-review/pi-review plan <doc> <design-ref>
   ```

   `design-ref` (the design doc the plan must align with) is **required**
   for `plan` reviews and rejected for `design` reviews — a plan review
   always checks the plan against its design.

   Defaults: pi's configured model, effort `high`. Override with `--model` /
   `--effort`, or `PI_REVIEW_MODEL` / `PI_REVIEW_EFFORT`.

   The reviewer runs with `--no-session --no-context-files --no-extensions
   --no-skills`: no saved session, and no project AGENTS.md/CLAUDE.md,
   extensions, or skills loaded — only the prompt template and the
   document(s) passed in shape its judgement.

2. **Load `receiving-code-review` and triage.** Check every finding against
   the actual document. Fix legitimate ones. Reject misreads with a one-line
   reason. Treat the prompt's "Recommendations (advisory)" as non-blocking —
   never a reason to keep looping.

3. **Re-run the wrapper** on the revised document.

4. **Stop when:**
   - pi returns `Status: Approved`, or
   - 3 rounds have run (the initial review is round 1, so at most 2
     revise-and-recheck passes follow it), or
   - the review has converged — every remaining finding is one already
     assessed and deliberately not actioned.

5. **Report:** rounds run, fixes applied (with a diff summary), findings
   rejected and why, final pi status. If issues remain at the cap, say so
   plainly — no false "done".

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Blind-applying pi's findings | Triage under `receiving-code-review` every round |
| Looping past convergence | Stop once remaining findings are already-assessed repeats |
| Treating advisory recommendations as blocking | Only "Issues Found" entries gate approval |
