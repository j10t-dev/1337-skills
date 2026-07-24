---
name: brainstorming
description: Use when asked to create, add, or change any feature, component, or behaviour and no approved design exists yet - comes before writing-plans, test-driven-development, or any implementation skill
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.
</HARD-GATE>

**Announce at start:** "I'm using the brainstorming skill to refine your idea into a design."

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in manageable sections, checking after each section whether it looks right so far.

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.

## Checklist

You MUST track each of these items in the current harness's task tracker and complete them in order:

1. **Explore project context** — check files, docs, recent changes, and representative existing execution paths
2. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
3. **Propose 2-3 approaches** — with trade-offs and your recommendation
4. **Present system design** — architecture, components, data flow, errors, and testing; get user approval in sections
5. **Present programme design** — file-tree diff, boundary map, key interfaces, and scenario call trees; get user approval
6. **Write design doc** — save to `$DOCS_ROOT/$projectName/designs/<slug>.md`
7. **Design self-review** — inline check for placeholders, contradictions, ambiguity, scope, and programme-design consistency
8. **Independent review** — run the existing `requesting-pi-review` design loop
9. **User reviews written design** — ask the user to review the design file before proceeding
10. **Transition to implementation** — invoke the writing-plans skill to create the implementation plan

## Process Flow

```dot
digraph brainstorming {
    "Explore project context and execution paths" [shape=box];
    "Ask clarifying questions" [shape=box];
    "Propose 2-3 approaches" [shape=box];
    "Present system design sections" [shape=box];
    "User approves system design?" [shape=diamond];
    "Present programme design sections" [shape=box];
    "User approves programme design?" [shape=diamond];
    "Write design doc" [shape=box];
    "Design self-review\n(including programme design)" [shape=box];
    "Independent pi review" [shape=box];
    "User reviews written design?" [shape=diamond];
    "Invoke writing-plans skill" [shape=doublecircle];

    "Explore project context and execution paths" -> "Ask clarifying questions";
    "Ask clarifying questions" -> "Propose 2-3 approaches";
    "Propose 2-3 approaches" -> "Present system design sections";
    "Present system design sections" -> "User approves system design?";
    "User approves system design?" -> "Present system design sections" [label="no, revise"];
    "User approves system design?" -> "Present programme design sections" [label="yes"];
    "Present programme design sections" -> "User approves programme design?";
    "User approves programme design?" -> "Present programme design sections" [label="no, revise"];
    "User approves programme design?" -> "Write design doc" [label="yes"];
    "Write design doc" -> "Design self-review\n(including programme design)";
    "Design self-review\n(including programme design)" -> "Independent pi review";
    "Independent pi review" -> "User reviews written design?";
    "User reviews written design?" -> "Write design doc" [label="changes requested"];
    "User reviews written design?" -> "Invoke writing-plans skill" [label="approved"];
}
```

**The terminal state is invoking writing-plans.** Do NOT invoke frontend-design, mcp-builder, or any other implementation skill. The ONLY skill you invoke after brainstorming is writing-plans.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent changes)
- Before asking detailed questions, assess scope: if the request describes
  multiple independent subsystems, flag this immediately rather than refining
  details of a project that needs decomposition first.
- If the project is too large for a single spec, help the user decompose into
  sub-projects — the independent pieces, how they relate, what order to build —
  then brainstorm the first sub-project through the normal design flow. Each
  sub-project gets its own spec → plan → implementation cycle.
- Ask questions one at a time to refine the idea
- Prefer open-ended questions that include 2-4 concrete suggestions or examples to help the user respond
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria, common gotchas and footguns

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**
- Once you believe you understand what you're building, present the design
- Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

**Design for isolation and clarity:**
- Break the system into smaller units that each have one clear purpose, communicate through well-defined interfaces, and can be understood and tested independently
- For each unit, you should be able to answer: what does it do, how do you use it, and what does it depend on?
- Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers? If not, the boundaries need work.
- Smaller, well-bounded units are also easier for you to work with - you reason better about code you can hold in context at once, and your edits are more reliable when files are focused. When a file grows large, that's often a signal that it's doing too much.

## Program Design (mandatory)

Programme design follows system architecture and precedes final design approval.
Use the exact `## Program Design` heading so reviewers and planners can locate
this contract. It describes proposed code shape compactly enough for a reviewer
to assess boundaries, interfaces, and representative execution before planning.

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

Follow the repository's existing layout; this artefact does not authorise
unrelated restructuring.

### Boundary map

