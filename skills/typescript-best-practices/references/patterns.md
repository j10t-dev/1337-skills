# TypeScript patterns

Code examples for each rule in `SKILL.md`, written in Effect. API mechanics come from `node_modules/effect/AGENTS.md`; these examples show the choices made here. The underlying principles are language-agnostic; invoke the `principle-type-system-discipline` and `principle-boundary-discipline` skills.

## Branded types

Brand the base schema with `Schema.brand`. Decoding creates the branded value, so downstream code trusts the type.

```ts
import { Effect, Schema } from "effect";

const AgentId = Schema.String.check(Schema.isUUID()).pipe(Schema.brand("AgentId"));
type AgentId = typeof AgentId.Type;

function parseAgentId(input: unknown): Effect.Effect<AgentId, Schema.SchemaError> {
  return Schema.decodeUnknownEffect(AgentId)(input);
}

function focusAgent(id: AgentId): Effect.Effect<void> {
  return Effect.log(`Focusing agent ${id}`);
}
```

## Discriminated unions

If a bug forces the question "wait, can this combination actually happen?", the type is too loose. Model variants with a `_tag` literal: every variant has one and each variant's value is unique, so impossible combos can't be represented. `Schema.TaggedStruct` builds the same shape when the variants are decoded.

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { readonly _tag: "Loading" }
  | { readonly _tag: "Ready"; readonly diff: GitDiff }
  | { readonly _tag: "Failed"; readonly error: string };
```

## Constructive modelling

Build the type from parts that are all legal instead of restricting a loose type with runtime checks. Adding is easier than subtracting.

Non-empty, via `Array.NonEmptyReadonlyArray`:

```ts
import { Array } from "effect";

// Don't: a plain array plus a length check every caller must repeat
function pickWinner(entries: ReadonlyArray<string>): string {
  if (entries.length === 0) {
    throw new Error("no entries");
  }
  return entries[Math.floor(Math.random() * entries.length)];
}

