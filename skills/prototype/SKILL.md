---
name: prototype
description: Build a throwaway prototype to answer one design question.
disable-model-invocation: true
---

# Prototype

A prototype is **throwaway code that answers one question**. The question decides the shape.

Manual invocation is explicit permission to treat the resulting code as throwaway: keep it outside production history, omit production hardening, and use it only to settle the stated question.

## Pick a branch

Identify the question from the user's prompt and surrounding code. Ask if it remains ambiguous:

- **"Does this logic or state model feel right?"** Read [LOGIC.md](LOGIC.md). Build a single shareable HTML file with free-play buttons and tabbed guided walkthroughs. It pushes the model through cases that are hard to reason about on paper and lets a non-developer drive it.
- **"What should this look like?"** Read [UI.md](UI.md). Generate several radically different UI variations on one route, switchable through a URL search parameter and a floating bottom bar.

The branches produce different artefacts. Settle the branch before writing code.

## Rules for both branches

1. **Mark it as throwaway from day one.** Locate the prototype close to where it would be used so the context is clear, but name it as a prototype. Follow the project's existing routing convention for temporary UI routes.
2. **Make it trivial to run.** A UI prototype starts with one command in the project's task runner, such as `bun run <name>` or `uv run python <path>`. A logic demo is a single HTML file the user can open directly.
3. **Keep state in memory by default.** Add persistence only when persistence is the question. Use a scratch database or clearly named local file in that case.
4. **Optimise for learning.** Write only the error handling needed to run it. Avoid production abstractions and tests. Manual invocation supplies the explicit throwaway-prototype exception required by the test-driven-development workflow.
5. **Surface the state.** After every logic action or UI variant switch, render the full relevant state so the user can see what changed.
6. **Let the user choose.** Present the runnable artefact and wait for the user's verdict. Never select a UI variant or decide that a logic model is correct on the user's behalf.
7. **Capture only with authority.** Fold a validated decision into production code through the normal development workflow. Preserve the prototype as a primary source only after explicit VCS instruction. In a jj repository, keep it on a separate `prototype/<name>` bookmark based on the main line and leave a context pointer in the implementation issue. Never merge the prototype change into the main line.
