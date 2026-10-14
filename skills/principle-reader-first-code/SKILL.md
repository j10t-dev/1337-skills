---
name: principle-reader-first-code
description: "Use when writing, changing, naming or reviewing code in any language, including one-line edits. Read-only investigation alone does not trigger this skill."
user-invocable: false
---

# Reader-First Code

Code explains itself to the person reading it, who is also its long-term owner. The bar is whether a strong developer from another typed language follows it at a glance, not whether the compiler accepts it. Concepts cost the reader more than lines: every type, wrapper, union, helper and parameter is one more thing to hold in mind, so each pays its way. Before calling a change done, read it as that reader, against the five questions below.

Two references hold the rest of the rules and the worked examples; read the one that applies before writing or reviewing:

- tests being written, changed or reviewed: [writing-good-tests.md](../test-driven-development/writing-good-tests.md)
- a name being chosen, questioned or reviewed: [naming-examples.md](naming-examples.md)

## Can the reader follow the operation?

- **Entry point first.** The exported operation or public contract comes straight after the imports, so the reader meets what the file does before any of its ingredients, wherever the language allows either order. A single-operation module follows the entry point with its helpers in the order they run. A multi-operation module opens on its contract (the type and its factory), then a short paragraph on how the operations behave, then the operations; constants, key maps, schemas and helpers sit below them. The order serves reading rather than a mechanical sort.
- **Phases at a glance.** The entry point's body reads like a table of contents: each phase the requirement names is its own statement or call there, in the requirement's order, so the reader sees the whole operation without opening a helper. A phase that loops, branches or pages through results becomes one call to a named helper that holds that phase alone; a helper that also absorbs a neighbouring phase hides that phase from the reader.

  ```ts
  export function renderInvoice(order: Order): string {
    const lines = order.items.map(toInvoiceLine);
    const totals = sumTotals(lines);
    const header = formatHeader(order.customer, order.issuedOn);
    return joinSections(header, lines, totals);
  }
  // Below: toInvoiceLine, sumTotals, formatHeader and joinSections, in that order.
  ```
- **Co-location.** Code the reader needs together sits together. Each helper stays near its caller, and each type sits just below the function that uses it, so plumbing types such as a dependencies object follow the operation they serve.
- **Responsibilities before files.** Cut responsibilities before splitting files. Split a file when it does two jobs that fail differently, such as rejecting a whole response versus keeping one record as unreadable. A module that needs section-divider comments is asking to be split into files.
- **Newcomer re-read.** After shrinking a module, re-read it as a newcomer. Cryptic one-word helpers and parallel pieces built differently are defects, however many lines were cut.
- **Order and vocabulary.** Once the design is sound, fix readability with renames, reordering and short explanations; the architecture stays.
- **Visible exceptions.** A deliberate exception or recovery rule gets its own branch and a one-line comment saying why.
- **Shape at a glance.** Lay code out so the reader tells methods, properties and return types apart at a glance. Parallel definitions share one visual shape, so an irregular one in the block gets reshaped to match. Line width exists to avoid awkward wraps, so a long line or a dense one-expression body gets broken into named steps.
- **Own preconditions.** A function enforces the precondition its own comment states, rather than relying on every caller to pass only inputs where it holds. This differs from re-checking a boundary type, which stays trusted (see `principle-boundary-discipline`).
- **Comments.** Code explains itself first, and a comment carries only what good code can't: a protocol quirk, a binary layout, which errors reject a whole response. Comments state the current contract or a rule a name can't carry, and documentation comments come when requested. Comments describe the code as it stands, because the reader can't see its past; words such as "existing", "preserve", "kept for" and "still" mark a comment to rewrite.

## Do the names say what things are?

