---
name: typescript-best-practices
description: Use when implementing or changing TypeScript code, designing TypeScript types or APIs, or reviewing TypeScript code changes. Read-only investigation alone does not trigger this skill.
---

# TypeScript best practices

When changing or reviewing domain models, type contracts or type-related correctness, invoke `principle-type-system-discipline`. Routine TypeScript edits use the conventions here without loading unrelated skills.

When writing, changing or reviewing TypeScript, invoke `principle-reader-first-code`.

| Rule | Summary |
|------|---------|
| Discriminated unions | Model variants with a `kind` literal discriminant so impossible states can't be represented. No optional-field bags. |
| Branded types | Brand primitives with `& { readonly __brand: "X" }` so they can't be mixed up. Validate once at creation. |
| Constructive modelling | Build the shape so the illegal value can't be constructed. `[T, ...T[]]` for non-empty, `[T, T][]` for even length, `start` plus `duration` for a range. Not a runtime guard, not a wish for refinement types. |
| Simplest total type | Keep `T[]` while every operation on it stays total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | External data is `unknown`. `any` disables type checking everywhere it touches. |
| No `as` casts | Every `as` is a runtime crash waiting. Cast only after validation. |
| Narrowing hierarchy | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > `as`. |
| Type guards | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`. |
| Exhaustiveness | A `case` per variant, no `default`; lint-enforced, with fallbacks in `references/patterns.md`. |
| `satisfies` over `as` | Validates the value without widening literal types. |
| Boundary validation | Parse where data crosses in, into a named domain type. `Record<string, unknown>` (however spelled) stops at that parse. Trust types inside. Invoke `principle-boundary-discipline` when changing boundary parsing, validation or external adapters. |
| Schema-derived types | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface. |
| Object args | Pass objects, not positional, so argument order is self-documenting. Skip on hot paths (per-frame render, tokenisers, parsers). |
| Real tests | Don't mock what you can run. Prefer the framework's real test primitives with leak/disposable checks, and verify UI in a running build. Mock only what you can't run locally. |
| Structured telemetry | Prefer structured logger diagnostics with enough context to debug from an id. No `console.log` in shipped code. |
| Result library | In a codebase that has adopted an established Result library, expected failures are values from it: `Result.gen` with `yield*` for fail-fast sequences, combinators for short transforms, `Result.try` at throwing APIs, one bridge from another library's result shape such as Zod `safeParse`. Prefer an API option that doesn't throw over catching (`lstatSync(path, { throwIfNoEntry: false })`). Visible branches only for policy (record and continue, accumulate, recover, roll back). Inside a database transaction, a failure that must roll back is thrown, since only a throw rolls back, and becomes a Result outside the transaction. |
| Return annotations | Every function and callback declares its return type, so the reader sees what it produces. |
| Yes/no predicates | `shouldX(): boolean` in place of a two-literal union compared with `===`. The rule and its exceptions live in `principle-reader-first-code`. |
| Closed sets | An `as const` array or object with a derived type, in place of `enum`. Values from JSON, SQL and argv are used as they arrive. |
| Collections | Array methods (`filter`, `map`, `find`, `some`, `reduce`) build, filter, project, search and aggregate: `filter` then `map`, and `flatMap` only when one input yields several outputs; no lazy `values().filter().map().toArray()` chains. Explicit loops for awaited I/O, transactions, early-exit parsing, pagination, stateful grouping and linked traversal. Eager passes are fine at ordinary sizes. When `find` replaces a loop, the first match still decides. |
| Branch choice | `switch` for multi-state unions, and slightly preferred for other two-state unions; `if` for null checks and ok/err guards. |
| Guard runs | In a `Result.gen`, a run of "condition, else fail" guards is `yield* require(condition, failure)` lines over named predicates. Real decisions stay `if`. |
| Single-method ports | A port with one method and one implementation is a function type, not an interface wrapping that method. Multi-method ports stay interfaces. |
| Generic cost | Generic machinery earns its cost: avoid four or more nested generic layers, drop a type parameter every implementer erases with overloads, and spell a union out in place of a distributive conditional type; replace per-variant overloads with one generic signature over a variant-keyed record of parsers, so per-variant code becomes a loop. Generic pass-through wrappers wait for a second caller; branded types and `[Symbol.dispose]` are fine. |
| One meaning per value | A `null` carries one meaning. A constant field is typed as its literal (`version: 1`). |
| `async` | Prefer marking every Promise-returning function `async`. |

When creating or changing lint, format, compiler or CI settings, read `references/tooling-baseline.md`.

Examples: `references/patterns.md`.
