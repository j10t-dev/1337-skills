# Writing Good Tests

**Load this reference when:** writing, changing or reviewing tests, adding mocks, or adding cleanup/helper methods for tests.

## Overview

A test exists to catch a specific break. Three principles govern everything here:

```
1. Every test names the break it catches
2. Every test exercises the real thing
3. Every test reads as a specification
```

Strict TDD produces the first two naturally: a test written first and watched failing against real code has already proven it can fail, and only earns a mock when the real dependency proves slow or external.

## Principle 1: Name the Break

Before writing the test body, answer: **what production change should make this test fail — and is that change a bug or a decision?** A test earns its place by catching a wrong branch, missing side effect, wrong argument, boundary case, or broken contract.

**Derive expectations independently.** Use literals and hand-checked fixtures; table-driven tests with literal `want` values are the preferred shape. An expectation computed by the code under test — or its helpers — passes no matter what that code does:

```typescript
// ❌ Mirror assertion: the same builder computes both sides — always true
const expected = buildSearchQuery({ tag: 'urgent' });
expect(buildSearchQuery({ tag: 'urgent' })).toBe(expected);

// ✅ Hand-derived literal
expect(buildSearchQuery({ tag: 'urgent' })).toBe('tag:"urgent"');
```

A fake used as an oracle keeps its own implementation, so the code under test cannot bend the expected value.

**Parameterise one behaviour.**

When cases exercise the same behaviour with different inputs, use one parameterised case table with explicit, independently derived expected values and side effects. Plans supply the actual cases, test bodies and local fixtures. Implementers follow them under TDD. Fixture helpers may arrange inputs, but production code or its helpers must not compute expectations.

Example contract: one acceptance operation rejects expiry at or before `now`. Parameterise these supplied cases:

| Input | Expected result | Expected effects |
| --- | --- | --- |
| `expiresAt < now` | expired | No writes |
| `expiresAt == now` | expired | No writes |
| `expiresAt > now` | Successful acceptance | Successful acceptance effects |

Keep independently different operations, such as invitation revocation, in separate behaviour tests rather than forcing them into an artificial shared table. If a required boundary is undocumented, clarify it before implementing the dependent behaviour; do not derive its expected result from existing code.

**No change detectors.** If only intentional decisions can fail a test — a constant's value, exact message wording, private structure — it fires on redesign and sleeps through bugs. Test the behaviour that depends on the decision: not `expect(MAX_RETRIES).toBe(5)` but "a failing call is retried 5 times and the 6th attempt never happens." Skip tests that pin the state a refactor replaces; the existing suite plus the type checker is the regression net, and a refactor that removes code does not grow the suite.

**Behaviour, not text.** Asserting that a script, skill, or config contains an exact line proves only that the source is the source. Run scripts against controlled inputs and assert outputs, side effects, or exit codes. Documents that instruct agents are tested by the consuming agent's behaviour (`writing-for-agents`); prose for humans earns no test at all.

**Your code, not the framework.** Test the contract your code makes at its boundaries — the route you register, the query you emit, the payload you produce. Upstream mechanics are their maintainers' tests to write (the classic: asserting your router invokes a registered handler — that is the framework's test, not yours). When upstream behaviour genuinely surprised you, write one narrow characterisation test naming the assumption. The same boundary applies inside your code: constructors, getters, constants, and trivial forwarding earn tests only when they validate, normalise, default, derive, enforce, or cause side effects — otherwise assert the first consumer-visible result that depends on them.

**The schema is its own specification.** Add no tests that merely restate a schema's declared constraints with representative valid or invalid values: the schema library owns decoding, and the declaration itself specifies a straightforward brand, struct or union. Test schema behaviour only where the application owns it beyond the declaration (a transformation, normalisation, custom filter, compatibility contract, encoded and decoded round trip, or a previously regressed edge case), and test it through the boundary's public interface when parsing failures produce caller-visible outcomes.

### Gate Function

```
BEFORE writing the test body:
  Name the production change that would make this test fail.

  Cannot name one            → redesign around an observable behaviour
  "The source text changed"  → run the artefact and assert its effects
  Only intentional decisions → change detector; test the behaviour
                               that depends on the decision

  Confirm the expected value is derived without the code under test.
  IF it reuses the code's logic or helpers:
    Replace it with a literal or hand-checked fixture
```

## Principle 2: Exercise the Real Thing

