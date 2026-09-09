---
name: working-with-subagents
description: Use when delegating to a subagent, selecting a child model, composing a child assignment, or collecting delegated results
---
# Working with Subagents

Delegate independent work when it saves time or adds useful coverage. Keep shared-copy implementers serial; run independent research in parallel.

1. Use models and roles exposed by the harness. Prefer the smallest reliable option; a matching role needs no override.
   - Use the active catalogue and supported reasoning settings.
   - If only a known inherited model is exposed, use inheritance. Astra should only use low thinking.
   - Claude harness should use opus for planning and review, sonnet for impl. 
   - Pi and Codex should use astra for planning and review and gpt5.6 sol/luna as appropriate
2. Use smaller models for lookups and mechanical edits, standard models for implementation, debugging and review, and the strongest for design and high-risk review. Briefly state why.
3. Allow only required tools; enforce writable paths where supported. A prose restriction is not a tool sandbox.
4. Assign scope, writable paths, exclusions, required context and checks. Further delegation requires controller permission. Reports belong in assigned ignored scratch storage.
5. Inspect actual changes and evidence before acceptance. The controller validates the resulting code against approved requirements before delivery.
