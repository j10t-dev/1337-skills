# Design Document Template

Use these headings in this order when presenting and writing a design. Keep them separate; add topic subheadings only within them. Scale the content to the change: a few sentences for straightforward work, up to 200–300 words where trade-offs need explanation.

```markdown
# <Feature> Design

> **Status:** Pending approval

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

This design should only contain final feature descripions and not descrine the process used to arrive at them.

`Approved` only after user approval. The body describes the problem, intended behaviour, decisions, constraints and technical rationale. State genuine technical limitations once, in the relevant section.

This document only contains final production design requirements and does not describe the process that lead up to its final form. 
The first sections describe intended behaviour and system-level decisions. The `Program Design` section describes the proposed code shape compactly enough for a reviewer to assess boundaries, interfaces, and representative execution before planning.

## Program Design

Executable changes include all four artefacts below. Keep them scenario-scoped: exclude exhaustive static call graphs, incidental framework callbacks, and unchanged plumbing.

### File-tree diff

Use `+`, `~`, and `-` for created, modified, and removed files, and state one responsibility for every affected file:

```diff
 src/resource/
+├── resource-client.ts      # Wraps resource API calls
~└── resource-route.ts       # Wires create behaviour into the route
```

Follow the repository's existing layout. Do not introduce unrelated restructuring.

### Boundary map

For each affected unit, record:

- its responsibility;
- the design decision or complexity it hides;
- public dependencies;
- owned data or state;
- side effects; and
- failure behaviour.

Use existing boundaries where possible. A new boundary must serve a requested behaviour or demonstrated defect, not merely name an execution phase. The scenario tree shows how those units collaborate.

### Key interfaces in pseudocode

Give exact names, parameter and return types, important errors, and behavioural constraints for public interfaces and consequential internal seams:

```ts
interface ResourceClient {
  create(input: CreateResourceInput): Promise<Result<Resource, CreateError>>
}
```

Omit ordinary private helpers whose shape does not affect consumers or neighbouring tasks.

### Scenario call trees

Show the shortest representative path from an entrypoint to an observable effect. For changed execution paths, show a contextual call-tree diff: retain enough unchanged calls to locate the change, mark removed calls with `-` and added calls with `+`, and show where control returns or produces an effect. Include:

- the primary production path;
- the corresponding test path when dependencies differ; and
- materially distinct error, event, or asynchronous paths.

Mark external I/O, durable side effects, and asynchronous boundaries. In call-tree notation, `→` is a synchronous call and `⇢ await` is an asynchronous boundary. When tests substitute a production dependency, name both implementations and verify that they satisfy the same interface and behavioural contract.

```diff
Production:
 HTTP PUT /resources/:slug
 └─ resourceRoute.create
-   ├─ ResourceService.create
-   │  ⇢ await ResourceStore.insert
+   ├─ ResourceApplication.create
+   │  └─ ResourceService.create
+   │     ⇢ await ResourceStore.insert
    └─ HTTP 201

Tests:
 resourceRoute.create
   → ResourceApplication.create
     → ResourceService.create
       ⇢ await InMemoryResourceStore.insert
   ← HTTP 201 response
```

## Applicability and change control

A change without executable flow still includes the `Program Design` section. Replace each inapplicable artefact with a specific explanation of why no runtime behaviour, callable interface, dependency substitution, or execution path changes. Do not invent runtime behaviour to satisfy the template.

Establish existing execution paths from repository evidence. Continue exploring or label an assumption for user approval; never fabricate a current call path.

Check the design against the user's request and agreed clarifications before approval. The approved design is then the source of truth. Material changes need user approval and affected review: moving responsibilities, changing approved file layout or public signatures, adding a dependency, or replacing a scenario call path. Planning supplies concrete implementation and test code within those boundaries. Update operative requirements, not review history.

## Author self-review

Before sharing the document, verify:

- headings and approval state follow the template, with no process narration in the body;
- every executable design includes all four programme-design artefacts;
- every proposed file has one responsibility;
- boundaries hide coherent decisions rather than execution phases;
- interface names and types agree with scenario call trees;
- production, test, and materially distinct failure or asynchronous paths are represented;
- test substitutions satisfy the production interface and behavioural contract; and
- material changes to approved layout, boundaries, interfaces, or call paths return to design revision.
