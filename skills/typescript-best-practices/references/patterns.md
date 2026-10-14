# TypeScript patterns

Code examples for each rule in `SKILL.md`. The underlying principles are language-agnostic; invoke the `principle-type-system-discipline` and `principle-boundary-discipline` skills.

## Branded types

Brand primitives so they can't be mixed up. Validate once at creation; downstream code trusts the type.

```ts
import { Result } from "better-result";

type AgentId = string & { readonly __brand: "AgentId" };

function parseAgentId(input: string): Result<AgentId, string> {
  if (!isUUID(input)) {
    return Result.err(`Invalid agent id: ${input}`);
  }
  return Result.ok(input as AgentId);
}

function focusAgent(id: AgentId): void {
  /* input is trusted */
}
```

Match the `readonly __brand: 'X'` shape; don't invent a new convention.

## Discriminated unions

If a bug forces the question "wait, can this combination actually happen?", the type is too loose. Model variants with a literal discriminant: every variant shares the field name and each variant's value is unique, so impossible combos can't be represented.

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

Pick one discriminant name (`kind`, `type`, `tag`) and stick to it.

## Constructive modelling

Build the type from parts that are all legal instead of restricting a loose type with runtime checks. Adding is easier than subtracting.

Non-empty, via a variadic tuple:

```ts
type NonEmpty<T> = [T, ...T[]];

// Don't: T[] plus a length check every caller must repeat
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// Do: an empty value of the type can't exist
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

Where a plain `T[]` arrives, narrow once with a guard. The fact then travels in the type:

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

Even length, as pairs. TypeScript has no refinement types (no `arr.length % 2 === 0` at the type level); you don't need one:

```ts
type Pairs<T> = [T, T][];
```

A time range, as start plus duration:

```ts
// Don't: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

Keep `durationMs` a plain number. Brand it (per Branded types) only if a raw number could be passed where a duration is expected, not by reflex. A `Pairs<T>` is an even-length list under the interpretation you give it, the same way `{ start, durationMs }` is a range. Pick the representation that makes the bad state unconstructable, then expose the reading you need on top (`pairs.flat()`, a `rangeEnd()` helper).

## Simplest total type

Don't strengthen everything. Keep `T[]` when every operation on it is total:

```ts
const sum = (xs: number[]): number => xs.reduce((a, b): number => a + b, 0); // [] is 0, fine
```

Strengthen when the loose type forces a lie at a use site. The tells are `!`, `arr[0] as T`, and a "should never happen" throw:

```ts
// Don't: partiality smuggled past the compiler
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

Weakening the result to `Session | undefined` is the other total signature. Either way the empty case lands at the call site, the one place that knows what empty means.

## `unknown` over `any`

`any` disables type checking for everything it touches. External data is always `unknown`. Narrow before use.

```ts
// Don't
function handle(input: any): void {
  consume(input.foo.bar);
}

// Do
function handle(input: unknown): void {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // narrowed; compiler verifies access
  }
}
```

External sources include RPC payloads, `JSON.parse`, `postMessage`, IPC, file contents, environment variables, database results.

## No `as` casts

Every `as` is a potential runtime crash. Cast only after the type system has verified the claim.

```ts
// Don't
const user = data as User;

// Do. Earn the cast at the boundary.
function parseUser(data: unknown): Result<User, string> {
  if (typeof data !== "object" || data === null) {
    return Result.err("expected object");
  }
  if (!("id" in data) || typeof (data as Record<string, unknown>).id !== "string") {
    return Result.err("expected id");
  }
  // ... validate all fields
  return Result.ok(data as User); // OK, earned cast after full validation
}
```

When refactoring an `as` out of existing code, identify why TypeScript can't infer:

- Missing discriminant: add one, switch to a discriminated union.
- Overly wide source type (e.g. `Record<string, unknown>`): narrow it.
- Untyped boundary: add a parse function or schema.
- Genuinely inexpressible: use a branded type or `satisfies`.

## Narrowing hierarchy

From best to last-resort:

1. **Discriminated union switch / if.** Compiler narrows automatically.
2. **`in` operator.** `"key" in obj` narrows to variants containing that key.
3. **`typeof` / `instanceof`.** For primitives and class instances.
4. **User-defined type guard.** When the above aren't enough.
5. **`as` cast.** Only after validation.

```ts
function area(s: Shape): number {
  if ("radius" in s) {
    return Math.PI * s.radius ** 2; // narrowed to circle
  }
  return s.width * s.height; // narrowed to rect
}
```

## Type guards

A guard must actually verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe.

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

Prefer discriminant narrowing when possible. The guard adds a layer the reader has to follow.

## Exhaustiveness

In default arms, assign the discriminant to a `never`-typed local. The compiler errors if a new variant is added without handling.

```ts
// Value-returning switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// Void switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

Return-style in value-returning switches; void-style in statement switches.

## `satisfies` over `as`

`satisfies` validates without widening literal types.

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates AND preserves literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme is "dark" (literal), not string
```

## Boundary validation

Validate once where data crosses in; trust types inside. Invoke the `principle-boundary-discipline` skill.

- **Wire formats** (proto, JSON-RPC): parse with `ignoreUnknownFields` so forward-compatible changes don't break old clients.
- **Persisted data** (database rows, cache files) is a boundary: parse it where it is read and return corrupt data as a local failure.
- **Don't re-validate** deep in call chains.

## Schema-derived types

When a `.proto`, OpenAPI spec, GraphQL schema, or database migration already defines a shape, derive from the generated types instead of duplicating them.

```ts
// Don't. Duplicate shape, drifts when the schema changes.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary): void {
  /* ... */
}

