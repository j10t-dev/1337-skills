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

**Mock at the right level.** Learn every side effect of the real method before replacing it; mock the slow or external operation and keep what the test depends on real. When unsure, run the test against the real implementation first and observe what actually needs to happen.

```typescript
// ❌ The hand-rolled mock swallows the config write that duplicate detection reads
const catalog = { discoverAndCacheTools: async (): Promise<void> => undefined };

// ✅ Mock only the slow server startup, passed in through the dependencies; the config write stays real
const startServer = mock<ServerManager["start"]>(async (): Promise<{ pid: number }> => ({ pid: 4242 }));
const catalog = createToolCatalog({ startServer });
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

**Use the framework's idioms.** Reach for the runner's own groups, tests, parameterised tables, mocks and assertions (in bun:test, `describe`, `test`, `test.each`, `mock` and `expect`) before hand-rolling queues, call logs or assertion helpers.

**Nest test groups.** The function under test names the outer group (`describe`); each inner group names an area of its behaviour with a short plain phrase (`quoteShipping` > `heavy parcels`).

**Name tests `GIVEN … WHEN … THEN …`.** GIVEN is the starting state, WHEN is the action the user takes, THEN is the observable result. An integration test names the concrete command in WHEN and the result checked in THEN. The name matches the assertions: a test that checks two outcomes names both, and a name that promises more than the assertions check means one of them changes.

**Put an assertion within the first screen.** The reader sees what the test proves without scrolling through setup. Shared builders that supply defaults live in a fixtures file beside the tests (`*.fixtures.ts` in TypeScript); helpers used across files live in small modules named for their job, for example under `test-support/` (`unwrap.ts`, `branded-values.ts`), never a catch-all `common-fixtures.ts`. Scenario data stays local, in the test or its parameterised table (`test.each`): the builder supplies the defaults, the test passes the fields it is about, and the expected value is a literal, or an independent oracle's result, written beside the test. Fixtures never assert.

**Show the call and its assertions in the body.** Setup can hide behind a builder; the call under test and what it must produce stay in the test. Bind the value under test to a local (`const quote = quoteShipping(parcel)`) and assert on it, rather than stacking the call inside the assertion.

```typescript
// shipping.test.ts
import { describe, expect, test } from "bun:test";
import { Result } from "better-result";
import { quoteShipping } from "./shipping";
import { buildParcel } from "./shipping.fixtures";

describe("quoteShipping", (): void => {
  describe("heavy parcels", (): void => {
    test("GIVEN a 30 kg parcel WHEN it is quoted THEN the quote is 1500, including the heavy surcharge", (): void => {
      const parcel = buildParcel({ weightKg: 30 });

      const quote = quoteShipping(parcel);

      expect(quote).toEqual(Result.ok(1500));
    });
  });
});
```

**Assert on the whole result value.** Compare it to its expected success or failure (with better-result, `Result.ok(…)` or `Result.err({ … })`), or unwrap it, so one assertion covers the variant and its payload. Narrowing first leaves the assertion inside an `if` that can silently never run.

```typescript
// ❌ Assert, then narrow: when the quote is an error, the inner expect never runs
expect(quote.isOk()).toBe(true);
if (quote.isOk()) expect(quote.value).toBe(1500);

// ✅ One whole-value assertion
expect(quote).toEqual(Result.ok(1500));
```

**Keep accepted and rejected inputs in separate tables.** One parameterised table lists the inputs the code accepts with their results; another lists the inputs it rejects with their errors.

**Pass the runner's mocks in through the code's dependencies.** A mock is typed as the dependency's method (in bun:test, `mock<Mailer["send"]>`) and handed to the code through the dependencies object it already takes. Module mocking stays out. Give each mock a default that throws (as the fixture below shows), so a call the test did not expect fails where it happens; such a mock needs no "not called" check. This replaces hand-rolled queues and call logs, and a protocol fake with behaviour of its own stays.

```typescript
// shipping.fixtures.ts
export function buildDependencies(overrides: Partial<ShippingDependencies> = {}): ShippingDependencies {
  return {
    sendLabel: mock<Mailer["send"]>((): never => {
      throw new Error("sendLabel was not configured");
    }),
    ...overrides,
  };
}
```

**Assert call order only for safety invariants.** Ordering is part of the contract only when it is a safety invariant: "the lock is released after the write" earns an order assertion; "validate, then save" is covered by the outcome.

**Name test files and integration tests by what they cover.** A test file is named after the file it tests, and integration tests carry their own suffix: in TypeScript, `x.test.ts` tests `x.ts` and integration tests live in `*.integration.test.ts`.

**Use the idioms production code uses.** For example, `yield*` inside `Result.gen` instead of a hand-rolled fold, `using` instead of a manual `.close()`, the project's shared helper (such as `required()`) instead of a local non-null assertion.

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

  A result value is compared whole or unwrapped.
  Mocks arrive through the dependencies, typed as the method, each with
  a default that throws. Order is asserted only for safety invariants.
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
| Assert on a result value | Compare the whole value or unwrap it; never `isOk()` then narrow |
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
