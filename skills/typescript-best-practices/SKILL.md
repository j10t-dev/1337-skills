---
name: typescript-best-practices
description: Use when implementing or changing TypeScript code, designing TypeScript types or APIs, or reviewing TypeScript code changes. Read-only investigation alone does not trigger this skill.
---

# TypeScript best practices

When changing or reviewing domain models, type contracts or type-related correctness, invoke `principle-type-system-discipline`. Routine TypeScript edits use the conventions here without loading unrelated skills.

When writing, changing or reviewing TypeScript, invoke `principle-reader-first-code`.

Before writing Effect code, read `node_modules/effect/AGENTS.md` completely and follow its links when needed; search `node_modules/effect/src` for anything it doesn't cover. Two rules here override that guide: no catch-all `Effect.catch`, and `bun:test` in place of `@effect/vitest`.

| Rule | Summary |
|------|---------|
| Library choice | A new codebase (being created, or with no production TypeScript yet) starts on Effect: install `effect` first. Any other codebase keeps its established approach, whether another library or plain Promises and throws, and follows its own AGENTS.md; where it differs from the rows below, it wins. |
| Discriminated unions | Model variants with a `_tag` literal discriminant, matching `Schema.TaggedError`, `Schema.TaggedStruct` and `catchTags`, so impossible states can't be represented. No optional-field bags. |
| Branded types | `Schema.brand("X")` on the base schema; the branded value is created by decoding, never by `as`. |
| Constructive modelling | Build the shape so the illegal value can't be constructed. `Array.NonEmptyReadonlyArray<T>` for non-empty, `[T, T][]` for even length, `start` plus `duration` for a range. Not a runtime guard, not a wish for refinement types. |
| Simplest total type | Keep `T[]` while every operation on it stays total. Strengthen to `Array.NonEmptyReadonlyArray<T>`, or return an `Option`, only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | External data is `unknown`. `any` disables type checking everywhere it touches. |
| No `as` casts | A type assertion parses nothing. Cast only where TypeScript cannot express an invariant already established at runtime, following the protocol in `principle-type-system-discipline`. Examples: No `as` casts in `references/patterns.md`. |
| Narrowing hierarchy | `_tag` switch > `in` operator > `Predicate` helpers, `instanceof` > user-defined type guard > `as`. |
| Type guards | Domain guards verify their claim and are named `isX` or `hasX` (yes/no predicates follow their own row). Primitive and structural checks come from `Predicate` (`isString`, `isObject`, `hasProperty`). |
| Exhaustiveness | A `case` per variant, no `default`; lint-enforced, with fallbacks in `references/patterns.md`. An error channel handled with `catchTags` keeps an unhandled tag in its type, so a new failure is a type error. |
| `satisfies` over `as` | Validates the value without widening literal types. |
| Boundary validation | Parse where data crosses in with `Schema`, into a named domain type; keep the decoder private to the adapter and export a domain-named parser over the input type callers hold. Invoke `principle-boundary-discipline` when changing boundary parsing, validation or external adapters. |
| Schema-derived types | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface. |
| Object args | Pass objects, not positional, so argument order is self-documenting. Skip on hot paths (per-frame render, tokenisers, parsers). |
| Real tests | Don't mock what you can run. Prefer the framework's real test primitives with leak/disposable checks, and verify UI in a running build. Mock only what you can't run locally. |
| Structured telemetry | Prefer structured logger diagnostics with enough context to debug from an id. No `console.log` in shipped code. |
| Workflows | `Effect.gen`, or a generator-based `Effect.fn` for reusable functions, for dependency retrieval, sequential steps, branches, loops and early returns; `.pipe` for error translation, retry, timeout, tracing, logging, dependency provision and one pure transform. Several dependent `map`/`flatMap`/`andThen` steps become a generator; a generator never replaces one clear transform. A `.pipe` inside a generator that starts coordinating effects or branching moves into the generator. Examples: Workflows in `references/patterns.md`. |
| Errors | Expected failures are `Schema.TaggedError` classes carrying typed context: the operation's identifiers, and a classified reason where the cause changes the next step. `catchTags` names every known tag, an already-correct error passes through unchanged, and nothing catches all; `mapError` only when the whole channel has one meaning. Examples: Errors in `references/patterns.md`. |
| Throwing APIs | Wrap each throwing call on its own with `Effect.try` or `Effect.tryPromise` into a tagged error. Prefer an API option that doesn't throw (`lstatSync(path, { throwIfNoEntry: false })`). Visible branches only for policy: record and continue, accumulate, recover. |
| Optional values | `Option` for every optional field, parameter and return inside the app, including lookups that may miss (`Array.findFirst`). Nullable or optional external input becomes `Option` at the boundary and is encoded back only where an external contract needs it. |
| Services | A capability is a `Context.Service` with its shape written inline, even for one method, and its Layer as a static member (`Database.layer`). Where the shape's type is needed by name, it is `Database["Service"]`. Several implementations are named for what differs (`Database.layerSqlite`, `Database.layerInMemory`). Code yields the services it needs; the composition root provides them with Layers. A service never arrives as a plain argument. Examples: Services in `references/patterns.md`. |
| Imports | Stable Effect modules from the `"effect"` root in one declaration; unstable modules from their narrow public entrypoint. The same form in source and tests. |
| Return annotations | Every function and callback declares its return type, so the reader sees what it produces: generator functions declare `Effect.fn.Return<A, E, R>`, and inline callbacks passed to `map`, `catchTags` and their kin declare theirs. Code you write or refactor gains every annotation it lacks: where a type is not in view, write the closest one the code in view supports rather than leaving it off or asking for it. |
| Yes/no predicates | `shouldX(): boolean` in place of a two-literal union compared with `===`. The rule and its exceptions live in `principle-reader-first-code`. |
| Closed sets | An `as const` array or object with a derived type, and `Schema.Literals` over the same constant for decoding, in place of `enum`. |
| Collections | Array methods (`filter`, `map`, `find`, `some`, `reduce`) build, filter, project, search and aggregate: `filter` then `map`, and `flatMap` only when one input yields several outputs; no lazy `values().filter().map().toArray()` chains. Explicit loops for awaited I/O, transactions, early-exit parsing, pagination, stateful grouping and linked traversal. Eager passes are fine at ordinary sizes. When `find` replaces a loop, the first match still decides. A lookup that may miss returns `Option` (`Array.findFirst`). |
| Branch choice | `switch` for multi-state unions, slightly preferred for other two-state unions; `if` for `Option` and tagged-outcome guards. |
| Guard runs | In a generator, a run of "condition, else fail" guards is `yield* require(condition, failure)` lines over named predicates, failing with tagged errors. Real decisions stay `if`. |
| Generic cost | Generic machinery earns its cost: avoid four or more nested generic layers, drop a type parameter every implementer erases with overloads, and spell a union out in place of a distributive conditional type; replace per-variant overloads with one generic signature over a variant-keyed record of parsers, so per-variant code becomes a loop. Generic pass-through wrappers wait for a second caller; branded types and `[Symbol.dispose]` are fine. |
| One meaning per value | `Option` in place of `null` inside the app. A constant field is typed as its literal (`version: 1`). |
| `async` | Prefer marking every Promise-returning function `async`, where Promises remain at the edges. |

When creating or changing lint, format, compiler or CI settings, read `references/tooling-baseline.md`.

Examples: `references/patterns.md`.