**The mock earns no assertions.** A mock assertion passes when the mock is present and fails when it is absent — it says nothing about the component. Assert the real component's behaviour; if the mock is what you are checking, unmock it or delete the assertion.

```typescript
// ✅ Real behaviour
expect(screen.getByRole('navigation')).toBeInTheDocument();

// ❌ Mock existence
expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
```

**Your human partner's correction:** "Are we testing the behaviour of a mock?"

**Faithful doubles.** A test double crosses the same interface as production with a complete, behaviourally honest implementation, usually in memory: no partial mocks, and no production behaviour weakened solely to make the double convenient. In Effect, the double is a test Layer of the whole service (see Fakes as Layers).

**Mock at the right level.** Learn every side effect of the real method before replacing it; mock the slow or external operation and keep what the test depends on real. When unsure, run the test against the real implementation first and observe what actually needs to happen.

```typescript
// ❌ Every method answers, but `save` keeps nothing and `findByTitle` always misses, so duplicate detection never fires
const notes = Layer.succeed(Notes, Notes.of({
  save: (): Effect.Effect<void> => Effect.void,
  findByTitle: (): Effect.Effect<Option.Option<Note>> => Effect.succeed(Option.none()),
}));

// ✅ The whole service in memory: a saved note stays visible to `findByTitle` and to the test
const saved: Array<Note> = [];
const notes = Layer.succeed(Notes, Notes.of({
  save: (note: Note): Effect.Effect<void> => Effect.sync((): void => {
    saved.push(note);
  }),
  findByTitle: (title: string): Effect.Effect<Option.Option<Note>> =>
    Effect.succeed(Array.findFirst(saved, (note: Note): boolean => note.title === title)),
}));
```

**Make doubles specific.** When arguments, call counts, or ordering are part of the contract, assert them — a fake that accepts anything verifies nothing. Give each branch (success, error, malformed) its own fixture or spy, so the wrong branch cannot satisfy the expectation.

**Mirror real data completely.** Mock the complete structure as it exists in reality — all documented fields — not just the ones your test reads. Partial mocks fail silently when downstream code reads an omitted field: the test passes while integration breaks.

**Production classes carry production methods only.** Cleanup that only tests need lives in test utilities, never as a `destroy()` on the production class. Ask: is this method called only from tests? Does this class own this resource's lifecycle? Wrong answers → test utility.

**Prefer real components over complex mocks.** When mock setup outgrows the test logic, mocks miss methods the real components have, or tests break when the mock changes, switch to an integration test with real components. **Your human partner's question:** "Do we need to be using a mock here?" Real I/O stays where I/O is the subject: a real database, real HTTP deadlines, subprocess tests.

### Gate Function

```
BEFORE adding a mock or test helper:
  List the real method's side effects; keep the ones the test
  depends on real — mock the slow/external level below them.

  Mock responses mirror the complete real structure.

  A method only tests call lives in test utilities, not production.

  About to assert on the mock itself?
    Unmock it or delete the assertion.
```

## Principle 3: Tests Read as Specifications

A reader opens a test file to learn what the code promises. The file reads as that promise: the function under test, an area of its behaviour, then one scenario stating its starting state, action and outcome.

**Use the framework's idioms.** Reach for the runner's own groups, tests, parameterised tables, mocks and assertions (in `bun:test`, `describe`, `test`, `test.each`, `mock` and `expect`) before hand-rolling queues, call logs or assertion helpers. Effect programs run inside plain `bun:test` tests through `Effect.runPromise`.

**Nest test groups.** The function under test names the outer group (`describe`); each inner group names an area of its behaviour with a short plain phrase (`quoteShipping` > `heavy parcels`).

**Name tests `GIVEN … WHEN … THEN …`.** GIVEN is the starting state, WHEN is the action the user takes, THEN is the observable result. An integration test names the concrete command in WHEN and the result checked in THEN. The name matches the assertions: a test that checks two outcomes names both, and a name that promises more than the assertions check means one of them changes.

**Put an assertion within the first screen.** The reader sees what the test proves without scrolling through setup. Shared builders that supply defaults live in a fixtures file beside the tests (`*.fixtures.ts` in TypeScript); helpers used across files live in small modules named for their job, for example under `test-support/` (`unwrap.ts`, `branded-values.ts`), never a catch-all `common-fixtures.ts`. Scenario data stays local, in the test or its parameterised table (`test.each`): the builder supplies the defaults, the test passes the fields it is about, and the expected value is a literal, or an independent oracle's result, written beside the test. Fixtures never assert.