// Do: an empty value of the type can't exist
function pickWinner(entries: Array.NonEmptyReadonlyArray<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

Where a plain array arrives, `Array.isReadonlyArrayNonEmpty` narrows it once. The fact then travels in the type:

```ts
import { Array, Option } from "effect";

function drawWinner(entries: ReadonlyArray<string>): Option.Option<string> {
  return Array.isReadonlyArrayNonEmpty(entries) ? Option.some(pickWinner(entries)) : Option.none();
}
```

Even length, as pairs. TypeScript has no refinement types (no `arr.length % 2 === 0` at the type level); you don't need one:

```ts
type Pairs<T> = [T, T][];
```

A time range, as start plus duration:

```ts
// Don't: start <= end holds only by convention
type TimeRange = { start: Date; end: Date };

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

Keep `durationMs` a plain number. Brand it (per Branded types) only if a raw number could be passed where a duration is expected, not by reflex. A `Pairs<T>` is an even-length list under the interpretation you give it, the same way `{ start, durationMs }` is a range. Pick the representation that makes the bad state unconstructable, then expose the reading you need on top (`pairs.flat()`, a `rangeEnd()` helper).

## Simplest total type

Don't strengthen everything. Keep a plain array when every operation on it is total; the sum of no values is 0:

```ts
const sum = (values: ReadonlyArray<number>): number => values.reduce((total, value): number => total + value, 0);
```

Strengthen when the loose type forces a lie at a use site. The tells are `!`, `arr[0] as T`, and a "should never happen" throw:

```ts
import { Array } from "effect";

// Don't: partiality smuggled past the compiler
function newestSession(sessions: ReadonlyArray<Session>): Session {
  return sessions.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function newestSession(sessions: Array.NonEmptyReadonlyArray<Session>): Session {
  return Array.headNonEmpty(sessions);
}
```

Weakening the result to `Option.Option<Session>` is the other total signature. Either way the empty case lands at the call site, the one place that knows what empty means.

```ts
import { Array, Option } from "effect";

function newestSession(sessions: ReadonlyArray<Session>): Option.Option<Session> {
  return Array.head(sessions);
}
```

## `unknown` over `any`

`any` disables type checking for everything it touches. External data is `unknown` until a `Schema` decodes it.

```ts
import { Effect, Schema } from "effect";

// Don't
function senderName(input: any): string {
  return input.sender.name;
}

// Do
const Message = Schema.Struct({ sender: Schema.Struct({ name: Schema.String }) });

function senderName(input: unknown): Effect.Effect<string, Schema.SchemaError> {
  return Schema.decodeUnknownEffect(Message)(input).pipe(
    Effect.map((message: typeof Message.Type): string => message.sender.name),
  );
}
```

External sources include RPC payloads, `JSON.parse`, `postMessage`, IPC, file contents, environment variables, database results.

## No `as` casts

A type assertion parses nothing. Decode unknown data with a `Schema` in place of claiming its type.

```ts
import { Effect, Schema } from "effect";

// Don't
const user = data as User;

// Do
const User = Schema.Struct({ id: Schema.String, name: Schema.String });
type User = typeof User.Type;

function parseUser(data: unknown): Effect.Effect<User, Schema.SchemaError> {
  return Schema.decodeUnknownEffect(User)(data);
}
```

Where TypeScript cannot express an invariant the code already holds, the cast follows the protocol in `principle-type-system-discipline`. `// SAFETY:` says where the value comes from, which invariant guarantees it and why TypeScript cannot see it; `Verified by:` names the test that fails if the invariant breaks; an `// oxlint-disable-next-line <rule>` line is added only where a configured rule fires, and the baseline configuration has no assertion rule. Here a registry holds values of different types, one per key, and a Map cannot tie a stored value's type to its key's type parameter. `Key` is invariant in `T` through `valueType`, a member that exists only in the type, so a `Key<number>` cannot be widened to `Key<string | number>` to store a string:

```ts
import { Option, type Types } from "effect";

/** Names one value of type `T` in a `Registry`; two keys never collide, even with the same name. */
export class Key<T> {
  declare private readonly valueType: Types.Invariant<T>;
  /** Identifies this key inside a `Registry`. */
  readonly id: symbol;

  constructor(name: string) {
    this.id = Symbol(name);
  }
}

/** Holds at most one value per key, each of its key's type. */
export class Registry {
  private readonly values = new Map<symbol, unknown>();

  /** Stores `value` under `key`, replacing any earlier value. */
  set<T>(key: Key<T>, value: T): void {
    this.values.set(key.id, value);
  }

  /** The value stored under `key`, or none when nothing was stored. */
  get<T>(key: Key<T>): Option.Option<T> {
    if (!this.values.has(key.id)) {
      return Option.none();
    }
    // SAFETY: `set` is the only writer of `values` and stores each value under its own key's `id`. Each `id` is a fresh
    // symbol and `Key` is invariant in `T`, so the value under `key.id` is a `T`. A Map's value type cannot depend on its key.
    // Verified by: registry.test.ts "GIVEN a number and a string stored under two keys WHEN each key is read THEN each read returns its own value"
    return Option.some(this.values.get(key.id) as T);
  }
}
```

When refactoring an `as` out of existing code, identify why TypeScript can't infer:

- Missing discriminant: add a `_tag`, switch to a discriminated union.
- Overly wide source type (e.g. `Record<string, unknown>`): narrow it.
- Untyped boundary: decode it with a `Schema`.
- Genuinely inexpressible: a `Schema.brand`, `satisfies`, or the protocol above.

## Narrowing hierarchy

From best to last-resort:

1. **`_tag` switch / if.** Compiler narrows automatically.
2. **`in` operator.** `"key" in obj` narrows to variants containing that key.
3. **`Predicate` helpers, `instanceof`.** For primitives, structures and class instances.
4. **User-defined type guard.** When the above aren't enough.
5. **`as` cast.** Only under the protocol in No `as` casts.

```ts
function area(shape: Shape): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;
  }
  return shape.width * shape.height;
}
```

## Type guards

A domain guard must actually verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe.

```ts
function isCircle(shape: Shape): shape is Shape & { readonly _tag: "Circle" } {
  return shape._tag === "Circle";
}
```

Prefer `_tag` narrowing when possible. The guard adds a layer the reader has to follow. Primitive and structural checks come from `Predicate`, never a hand-written `isString`:

```ts
import { Predicate } from "effect";

function labelOf(input: unknown): string {
  return Predicate.isString(input) ? input : "unlabelled";
}
```

## Exhaustiveness

Write a `case` per variant and no `default`. The `switch-exhaustiveness-check` lint rule enforces it; `tooling-baseline.md` configures it. Only where no exhaustiveness lint rule is configured does a `void` function end with `assertNever`, as `draw` does.

```ts
function area(shape: Shape): number {
  switch (shape._tag) {
    case "Circle":
      return Math.PI * shape.radius ** 2;
    case "Rect":
      return shape.width * shape.height;
  }
}

function draw(shape: Shape): void {
  switch (shape._tag) {
    case "Circle":
      drawCircle(shape);
      return;
    case "Rect":
      drawRect(shape);
      return;
  }
  assertNever(shape);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}
```

## `satisfies` over `as`

`satisfies` validates without widening literal types: after the Do line, `config.theme` is the literal `"dark"`, not `string`.

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates and keeps literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
```

## Boundary validation

Decode once where data crosses in, and trust types inside. The decoder stays private beside its schema, because an exported decoder accepts parse options from every caller, and `disableChecks` would return a branded value no check proved. The exported parser is named for the domain and takes the input type callers hold. That input picks the decoder: `Schema.decodeEffect` when a runtime step established it as the schema's exact encoded type, such as a `string` read from a file or a value an API returned with a type the caller did not supply as a type argument, and `Schema.decodeUnknownEffect` otherwise. A parsed JSON body or a database row is `unknown` however it is annotated. Invoke the `principle-boundary-discipline` skill.

```ts
import { Effect, Schema } from "effect";

const LOWERCASE_SLUG = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/** Lowercase letters, digits and inner hyphens. */
export const InfrastructureStage = Schema.String.check(Schema.isPattern(LOWERCASE_SLUG)).pipe(
  Schema.brand("InfrastructureStage"),
);
export type InfrastructureStage = typeof InfrastructureStage.Type;
const decodeInfrastructureStage = Schema.decodeEffect(InfrastructureStage);

/** Decodes a stage name read from config. */
export const parseInfrastructureStage = (input: string): Effect.Effect<InfrastructureStage, Schema.SchemaError> =>
  decodeInfrastructureStage(input);

export const DeployRequest = Schema.Struct({ stage: InfrastructureStage, version: Schema.String });
export type DeployRequest = typeof DeployRequest.Type;
const decodeDeployRequest = Schema.decodeUnknownEffect(DeployRequest);

/** Decodes an HTTP request body. */
export const parseDeployRequest = (body: unknown): Effect.Effect<DeployRequest, Schema.SchemaError> =>
  decodeDeployRequest(body);
```

- **Wire formats** (proto, JSON-RPC): decode so unknown fields are ignored, so forward-compatible changes don't break old clients.
- **Persisted data** (database rows, cache files) is a boundary: decode rows from `unknown` where they are read, never trusting a query's type argument, and fail with a tagged error on corrupt data.
- **Don't re-validate** deep in call chains.

## Schema-derived types

When a `.proto`, OpenAPI spec, GraphQL schema, database migration or `Schema` already defines a shape, derive from it instead of duplicating it.

```ts
// Don't. Duplicate shape, drifts when the schema changes.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(summary: CheckSummary): string {
  return `${summary.checks.length} of ${summary.totalCount} checks`;
}

// Do. Derive from the generated schema type.
import type { ChecksMessage } from "<generated module>";
function renderChecks(summary: Pick<ChecksMessage, "totalCount" | "checks">): string {
  return `${summary.checks.length} of ${summary.totalCount} checks`;
}
```

Reach for `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof` and a schema's `.Type` before writing a new interface.

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

## Workflows

The generator holds the business steps: services yielded, intermediate values named, the cache decision an ordinary `if`. Cross-cutting policy wraps it, passed to `Effect.fn` after the generator as its pipe. One pure transform stays a `.pipe(Effect.map(…))`.

```ts
import { Effect, Option } from "effect";

// Don't. Three dependent flatMap steps bury the cache decision in nested callbacks.
const fetchUserPosts = (userId: UserId): Effect.Effect<ReadonlyArray<Post>, DatabaseError | CacheError, UserDatabase | UserCache> =>
  UserCache.pipe(
    Effect.flatMap((cache: UserCache["Service"]): Effect.Effect<ReadonlyArray<Post>, DatabaseError | CacheError, UserDatabase> =>
      cache.getUserPosts(userId).pipe(
        Effect.flatMap((cached: Option.Option<ReadonlyArray<Post>>): Effect.Effect<ReadonlyArray<Post>, DatabaseError | CacheError, UserDatabase> =>
          Option.isSome(cached)
            ? Effect.succeed(cached.value)
            : UserDatabase.pipe(
                Effect.flatMap((database: UserDatabase["Service"]): Effect.Effect<ReadonlyArray<Post>, DatabaseError | CacheError> =>
                  database.findPostsByUser(userId).pipe(
                    Effect.tap((posts: ReadonlyArray<Post>): Effect.Effect<void, CacheError> => cache.setUserPosts(userId, posts)),
                  ),
                ),
              ),
        ),
      ),
    ),
  );

// Do.
const fetchUserPosts = Effect.fn("fetchUserPosts")(
  function* (userId: UserId): Effect.fn.Return<ReadonlyArray<Post>, DatabaseError | CacheError, UserDatabase | UserCache> {
    const database = yield* UserDatabase;
    const cache = yield* UserCache;
    const cachedPosts = yield* cache.getUserPosts(userId);
    if (Option.isSome(cachedPosts)) {
      return cachedPosts.value;
    }
    const posts = yield* database.findPostsByUser(userId);
    yield* cache.setUserPosts(userId, posts);
    return posts;
  },
  Effect.retry({ times: 2 }),
);

const countUserPosts = (userId: UserId): Effect.Effect<number, DatabaseError | CacheError, UserDatabase | UserCache> =>
  fetchUserPosts(userId).pipe(Effect.map((posts: ReadonlyArray<Post>): number => posts.length));
```

## Errors

Each expected failure is a `Schema.TaggedError` whose fields carry the operation's context, with a classified reason where the cause changes the next step. At the command line edge, `catchTags` gives each tag its own message, following the error-message rule in `principle-reader-first-code`. A new tag stays in the error channel, so the `never` in the signature is a type error until the new failure has its message.

```ts
import { Effect, Schema } from "effect";

class OrderNotFound extends Schema.TaggedError<OrderNotFound>()("OrderNotFound", { orderId: Schema.String }) {}
class MailNotSent extends Schema.TaggedError<MailNotSent>()("MailNotSent", {
  orderId: Schema.String,
  address: Schema.String,
  reason: Schema.Literals(["address_refused", "carrier_unavailable"]),
}) {}

// Don't. The catch-all gives every failure, including ones added later, the same message.
const shipCommand = (orderId: string): Effect.Effect<string, never, Orders | Mailer> =>
  shipById(orderId).pipe(
    Effect.map((sent: SentLabel): string => `Label ${sent.id} sent for order ${orderId}.`),
    Effect.catch((): Effect.Effect<string> => Effect.succeed("Something went wrong.")),
  );

// Do.
const shipCommand = (orderId: string): Effect.Effect<string, never, Orders | Mailer> =>
  shipById(orderId).pipe(
    Effect.map((sent: SentLabel): string => `Label ${sent.id} sent for order ${orderId}.`),
    Effect.catchTags({
      OrderNotFound: (error: OrderNotFound): Effect.Effect<string> =>
        Effect.succeed(`Order ${error.orderId} was not found. Check the order ID and run the command again.`),
      MailNotSent: (error: MailNotSent): Effect.Effect<string> =>
        Effect.succeed(
          error.reason === "address_refused"
            ? `The carrier refused the address ${error.address} for order ${error.orderId}. Correct the address, then ship the order again.`
            : `The carrier was unavailable for order ${error.orderId}. Ship the order again later.`,
        ),
    }),
  );
```

## Throwing APIs

`Effect.try` and `Effect.tryPromise` wrap each throwing call on its own, each into its own tagged error.

```ts
import { Effect, Schema } from "effect";

class SettingsUnreadable extends Schema.TaggedError<SettingsUnreadable>()("SettingsUnreadable", { path: Schema.String }) {}
class SettingsNotJson extends Schema.TaggedError<SettingsNotJson>()("SettingsNotJson", { path: Schema.String }) {}

const Settings = Schema.Struct({ theme: Schema.String });
type Settings = typeof Settings.Type;

const loadSettings = Effect.fn("loadSettings")(function* (
  path: string,
): Effect.fn.Return<Settings, SettingsUnreadable | SettingsNotJson | Schema.SchemaError> {
  const text = yield* Effect.tryPromise({
    try: async (): Promise<string> => Bun.file(path).text(),
    catch: (): SettingsUnreadable => new SettingsUnreadable({ path }),
  });
  const json = yield* Effect.try({
    try: (): unknown => JSON.parse(text),
    catch: (): SettingsNotJson => new SettingsNotJson({ path }),
  });
  return yield* Schema.decodeUnknownEffect(Settings)(json);
});
```

Prefer an API option that doesn't throw over catching.

```ts
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
```

## Optional values

`Schema.OptionFromNullOr` turns a nullable field into an `Option` as it crosses in, and `Array.findFirst` returns one for a lookup that may miss.

```ts
import { Array, Effect, Option, Schema } from "effect";

const Order = Schema.Struct({
  id: Schema.String,
  address: Schema.String,
  deliveryNote: Schema.OptionFromNullOr(Schema.String),
});
type Order = typeof Order.Type;
const decodeOrder = Schema.decodeUnknownEffect(Order);

function parseOrder(input: unknown): Effect.Effect<Order, Schema.SchemaError> {
  return decodeOrder(input);
}

function findOrder(orders: ReadonlyArray<Order>, id: string): Option.Option<Order> {
  return Array.findFirst(orders, (order: Order): boolean => order.id === id);
}
```

## Services

A service declares its shape inline and carries its Layers as static members. With several implementations, each Layer is named for what differs: `layerCarrier` sends through the `CarrierClient` service, and `layerDryRun` logs the label and sends nothing. `Mailer["Service"]` names the shape's type where a signature needs it.

```ts
import { Context, Effect, Layer, Schema } from "effect";

class Label extends Schema.Class<Label>("Label")({ orderId: Schema.String, address: Schema.String }) {}
type SentLabel = { readonly id: string };

/** Sends shipping labels. */
export class Mailer extends Context.Service<Mailer, {
  /** Sends one label; fails with `MailNotSent` when the carrier refuses the address or is unavailable. */
  readonly send: (label: Label) => Effect.Effect<SentLabel, MailNotSent>;
}>()("app/Mailer") {
  static readonly layerCarrier: Layer.Layer<Mailer, never, CarrierClient> = Layer.effect(
    Mailer,
    Effect.gen(function* (): Effect.fn.Return<Mailer["Service"], never, CarrierClient> {
      const carrier = yield* CarrierClient;
      return Mailer.of({
        send: (label: Label): Effect.Effect<SentLabel, MailNotSent> => carrier.postLabel(label),
      });
    }),
  );

  static readonly layerDryRun: Layer.Layer<Mailer> = Layer.succeed(Mailer, Mailer.of({
    send: (label: Label): Effect.Effect<SentLabel> =>
      Effect.log(`Dry run: label for order ${label.orderId} not sent`).pipe(Effect.as({ id: `dry-run-${label.orderId}` })),
  }));
}
```

Code yields the service. The composition root chooses the Layer: each entry point provides one at its top-level call, after supplying that Layer's own dependencies. Ordinary functions take no Layer.

```ts
import { Effect, Layer } from "effect";

// Don't. The mailer arrives as an argument, so every caller must find one.
function shipOrder(mailer: Mailer["Service"], order: Order): Effect.Effect<SentLabel, MailNotSent> {
  return mailer.send(new Label({ orderId: order.id, address: order.address }));
}

// Do.
const shipOrder = Effect.fn("shipOrder")(function* (order: Order): Effect.fn.Return<SentLabel, MailNotSent, Mailer> {
  const mailer = yield* Mailer;
  return yield* mailer.send(new Label({ orderId: order.id, address: order.address }));
});

const carrierMailer: Layer.Layer<Mailer> = Mailer.layerCarrier.pipe(Layer.provide(CarrierClient.layer));

async function shipWithCarrier(order: Order): Promise<SentLabel> {
  return Effect.runPromise(shipOrder(order).pipe(Effect.provide(carrierMailer)));
}

async function shipDryRun(order: Order): Promise<SentLabel> {
  return Effect.runPromise(shipOrder(order).pipe(Effect.provide(Mailer.layerDryRun)));
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

An `as const` array or object holds the values, a derived type names them, and `Schema.Literals` decodes the same constant. Literals from JSON, SQL and argv already are the domain value once decoded, so nothing converts them.

```ts
import { Schema } from "effect";

// Don't. The enum generates runtime code, and strings from outside need converting.
enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
}

// Do. The array iterates, the type derives from it, and the schema decodes it.
const LOG_LEVELS = ["debug", "info", "warn"] as const;
type LogLevel = (typeof LOG_LEVELS)[number];
const LogLevel = Schema.Literals(LOG_LEVELS);

// Do. An object when each value needs a name.
const EXIT = { success: 0, usage: 2 } as const;
type ExitCode = (typeof EXIT)[keyof typeof EXIT];
```

## Collections

`filter` then `map` reads as "keep these", then "convert them".

```ts
import { Array } from "effect";

// Don't. flatMap hides the filter inside the conversion.
const emails = users.flatMap((user): string[] => (user.active ? [user.email] : []));

// Don't. The lazy chain adds iterator helpers for no gain.
const emails = users.values().filter((user): boolean => user.active).map((user): string => user.email).toArray();

// Do.
const emails = users.filter((user): boolean => user.active).map((user): string => user.email);

// Do. flatMap fits when one input yields several outputs.
const lines = orders.flatMap((order): Line[] => order.lines);

// Do. When findFirst replaces a loop, the first match still decides, and a miss is an Option.
const owner = Array.findFirst(members, (member): boolean => member.role === "owner");
```

## Guard runs

`require` turns a condition and its failure into an Effect, so each guard is one `yield*` line over a named predicate failing with a tagged error.

```ts
import { Effect, Schema } from "effect";

class AccountClosed extends Schema.TaggedError<AccountClosed>()("AccountClosed", { accountId: Schema.String }) {}
class InsufficientFunds extends Schema.TaggedError<InsufficientFunds>()("InsufficientFunds", {
  accountId: Schema.String,
  shortBy: Schema.Number,
}) {}

function require<const E>(condition: boolean, failure: E): Effect.Effect<void, E> {
  return condition ? Effect.void : Effect.fail(failure);
}

// Don't. Each guard repeats the fail-and-return shape.
const transfer = Effect.fn("transfer")(function* (
  account: Account,
  amount: number,
): Effect.fn.Return<Transfer, AccountClosed | InsufficientFunds> {
  if (!isOpen(account)) {
    return yield* new AccountClosed({ accountId: account.id });
  }
  if (!hasFunds(account, amount)) {
    return yield* new InsufficientFunds({ accountId: account.id, shortBy: amount - account.balance });
  }
  return debit(account, amount);
});

// Do. The reader sees the preconditions as one run.
const transfer = Effect.fn("transfer")(function* (
  account: Account,
  amount: number,
): Effect.fn.Return<Transfer, AccountClosed | InsufficientFunds> {
  yield* require(isOpen(account), new AccountClosed({ accountId: account.id }));
  yield* require(hasFunds(account, amount), new InsufficientFunds({ accountId: account.id, shortBy: amount - account.balance }));
  return debit(account, amount);
});
```