- **Literal.** Name a value by what it literally is or holds, in the reader's everyday sense of the word. Metaphors (`Vault` for a database file), process adjectives (`Captured`, `Prepared`, `ForStorage`) and abstract role words (`revision` for a timestamp) make the reader decode; `remoteUpdatedAt` says what it holds. Check each candidate's everyday reading: `position` suggests an ordinal and `Run` in a type name reads as an action. A field takes the plain noun (`record`) and lets its type carry the qualifier (`RawIndexRecord`). Stage words such as `raw` can be accurate in context; the test is whether the name tells the reader enough.
- **Intermediate data.** Name intermediate data by the operation that produced it (`ParsedIndexRecord`) or by what it is for (`RecordToSave`, `itemIdsToFetch`). Stage names stay distinct and true on every path. A participle keeps its subject: `tokenRequestResult`, `responseJson`. Add `Result` when the value may hold a failure.
- **One concept, one name.** A concept has one name everywhere: types, fields, locals, fixtures, test names, help text, error messages, the glossary, database tables and columns, stored keys, config keys, environment variables and default file names. A rename reaches inner keys and IDs, and tests use the shared identity constants. A standard mechanism takes the industry word: a cursor is a cursor. An encoded token and its decoded data share a stem (`ChangeCursor`, `ChangeCursorData`).
- **Real counterparts.** Add a qualifier such as `local`, `remote` or a service name only when its counterpart exists in the code; a saved copy of a remote value is `savedItemTimestamps`. Model only the concepts the real use has, so a single-user tool has no accounts.
- **Product language.** Core code speaks the product's language, and the adapter translates vendor terms. Inside the adapter, the concrete format name (`firestore-response-parser`) tells the reader more than a generic word like `wire`. Data type names describe data rather than the vendor call that returned it: `QueryPage`.
- **Functions.** A function is a verb named for its whole job and its output: `createItemRecordToSave`, `resolveSettings()`. A helper that establishes a guarantee is named for it: `ensurePrivateDbPath`, `checkExistingSchema`. Lifecycle words and generic verbs (`bootstrap`, `prepare`, `preflight`) hide the result. Data gets descriptive nouns.
- **Callback parameters.** A callback or function-valued parameter gets a plain noun the reader understands (`operation`), rather than jargon (`thunk`), an adjective, a sequence word (`step`) or a word that echoes the helper's name (`attempt` inside `tryX`). A wrapper that runs caller code and turns throws into a result is named after the result library's own `try` (`tryX`).
- **Yes/no answers.** A yes/no answer is a boolean function named `should…`, `is…` or `has…`, so the method name carries the meaning: `shouldSave(): boolean`. A set of named values fits only when the values are stored, serialised, rendered or sent, when the variants carry different data, or when a third value is plausible.
- **State words.** Use the domain's precise word for a state and check its connotations: "unavailable" suggests an outage, and "missing" suggests the thing ought to exist. A normal, chosen absence gets a neutral name: `codecWithoutKey`.
- **Self-explaining.** A name that needs a comment to explain it gets renamed.
- **Files and modules.** A file is named after the main thing it provides, and when name and contents disagree the file is renamed (`open.ts` to `connection.ts`). Each module gets a concrete base name of its own; an abstract word like `source` tells the reader nothing. Specific beats conventional: an abstract conventional name (`transport`) fits only a module that really hides the mechanism, and one whose contract exposes URLs, methods and status codes is `http-client`. Name for today's code, since a possible future change is no reason for a vaguer name. A wrapper says what it adds: `requestWithIdToken()`.
- **Variants.** Name union variants by what actually separates them; a tag every variant could carry separates nothing. Name a discriminant after what the consumer does next (`more` / `last`) rather than a source flag it resembles (`done`).
- **Meaningful numbers.** A number chosen for its meaning gets a name: exit codes become `EXIT.success` and `EXIT.usage`, and a permission mask becomes `isPrivateToOwner(mode)` built from the platform's named constants. A literal stays where the number is what people type (`chmod 0o600`).

## Does each concept earn its place?