**Show the call and its assertions in the body.** Setup can hide behind a builder; the call under test and what it must produce stay in the test. Bind the value under test to a local (`const quote = await Effect.runPromise(quoteShipping(parcel))`) and assert on it, rather than stacking the call inside the assertion.

```typescript
// shipping.test.ts
import { describe, expect, test } from "bun:test";
import { Effect } from "effect";
import { quoteShipping, shipParcel } from "./shipping";
import { buildParcel, inMemoryMailer } from "./shipping.fixtures";

describe("quoteShipping", (): void => {
  describe("heavy parcels", (): void => {
    test("GIVEN a 30 kg parcel WHEN it is quoted THEN the quote is 1500, including the heavy surcharge", async (): Promise<void> => {
      const parcel = buildParcel({ weightKg: 30 });

      const quote = await Effect.runPromise(quoteShipping(parcel));

      expect(quote).toBe(1500);
    });
  });
});

describe("shipParcel", (): void => {
  describe("deliverable addresses", (): void => {
    test("GIVEN a deliverable address WHEN the parcel ships THEN its label is sent and the carrier's receipt returned", async (): Promise<void> => {
      const parcel = buildParcel({ weightKg: 5, address: "1 High St" });
      const mailer = inMemoryMailer();

      const sent = await Effect.runPromise(shipParcel(parcel).pipe(Effect.provide(mailer.layer)));

      expect(sent).toEqual({ id: "label-1" });
      expect(mailer.sent).toEqual([{ address: "1 High St", weightKg: 5 }]);
    });
  });
});
```

**Assert on the whole result value.** Compare a success whole against its expected value. Take a failure with `Effect.flip` and compare its `toJSON()`, never the error instance, against `{ _tag, …fields }`: one assertion covers the tag and every field, and a mismatch prints the fields where an instance mismatch prints only the class name on both sides. Narrowing first leaves the assertion inside an `if` that can silently never run.

```typescript
const parcel = buildParcel({ weightKg: 80 });

// ❌ Check the outcome, then narrow: the field assertion hides inside an `if`
const exit = await Effect.runPromiseExit(quoteShipping(parcel));
expect(Exit.isFailure(exit)).toBe(true);
if (Exit.isFailure(exit)) expect(String(exit.cause)).toContain("80");

// ✅ One whole-value assertion on the flipped failure
const failure = await Effect.runPromise(Effect.flip(quoteShipping(parcel)));
expect(failure.toJSON()).toEqual({ _tag: "ParcelTooHeavy", weightKg: 80, limitKg: 70 });
```

**Keep accepted and rejected inputs in separate tables.** One parameterised table lists the inputs the code accepts with their results; another lists the inputs it rejects with their errors.

**Fakes as Layers.** Each service the code yields gets one in-memory fake: a function that returns the fake's Layer and the state a test inspects. A fake for one test file's subject lives in that file's fixtures file; a fake shared across test files lives in a `test-support/` module named for it (`test-support/in-memory-mailer.ts`). The test provides the Layer (`Effect.provide(mailer.layer)`) and asserts what happened through that state: the `shipParcel` test above compares the receipt whole, then `mailer.sent`; "nothing was sent" is `expect(mailer.sent).toEqual([])`. A `bun:test` `mock` wraps a fake's method only where its arguments, call count or order are the contract. Module mocking stays out.

```typescript
// shipping.fixtures.ts
import { Effect, Layer } from "effect";
import { type Label, LabelRejected, Mailer, type Parcel, type SentLabel } from "./shipping";

/** A 2 kg parcel to a deliverable address; each test overrides the fields it is about. */
export function buildParcel(overrides: Partial<Parcel> = {}): Parcel {
  return { weightKg: 2, address: "1 High St", ...overrides };
}

/** A carrier in memory that refuses the given addresses and records every label it sends. */
export function inMemoryMailer(refusedAddresses: ReadonlyArray<string> = []): { layer: Layer.Layer<Mailer>; sent: Array<Label> } {
  const sent: Array<Label> = [];
  const layer = Layer.succeed(Mailer, Mailer.of({
    send: (label: Label): Effect.Effect<SentLabel, LabelRejected> =>
      refusedAddresses.includes(label.address)
        ? Effect.fail(new LabelRejected({ address: label.address }))
        : Effect.sync((): SentLabel => {
            sent.push(label);
            return { id: `label-${sent.length}` };
          }),
  }));
  return { layer, sent };
}
```

