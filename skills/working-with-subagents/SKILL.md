---
name: working-with-subagents
description: Use when delegating to a subagent, selecting a child model, composing a child assignment, or collecting delegated results
---
# Working with Subagents

1. Inspect models and roles exposed by the active harness. Trust the harness and delegation tool for availability, resolution, validation, and inheritance. Choose the smallest reliable option; a matching role needs no override.
   - OpenAI (most to least capable): gpt-5.6-sol > gpt-5.6-terra > gpt-5.6-luna
   - Anthropic (most to least capable): fable > opus > sonnet. Fable is for complicated or very important reviews; treat opus as standard.
   - Set thinking level explicitly: luna on non-trivial implementation uses max; sol and terra use high for review and design; medium for complex implementation.
   - pi has only openai, claude only anthropic
2. Match capability to work: smallest for bounded lookups and fully specified mechanical tasks; standard for synthesis, multi-step work, debugging, and review; most capable for architecture, ambiguity, and high-risk judgement. State the selection reason as task fit, plus why a cheaper option's retry and extra-turn risk outweighs its token saving. When you picked the cheapest available option, say so instead: retry comparison does not apply.
3. Allow only required tools.
4. Brief the child with the objective, relevant context, constraints, expected output, and verification criteria.
5. Collect and inspect the result before using it.