For each affected unit, record its responsibility, the design decision or
complexity it hides, public dependencies, owned data or state, side effects,
and failure behaviour. Justify boundaries through cohesion, information hiding,
and change locality. Boundaries hide coherent design decisions rather than
execution phases; the scenario tree only shows how independently justified
units collaborate.

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
effect. Include the primary production path, the corresponding test path when
dependencies differ, and materially distinct error, event, or asynchronous
paths. Mark external I/O, durable side effects, and asynchronous boundaries;
use diff notation when changing an existing control flow. In call-tree notation,
`→` is a synchronous call and `⇢ await` is an asynchronous boundary. When tests
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

A change without executable flow still includes the `Program Design` section.
It replaces each inapplicable artefact with a specific explanation of why no
runtime behaviour, callable interface, dependency substitution, or execution
path changes. Do not invent runtime behaviour to satisfy the template.

Material programme-design changes return to design revision and review. These
include moving responsibilities, changing approved file layout or public
signatures, adding a public dependency, or replacing an approved scenario call
path. Private helper structure and equivalent local mechanics remain planning
or implementation decisions when they preserve the approved boundaries.

**Working in existing codebases:**
- Explore the current structure before proposing changes. Follow existing patterns.
- Existing execution paths must be established from repository evidence. Continue exploration or label an assumption for user approval; never fabricate a current call path.
- Where existing code has problems that affect the work (e.g. a file that's grown too large, unclear boundaries, tangled responsibilities), include targeted improvements as part of the design - the way a good developer improves code they're working in.
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.

## After the Design

**Documentation:**
- Design and plan documents always live in an external docs repo, separate from the code repo
- `$DOCS_ROOT` is the docs repo root. Use the `DOCS_ROOT` environment variable if set; otherwise default to `~/dev/j10t-docs`
- Designs: `$DOCS_ROOT/$projectName/designs/`
- Plans: `$DOCS_ROOT/$projectName/plans/`
- Determine `$projectName` from the repo directory name unless the user specifies a different docs project name
- Determine the document slug:
  - If the current jj bookmark or change description is a good semantic identifier, you may reuse its slug
  - Otherwise ask the user for a feature/design slug
- Design file: `$DOCS_ROOT/$projectName/designs/<slug>.md`
- Create the target directory if it doesn't exist
- Write the validated design to that filename
- VCS for the docs repo is the user's responsibility. Do not run jj/git commands in `$DOCS_ROOT` unless the user explicitly asks

**Design review (before sharing with user):**
Review the design yourself before sharing it.

**Inline self-review checklist:**
- **Completeness:** Purpose, constraints, success criteria, architecture, components, data flow, error handling, and testing are covered.
- **Internal consistency:** The design does not contradict itself across sections.
- **Scope control:** The design is focused enough for one implementation plan; unrelated subsystems are split out or marked as future work.
- **Ambiguity:** Open questions are explicit; assumptions are labelled.
- **No placeholders:** Remove `TBD`, `TODO`, vague component names, and undefined references.
- **Implementation readiness:** A plan writer can turn the design into concrete tasks without session history.
- **Programme-design completeness:** Every executable design has a responsibility-labelled file-tree diff, boundary map, key interfaces, and representative scenario call trees; every exemption is specific to a change without executable flow.
- **Boundary quality:** Boundaries hide coherent design decisions rather than execution phases, and every proposed file has one stated responsibility.
- **Programme-design consistency:** Interface names and types agree with the scenario call trees; production, test, and materially distinct failure or asynchronous paths are represented; test substitutions satisfy the same interface and behavioural contract as production dependencies.
- **Planning gate:** Material changes to approved layout, boundaries, interfaces, or call paths require design revision and another review.

Fix any issues inline before sharing the design with the user. No need to re-review — just fix and move on.

**Independent review (after self-review, before sharing with user):**
- Load the `requesting-pi-review` skill and run it on the design document
  you just wrote (`type=design`, no `design-ref`).
- This handoff always runs — there is no trivial-skip path for "the design
  looks fine."
- Once that skill's loop terminates, present the resulting design to the
  user.

**User Review Gate:**
After the self-review and independent review pass, ask the user to review the written design before proceeding:

> "Design written to `<path>`. Please review it and let me know if you want to make any changes before we start writing out the implementation plan."

Wait for the user's response. If they request changes, make them and re-run the self-review. Only proceed once the user approves.

**Implementation:**
- Invoke the writing-plans skill to create the detailed implementation plan
- Do NOT invoke any other skill. writing-plans is the next step.

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions in one message
- **Open-ended with concrete suggestions** - Give 2-4 examples or likely options to make answering easier
- **Incremental validation** - Present design in sections, validate each before continuing
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Be flexible** - Go back and clarify when something doesn't make sense
