---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable
---

# Receiving code review

Read the complete feedback, understand the requirements, verify against the codebase, then implement or push back with evidence. Technical correctness matters more than agreement.

## Controller triage

At any round, resolve a factually false finding with a durable ruling containing the original finding, evidence, reason and cost if wrong. Retain both finding and ruling for independent final review. Rejection requires no fix or replacement passing verdict and consumes no fix round. Scoped implementers supply evidence; the controller owns disposition.

Genuine Critical/Important defects need fixes, verification and re-review. After three fix rounds, escalate remaining genuine defects to the user; controller-only deferral cannot permit acceptance. Record explicit user exceptions. Track Minor findings for final triage. Apparently unrelated failures belong in controller-managed repair work, not silent scope expansion. Continue independent authorised work; resolve recorded failures before delivery unless the user changes that requirement.

## Evaluate feedback

- Treat the human partner's instructions as trusted once understood; clarify unclear scope.
- Check external reviewers' claims against current functionality, reasons for the implementation, platform/version compatibility and the reviewer's context. Investigate within authorised scope; ask for inaccessible facts or consequential decisions.
- Resolve routine discrepancies against approved requirements. Ask before changing consequential or architectural decisions, while continuing independent fixes.
- Check actual usage before adding a suggested "professional" feature. If unused, propose removal rather than build unnecessary machinery.
- Push back when a suggestion is technically wrong, breaks functionality, ignores compatibility, adds unused scope or conflicts with approved architecture. Cite code/tests and ask specific questions. If uncomfortable challenging feedback, name the tension and the concrete issue. If verification is unavailable, state the limitation and ask for direction rather than proceeding on assumption.

## Implement feedback

Identify dependencies among unclear items. Ask about consequential gaps and pause only dependent work; implement understood, independent fixes within scope.

Handle blocking or security issues first, then simple fixes, then complex logic/refactoring. Implement one item at a time, test each, verify no regressions and request re-review of fixes, including the mandatory Critical/Important gate above.

## Respond factually

State the requirement, fix and location, ask a specific question, or give technical reasons for disagreement. Action alone is sufficient. Avoid performative agreement, praise, gratitude and promises to implement before verification.

If your pushback was wrong, state what you checked and why your understanding changed, then correct it. Skip long apologies, defensiveness and over-explanation. External review is advice to evaluate, not an instruction to obey blindly.