- **Review targets.** Every review looks for duplication, existing helpers left unused and mixed responsibilities; each is a defect.
- **Shared shape.** When every call site has the same shape, extract one helper and pass in the parts that vary, so each call site states its own policy on one line. Several functions that each switch over the same union to derive one attribute become one exhaustive switch that returns them all.
- **Generic helpers.** A generic helper knows only its general job, and each caller handles its own special cases.
- **One home.** Identical production helpers live in one place. "Duplicates" that differ on edge inputs are different helpers, and merging them changes behaviour.
- **Type aliases.** Extract a type alias only when its name explains a concept to the reader.
- **One idiom per mechanism.** A correct piece of code in a second style is a defect. Convert every site, production and tests alike, including hand-rolled look-alikes such as an `"ok"` arm in a failure union beside an established result type. A pilot slice exists to judge a convention; once adopted, it reaches everything.
- **One source.** Every rule, closed set and mapping that two layers depend on has one source the others derive from: the validator is built from the list constant, the query from the parser's field name, and parameters take the domain type rather than a bare `string`.
- **Delete before renaming.** A wrapper whose extra fields are derivable from its contents, a bundle whose extra field nobody reads, fields written but never read, fields that duplicate another, and a nullable that is never null all get deleted rather than renamed.
- **Direct calls.** When a framework has already made a decision, such as a command parser choosing the command, call the operation from its callback. When a union is built in one place only so another can switch on it to choose a function, call the function directly. Unions carry real outcomes the program handles differently (`archived | conflict | not_found`).
- **Misusable parameters.** A parameter callers can only misuse is deleted in the same change, together with its throw and its tests.
- **Runtime first.** Use runtime and existing-library features before writing your own, and when a module looks big for its job, first check what they provide. These include a schema library for standard formats, the platform's date-time, transaction, resource-cleanup and test-mock facilities. Configuration and argument parsing are solved problems, so follow the parser library's own handling. A schema library describes data; hand-written parsers stay outside it.
- **Libraries.** Adopt a library when its pattern is codebase-wide, rather than to tidy one place. Taking the useful part of a framework without its architecture is fine when shipping comes first.
- **Tooling.** Every tool earns its place by what it enforces, not by its size. A maintained standard tool beats a hand-rolled script that gets edge cases wrong. A lint rule that pushes code towards worse patterns is relaxed, and the preference it was meant to serve goes into the project's instructions. When a change removes a class of defect, it adds a gate so the class stays gone.
- **Current docs.** Before reworking an adapter, read the current documentation and the installed types.
- **Failures.** Report a failure directly, rather than wrapping it in a value the consumer discards. An unknown outcome is a failure. Bugs propagate to the process boundary: catch only the expected failures an operation can produce, so a type or range error never becomes an expected kind such as an I/O failure, and symmetric paths share one policy.
- **Failure output.** A failure union maps to exit codes and messages in one module, with one exhaustive switch per mapping. Each kind of error message is written by one function, so every configuration error comes from one formatter; different kinds may look different. Escaping untrusted text probably belongs in one place, where it is composed into an output line, with one rule for every source.

## Do the tests explain and prove?

A test is a specification the reader understands at a glance and evidence that the behaviour holds.

- **Test names.** Each test name reads `GIVEN <state> WHEN <the action the user takes> THEN <observable outcome>`, and names exactly what the test asserts.
- **Describe blocks.** The function under test names the outer group (`describe`); each inner group names an area of its behaviour in a short plain phrase.
- **Whole values.** Compare a result value whole against its expected success or failure (`Result.ok(…)`, `Result.err({ … })`), or unwrap it, so one unconditional assertion covers the variant and its payload.
- **Local scenarios.** Shared builders with defaults live in a fixtures file (`*.fixtures.ts`); each test's scenario data and expected values stay in the test or its parameterised table (`test.each`), with expected values written as literals or an independent oracle's result. Each test passes the fields it is about rather than relying on builder defaults.

writing-good-tests.md holds the rest.

## Is the change worth its size?

- **Requirement fit.** Complexity matches the requirement; build what the task needs and stop there.
- **Shown threats.** Before building a safety mechanism, name the threat and show it occurs. A fact that can change after parsing, such as live authorisation, resource state or a destructive operation's destination, is a shown threat, so its guard at the point of effect stays (see `principle-boundary-discipline`). A failure reproduced against your own fake shows an assumption, not a bug. Defensive copies guard against a caller actually seen mutating.
- **Demonstrated need.** History, revisions, retention schedules, expiry and restore workflows wait for a demonstrated need.
- **Fewer lines, more readable.** Fewer lines and more readable is the tiebreaker, and deletion is progress. An improvement that adds lines justifies them, and a change that grows explains the growth split into production, tests and annotations. A behaviour regression vetoes a swap. Rank review findings by how much code and how many concepts they remove; more files, injectable streams and extra flags are costs to justify.
- **Finished and minimal.** Aim at a minimal finished tool, then stop building.
- **Compatibility.** With no other users or installs, compatibility work buys nothing: no migrations, shims or deprecation paths. In that case, before the first release, rename persisted names to the current vocabulary and reset stored data rather than migrating it; once a release is out, weigh compatibility again. Tolerances towards third-party data you don't control stay.

**The tests:**

- "Does the file open on what it does, and does the entry point read as its phases?" If the reader meets ingredients first, reorder.
- "Would the reader know what this holds or does from its name alone, without a comment or a lookup?" If not, rename.
- "What would the reader lose if this type, wrapper, union, helper or parameter were deleted?" If nothing, delete it.
- "Could the reader learn the behaviour from the tests alone?" If not, rewrite them as specifications.
- "Which requirement or demonstrated threat does each added line serve?" Cut the lines that serve neither.