// Do. Derive from the generated schema type.
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">): void {
  /* ... */
}
```

Reach for `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof` before writing a new interface.

## Object args

```ts
// Don't. Swap two args, still compiles.
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// Do. Order-independent, self-documenting.
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

Skip on hot paths: per-frame render, tokenisers, parsers, anything in a tight loop where the allocation cost matters.

## Result library

`Result.try` wraps each throwing call on its own, and `parse` is the one bridge from Zod. Only a throw rolls a database transaction back, so a failure that must undo the writes is thrown inside the transaction and becomes a Result outside it.

```ts
import { Result, type Err } from "better-result";

type ResultGenerator<T, E> = Generator<Err<never, E>, Result<T, E>, unknown>;

// Don't. The catch-all turns every defect and every failure into the same null.
function loadSettings(file: string): Settings | null {
  try {
    return settingsSchema.parse(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return null;
  }
}

// Do. Failures are values, and each throwing call is wrapped on its own.
function loadSettings(file: string): Result<Settings, string> {
  return Result.gen(function* (): ResultGenerator<Settings, string> {
    const text = yield* Result.try({
      try: (): string => readFileSync(file, "utf8"),
      catch: (cause): string => `Cannot read ${file}: ${String(cause)}`,
    });
    const json = yield* Result.try({
      try: (): unknown => JSON.parse(text),
      catch: (): string => `${file} is not JSON`,
    });
    return parse(settingsSchema, json);
  });
}

// The one bridge from Zod's success/failure shape.
function parse<T>(schema: z.ZodType<T>, input: unknown): Result<T, string> {
  const parsed = schema.safeParse(input);
  return parsed.success ? Result.ok(parsed.data) : Result.err(parsed.error.message);
}

// Don't. Catching to detect a missing file.
function isMissing(path: string): boolean {
  try {
    lstatSync(path);
    return false;
  } catch {
    return true;
  }
}

// Do. The option returns undefined in place of throwing.
function isMissing(path: string): boolean {
  return lstatSync(path, { throwIfNoEntry: false }) === undefined;
}

// Do. The throw rolls the transaction back; Result.try turns that one failure into a value and lets defects through.
class StaleNoteError extends Error {}

function saveNotes(db: Database, notes: Note[]): Result<void, string> {
  return Result.try({
    try: (): void => {
      db.transaction((): void => {
        for (const note of notes) {
          if (!updateIfUnchanged(db, note)) {
            throw new StaleNoteError(`Note ${note.id} changed since it was read`);
          }
        }
      })();
    },
    catch: (error): string => {
      if (error instanceof StaleNoteError) {
        return error.message;
      }
      throw error;
    },
  });
}
```

## Yes/no predicates

A yes/no answer is a boolean function. The rule and its exceptions live in `principle-reader-first-code`.

```ts
// Don't. The caller compares a two-literal union.
function draftDecision(draft: Draft): "keep" | "discard" {
  return draft.body.trim() === "" ? "discard" : "keep";
}
if (draftDecision(draft) === "discard") {
  deleteDraft(draft);
}

// Do.
function shouldDiscardDraft(draft: Draft): boolean {
  return draft.body.trim() === "";
}
if (shouldDiscardDraft(draft)) {
  deleteDraft(draft);
}
```

## Closed sets

An `as const` array or object holds the values, a derived type names them, and a schema reads the same constant. Literals from JSON, SQL and argv already are the domain value, so nothing converts them.

```ts
// Don't. The enum generates runtime code, and strings from outside need converting.
enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
}

// Do. The array iterates, the type derives from it, and the schema reads it.
const LOG_LEVELS = ["debug", "info", "warn"] as const;
type LogLevel = (typeof LOG_LEVELS)[number];
const logLevelSchema = z.enum(LOG_LEVELS);

// An object when each value needs a name.
const EXIT = { success: 0, usage: 2 } as const;
type ExitCode = (typeof EXIT)[keyof typeof EXIT];
```

## Collections

`filter` then `map` reads as "keep these", then "convert them".

```ts
// Don't. flatMap hides the filter inside the conversion.
const emails = users.flatMap((user): string[] => (user.active ? [user.email] : []));

// Don't. The lazy chain adds iterator helpers for no gain.
const emails = users.values().filter((user): boolean => user.active).map((user): string => user.email).toArray();

// Do.
const emails = users.filter((user): boolean => user.active).map((user): string => user.email);

// flatMap fits when one input yields several outputs.
const lines = orders.flatMap((order): Line[] => order.lines);

// When find replaces a loop, the first match still decides.
const owner = members.find((member): boolean => member.role === "owner");
```

## Guard runs

`require` turns a condition and its failure into a Result, so each guard is one `yield*` line over a named predicate. `ResultGenerator` is the alias from the Result library example.

```ts
type TransferFailure = { kind: "closed" } | { kind: "insufficient_funds" };

function require<const E>(condition: boolean, failure: E): Result<void, E> {
  return condition ? Result.ok() : Result.err(failure);
}

// Don't. Each guard repeats the return-an-error shape.
function transfer(account: Account, amount: number): Result<Transfer, TransferFailure> {
  return Result.gen(function* (): ResultGenerator<Transfer, TransferFailure> {
    if (!isOpen(account)) {
      return Result.err({ kind: "closed" });
    }
    if (!hasFunds(account, amount)) {
      return Result.err({ kind: "insufficient_funds" });
    }
    return Result.ok(debit(account, amount));
  });
}

// Do. The reader sees the preconditions as one run.
function transfer(account: Account, amount: number): Result<Transfer, TransferFailure> {
  return Result.gen(function* (): ResultGenerator<Transfer, TransferFailure> {
    yield* require(isOpen(account), { kind: "closed" });
    yield* require(hasFunds(account, amount), { kind: "insufficient_funds" });
    return Result.ok(debit(account, amount));
  });
}
```