**Assert call order only for safety invariants.** Ordering is part of the contract only when it is a safety invariant: "the lock is released after the write" earns an order assertion; "validate, then save" is covered by the outcome.

**Name test files and integration tests by what they cover.** A test file is named after the file it tests, and integration tests carry their own suffix: in TypeScript, `x.test.ts` tests `x.ts` and integration tests live in `*.integration.test.ts`.

**Use the idioms production code uses.** For example, `yield*` inside `Effect.gen` instead of a hand-rolled fold, `using` instead of a manual `.close()`, the project's shared helper (such as `required()`) instead of a local non-null assertion.

### Gate Function

```
BEFORE finishing a test file:
  The outer group (describe) names the function under test; inner groups
  name areas of behaviour in short plain phrases.

  Each test name reads GIVEN … WHEN … THEN …, WHEN is the user-visible
  action, and the name matches what the test asserts.

  An assertion shows within the first screen.
    Setup crowding it out → move shared defaults to the fixtures file

  Scenario data stays local, in the test or its parameterised table; the
  expected value is a literal or an independent oracle's result, beside
  the test. Fixtures hold defaults only, and never assert.

  An outcome is compared whole; a failure through Effect.flip and
  toJSON(), never narrowed first.

  Each service the code yields is one in-memory fake Layer, from the
  fixtures file, or from a test-support/ module named for the fake when
  several test files share it; mock wraps a fake's method only where
  arguments, call count or order are the contract. Order is asserted
  only for safety invariants.
```

## Tests Ship With the Implementation

The TDD cycle — failing test, minimal implementation, refactor — is what "complete" means. Ship the tests the behaviour needs and only those: trivial code and human prose earn none, and a test written to satisfy process costs maintenance forever.

## The Mutation Check

Before finishing, mentally mutate the production code; at least one test should fail for each realistic mutation:

- Wrong constant or argument
- Wrong branch handler
- Missing state change or side effect
- Empty or default return
- Missing validation for zero, empty, nil, unauthorised, or malformed input

A mutation nothing catches marks the behaviour as unprotected — or the test as tautological.

## Quick Reference

| When you... | Do |
|-------------|-----|
| Write any test | Name the break it catches — a bug, not a decision |
| Build an expected value | Derive it by hand; never with the code under test or its helpers |
| Vary inputs for one behaviour | Parameterise concrete cases and expected effects; keep distinct behaviours separate |
| Test a script or document | Run it / pressure-test its consumer; never grep its text |
| Reach for a dependency test | Test your boundary contract, not their documented mechanics |
| Want to assert on a mocked element | Test the real component, or unmock it |
| Are about to mock a method | Learn its side effects; mock the slow/external level |
| Build a mock response | Mirror the real structure completely |
| Need cleanup only tests use | Put it in test utilities |
| Watch mock setup balloon | Switch to an integration test with real components |
| Name a test | Nested `describe`s, function outside and area inside; `GIVEN … WHEN … THEN …` with WHEN the user's action |
| Share setup across tests | Builder with defaults in a fixtures file (`*.fixtures.ts`); scenario data stays in the test or its parameterised table, expected values literal or from an independent oracle |
| Stand in for a service | One in-memory fake of the whole service, provided as a Layer from the fixtures file, or from a `test-support/` module named for it when shared; `mock` wraps its method only where calls are the contract |
| Assert on a result value | Compare the whole value; failures through `Effect.flip` and `toJSON()`; never narrow first |
| Finish a test file | Run the mutation check |

## Warning Signs

- Setup and assertion share the same object, guaranteeing equality
- The test can fail only through a panic, crash, or missing selector
- The test fails on every intentional change, never on accidental breakage
- Expected values are hidden behind loops, builders, or helpers
- The test greps source text, or asserts a removed symbol stays removed
- The test would still matter if only the framework remained
- The test exists for coverage, checking no side effect or outcome
- An assertion checks a `*-mock` test ID, or fails if you remove the mock
- A method is called only from test files
- Mock setup is more than half the test, or you can't explain why the mock is needed
- Mocking "just to be safe"
