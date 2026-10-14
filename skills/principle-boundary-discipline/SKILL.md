---
name: principle-boundary-discipline
description: "Use when changing or reviewing parsing, validation, error handling at system boundaries, or external adapters."
user-invocable: false
---

# Boundary Discipline

Place validation, type narrowing, and error handling at system boundaries. Trust validated domain types inside the system. Business logic lives in pure functions; the shell is thin and mechanical.

**Why:** Scattered validation is noisy, redundant, and gives a false sense of safety. Validate data once at the boundary. Keep logic out of framework wiring so it can be tested without the framework.

**The pattern:**
- **At boundaries** (CLI args, config files, external APIs, network protocols): validate, return errors, handle defensively.
- **Inside the system:** typed data, error propagation, no re-validation. Trust the types. Trust covers one-line "just in case" guards too: when the port type guarantees a fact, core branches on it.
- **Across the boundary.** Expose domain concepts, not the boundary's private representation. Keep general-purpose mechanism inside and special-purpose policy at the edge.

A type guarantees its encoded properties, not mutable external facts. Guard live authorisation, resource state and destructive-operation destinations at the point of effect when they can change after parsing. Each independent external entry must construct the validated domain type.

**Applications:**

Validation and error handling:
- Validate config at parse time (the boundary), not inside business logic
- Merge configuration sources (file, environment) first, then parse each capability's subset once, through a schema that carries its defaults
- Parse raw data into domain types at the boundary
- Parse one structure in one pass by composing its nested schemas
- A safeguard that only gates a capability runs inside the opener that returns the capability (`openWriter(identity)`); core never reads the binding state behind it
- Do not re-export transport, storage, framework, or wire types through the public surface
- No redundant nil checks deep in call chains if the boundary already validated
- Stored local data is a boundary: parse it where it is read, and report corrupt data there as a local failure

Code organisation:
- Business logic in pure functions with no framework dependencies
- Parse functions: pure transforms from raw bytes to typed state
- Prompt construction: structured state in, string out
- Scoring and assessment: pure transforms from state to results

**The tests:**
- "Is this data crossing a system boundary, or does this operation depend on a live fact that could have changed?" Place the check there; do not repeat checks for properties the domain type already guarantees.
- "Can this be a pure function that the shell just calls?" If yes, extract it.
