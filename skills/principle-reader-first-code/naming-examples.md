# Naming examples

The less frequent naming rules, then before/after cases showing what the reader gains from each rename.

- **Overloaded words.** Split a word that stands for several concepts into one name per concept, so the reader never guesses which meaning applies.
- **Collections.** Name a collection by the action all its members need (`itemIdsToFetch`), rather than a category word that fits only some of them. A plural name makes clear what it is keyed by and how many values each key holds.
- **Role nouns.** Qualify a generic role noun with what it acts on (`IndexContentDecoder` rather than `decoder`), and drop qualifiers that add nothing.
- **Capabilities.** Name a capability interface by what it lets the caller do, and pair it with its siblings: `DbReader` / `DbWriter`. A check that ran when it was opened (`Bound`, `Authenticated`) stays out of the name.
- **Containers.** A type name says what it holds without a lookup: name a container by its domain contents rather than its transport mechanics.
- **Projections.** Name a projection after the subset it shows.
- **Families.** Members of a family share one structure: `unbound_empty` / `unbound_nonempty` / `bound`.
- **Umbrella terms.** An umbrella term stays distinct from the names of its member kinds.
- **Value kinds.** A name matches the value's kind: an ID constant is `itemIdA`, and every fixture gets a name the reader recognises.
- **Shapes.** Name a data shape by its pipeline stage rather than a `Dto`, `Entity` or `PersistenceObject` suffix. `Row` names an exact SQL column shape.
- **Declarations.** Judge a name by how its declaration reads to a human, parameter names included.
- **Test scaffolding.** Test scaffolding uses standard testing vocabulary: `testDependencies`, `mockResults`.
- **Callback parameters.** A callback parameter gets a plain noun the reader understands, such as `operation`, rather than jargon (`thunk`), an adjective (`fallible`), a sequence word (`step`) or a word that echoes the helper's name (`attempt` inside `tryX`). A local helper that runs caller code and turns throws into a result value is named `tryX`, after the result library's own `try`.
- **Adapter directories.** Name an adapter directory for the external system it adapts (`index/`, `sqlite/`, `config/`), and nest a facet of that system under it (`adapters/index/content/`). The path names only systems the code touches.

| Before | After | Lesson |
| --- | --- | --- |
| `Captured…` | `Parsed…` | Name a stage by what was done to the data |
| `Document` in core | `IndexRecord` | Core speaks the product's language; vendor terms stay in the adapter |
| `ChangePage` | `UpdatedIndexRecordsBatch` | Name a container by its contents |
| `SourceProjection` | `PublicItemStatus` | Name a subset after what it shows |
| `PreparedRecordResult` | `RecordToSave`, wrapper deleted | Say what is produced, and delete what renaming can't fix |
| `BoundVault` | `DbWriter` | Name the capability, not a check it passed |
| `decodeItemForStorage` | `createItemRecordToSave` | Name the produced value; a purpose phrase like "for storage" is vague |
| `outdatedItems` | `itemIdsToFetch` | Name a collection by what all its members need |
| `serverRevision` | `remoteUpdatedAt` | A timestamp says it is a timestamp |
| `localVersions` | `savedItemTimestamps` | A qualifier needs a real counterpart |
| `VaultReader` | `DbReader` | Name the thing literally, not by metaphor |
| fixtures `a`, `b` | `itemIdA` | Name the kind of value |
| `decideSave` returning `"replace" \| "keep_existing"` | `shouldSave(): boolean` | The meaning of a yes/no answer goes in the method name |
| `mode & 0o077` | `isPrivateToOwner(mode)` | Name codes and masks |
| `step` | `operation` | A callback parameter gets a plain noun |
| `open.ts` | `connection.ts` | Name a file after its main export |
| `adapters/pebble/` | `adapters/index/content/` | Group adapters by the system they adapt |
| `DbHandles` | `db: Database` | Delete a bundle whose extra field nobody reads |
| `fetched` | `tokenRequestResult` | Keep the subject in the name |
| `transport.ts` | `http-client.ts` | Specific beats conventional |
| `unavailableCodec` | `codecWithoutKey` | Check connotations; a chosen absence gets a neutral name |
| `position` | `cursorData` | Use the standard word, and check that it doesn't suggest a sequence number |
| `RunQueryPage` | `QueryPage` | A data type describes the data, not the call that returned it |
