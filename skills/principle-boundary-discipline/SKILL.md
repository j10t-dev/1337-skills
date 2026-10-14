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
- **Inside the system:** typed data, error propagation, no re-validation. Trust the types. Trust covers one-line "just in case" guards too: when the port type guarantees a fact, core branches on it. A known value keeps its type: never widen it to `unknown`, `object` or a generic record to suit a downstream implementation, except inside a private store behind a typed API, under the cast protocol in `principle-type-system-discipline`. Parameters and returns state what a function actually accepts and produces. Use the library's or domain's own type, never a local hand-written approximation of it.
- **Across the boundary.** Expose domain concepts, not the boundary's private representation. Keep general-purpose mechanism inside and special-purpose policy at the edge. The adapter keeps its decoder private and exposes a domain-named parser over the input type callers actually hold: `unknown` for an untyped body or row, the encoded type only when a runtime step established it, such as a `string` read from a file or a value an API returned with a type the caller did not supply as a type argument. A parsed JSON body or a database row is `unknown` however it is annotated.

**Provenance decides validation.** Choose the handling from where the value came from:

| Origin | Handling |
| --- | --- |
| Unknown external or persisted input, including raw database rows, native storage and untyped bodies | Decode from unknown with the owning boundary schema into the strongest meaningful type. A query's type argument and a declaration file are claims, not runtime evidence. |
| An encoded representation whose type a runtime step established, such as text read from a file or a value an API returned with a type the caller did not supply as a type argument | Decode with a typed decoder whose input is exactly that encoded type. A value whose type is only annotated, such as a parsed JSON body or a database row, belongs in the row above. |
| An established domain or application value | Pass it on unchanged, never re-parsed or round-tripped through an encoding. |
| A newly computed constrained value or patched state | Build it through its owning constructor, refinement or schema transformation. |

A type guarantees its encoded properties, not mutable external facts. Guard live authorisation, resource state and destructive-operation destinations at the point of effect when they can change after parsing. Each independent external entry must construct the validated domain type.

**Applications:**

Validation and error handling:
- Validate config at parse time (the boundary), not inside business logic
- Merge configuration sources (file, environment) first, then parse each capability's subset once, through a schema that carries its defaults
- Parse raw data into domain types at the boundary
- A chain of `typeof` or generic object checks proves only incidental representation facts; parse the contract with its schema or owning parser
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

**Review blockers:** a breach of the widening, approximation or generic-check rules above, and:
- A chained `as unknown as` or `as any as`, outside a cast that follows the protocol in `principle-type-system-discipline`
- An assertion right after an explicit widening
- Repeated parsing or narrowing of a value that already crossed its boundary
- An internal function returning `unknown` without a new external boundary

**The tests:**
- "Is this data crossing a system boundary, or does this operation depend on a live fact that could have changed?" Place the check there; do not repeat checks for properties the domain type already guarantees.
- "Can this be a pure function that the shell just calls?" If yes, extract it.
