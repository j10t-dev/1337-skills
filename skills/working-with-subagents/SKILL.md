---
name: working-with-subagents
description: Use when delegating to a subagent, selecting a child model, composing a child assignment, or collecting delegated results
---

# Working with Subagents

1. Inspect the models and preconfigured roles exposed to you by the active harness. Choose the smallest option that can reliably complete the task; a matching preconfigured role satisfies selection without a separate model override. Trust the harness and delegation tool for availability, resolution, validation, and inheritance.
   - OpenAI (most to least capable): gpt-5.6-sol > gpt-5.6-terra > gpt-5.6-luna
   - Anthropic (most to least capable): fable > opus > sonnet. Fable is only needed for complicated / very important reviews, consider opus the 'standard'.
   - Consider thinking level. Mechanical changes do not need 'high' reasoning, reviewers and designers need medium or high. Don't use xhigh or above.
2. Match capability to work: smallest for bounded lookups and fully specified mechanical tasks; standard for synthesis, multi-step work, debugging, and review; most capable for architecture, ambiguity, and high-risk judgement. The selection reason must state task fit and, when a cheaper choice exists, why its retry or extra-turn risk outweighs token savings; for the cheapest available choice, explicitly state that no cheaper option exists, so retry comparison is not applicable.
3. Allow only required tools.
4. Brief the child with the objective, relevant context, constraints, expected output, and verification criteria.
5. Collect and inspect the result before using it.
