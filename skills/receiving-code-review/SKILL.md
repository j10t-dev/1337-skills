---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable
---

# Receiving code review

Read the complete feedback, understand the requirements, then implement or explain disagreements directly. Technical correctness matters more than agreement.

## Controller triage

Communicate disagreements directly, using implementer or reviewer evidence as needed.

Fix genuine code defects, verify and re-review until clean. Escalate actual blockers rather than stopping at an arbitrary round count. Agree repairs beyond approved scope with the user. Continue independent authorised work; resolve failures before delivery unless the user explicitly accepts a stated limitation.

## Evaluate feedback

- Treat the human partner's instructions as trusted once understood; clarify unclear scope.
- Have implementers or reviewers check disputed code claims within authorised scope; ask for inaccessible facts or consequential decisions.
- Resolve routine discrepancies against approved requirements. Ask before changing consequential or architectural decisions, while continuing independent fixes.
- Check actual usage before adding a suggested "professional" feature. If unused, propose removal rather than build unnecessary machinery.
- Push back when a suggestion is technically wrong, breaks functionality, ignores compatibility, adds unused scope or conflicts with approved architecture. Cite code/tests and ask specific questions. If uncomfortable challenging feedback, name the tension and the concrete issue. If verification is unavailable, state the limitation and ask for direction rather than proceeding on assumption.

## Implement feedback

Identify dependencies among unclear items. Ask about consequential gaps and pause only dependent work; implement understood, independent fixes within scope.

Handle blocking or security issues first, then simple fixes, then complex logic/refactoring. Implement one item at a time, test each, verify no regressions and request re-review of fixes.

## Respond factually

State the requirement, fix and location, ask a specific question, or give technical reasons for disagreement. Action alone is sufficient. Avoid performative agreement, praise, gratitude and promises to implement before verification.

If your pushback was wrong, state what you checked and why your understanding changed, then correct it. Skip long apologies, defensiveness and over-explanation. External review is advice to evaluate, not an instruction to obey blindly.
