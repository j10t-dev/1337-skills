# Design Document Template

Use this structure when presenting and writing a design. Scale each section to
the change: a few sentences for straightforward work, up to 200–300 words where
trade-offs need explanation. Merge adjacent sections when that improves clarity,
but retain the exact `## Program Design` heading.

```markdown
# <Feature> Design

## Purpose

## Constraints

## Success Criteria

## Architecture

## Components and Boundaries

## Data Flow

## Error Handling

## Testing

## Program Design

### File-tree diff

### Boundary map

### Key interfaces in pseudocode

### Scenario call trees
```

The first sections describe intended behaviour and system-level decisions. The
`Program Design` section describes the proposed code shape compactly enough for
a reviewer to assess boundaries, interfaces, and representative execution before
planning.

## Program Design

Executable changes include all four artefacts below. Keep them scenario-scoped:
exclude exhaustive static call graphs, incidental framework callbacks, and
unchanged plumbing.

### File-tree diff

Use `+`, `~`, and `-` for created, modified, and removed files, and state one
responsibility for every affected file:

```diff
 src/resource/
+├── resource-client.ts      # Wraps resource API calls
~└── resource-route.ts       # Wires create behaviour into the route
```

Follow the repository's existing layout. Do not introduce unrelated
restructuring.

### Boundary map

For each affected unit, record:

- its responsibility;
- the design decision or complexity it hides;
- public dependencies;
- owned data or state;
- side effects; and
- failure behaviour.

Justify boundaries through cohesion, information hiding, and change locality.
Boundaries hide coherent design decisions rather than execution phases; the
scenario tree only shows how independently justified units collaborate.

### Key interfaces in pseudocode

Give exact names, parameter and return types, important errors, and behavioural
constraints for public interfaces and consequential internal seams:

```ts
interface ResourceClient {
  create(input: CreateResourceInput): Promise<Result<Resource, CreateError>>
}
```

Omit ordinary private helpers whose shape does not affect consumers or
neighbouring tasks.

### Scenario call trees

Show the shortest representative path from an entrypoint to an observable
effect. Include:

- the primary production path;
- the corresponding test path when dependencies differ; and
- materially distinct error, event, or asynchronous paths.

Mark external I/O, durable side effects, and asynchronous boundaries. Use diff
notation when changing an existing control flow. In call-tree notation, `→` is
a synchronous call and `⇢ await` is an asynchronous boundary. When tests
substitute a production dependency, name both implementations and verify that
they satisfy the same interface and behavioural contract.

```text
Production:
HTTP PUT /resources/:slug
  → resourceRoute.create
    → ResourceService.create
      ⇢ await ResourceStore.insert
    ← Resource
  ← HTTP 201

Tests:
resourceRoute.create
  → ResourceService.create
    ⇢ await InMemoryResourceStore.insert
  ← HTTP 201 response
```

## Applicability and change control

A change without executable flow still includes the `Program Design` section.
Replace each inapplicable artefact with a specific explanation of why no runtime
behaviour, callable interface, dependency substitution, or execution path
changes. Do not invent runtime behaviour to satisfy the template.

Establish existing execution paths from repository evidence. Continue exploring
or label an assumption for user approval; never fabricate a current call path.

Material programme-design changes return to design revision and review. These
include moving responsibilities, changing approved file layout or public
signatures, adding a public dependency, or replacing an approved scenario call
path. Private helper structure and equivalent local mechanics remain planning
or implementation decisions when they preserve approved boundaries.

## Author self-review

Before sharing the document, verify:

- every executable design includes all four programme-design artefacts;
- every proposed file has one responsibility;
- boundaries hide coherent decisions rather than execution phases;
- interface names and types agree with scenario call trees;
- production, test, and materially distinct failure or asynchronous paths are represented;
- test substitutions satisfy the production interface and behavioural contract; and
- material changes to approved layout, boundaries, interfaces, or call paths return to design revision.
