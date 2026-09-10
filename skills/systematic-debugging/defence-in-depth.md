# Defence-in-Depth Validation

## Overview

When invalid data has multiple independent entry paths, each entry must validate it. Use `principle-boundary-discipline` as the authority for placement: construct validated domain types at external boundaries and trust their guarantees inside.

**Core principle:** Protect distinct entry paths and live operation hazards, not repeat the same immutable-property check in every internal helper.

## Why Multiple Layers

Different responsibilities protect different failure modes:
- Every external entry path constructs the validated domain value.
- Internal business logic uses that value without redundant revalidation.
- Operation guards check mutable authorisation, destination or resource state.
- Debug logging supplies diagnostic evidence; it is not validation.

## The Four Layers

### Layer 1: Entry Point Validation
**Purpose:** Reject obviously invalid input at API boundary

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... proceed
}
```

### Layer 2: Internal Domain Code
**Purpose:** Consume the validated contract without repeating boundary checks

```typescript
function initializeWorkspace(projectDir: ValidatedDirectory, sessionId: SessionId) {
  // Boundary-owned types establish immutable input properties.
  // ... proceed without another empty-string check
}
```

A separate external importer must construct these same validated types before calling this function; an internal helper is not another trust boundary.

### Layer 3: Environment Guards
**Purpose:** Prevent dangerous operations in specific contexts

Check live facts where the operation needs them. A parsed type cannot guarantee that filesystem state or permissions have not changed. Use appropriate atomic or handle-based operations when a separate pre-check would leave a race. The prefix check below illustrates a test guard, not a complete security boundary.

```typescript
async function gitInit(directory: string) {
  // In tests, refuse git init outside temp directories
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
  // ... proceed
}
```

### Layer 4: Debug Instrumentation
**Purpose:** Capture context for forensics

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... proceed
}
```

## Applying the Pattern

When you find a bug:

1. **Trace the data flow** - Where does bad value originate? Where used?
2. **Map all checkpoints** - List every point data passes through
3. **Place checks by responsibility** - Parse each external entry; guard live operation hazards; trust validated types internally
4. **Test distinct failure modes** - Exercise affected entry paths and operation hazards, rather than asserting duplicate internal checks

## Example from Session

Bug: Empty `projectDir` caused `git init` in source code

**Data flow:**
1. Test setup → empty string
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` runs in `process.cwd()`

**Responsibilities under boundary discipline:**
- Layer 1: `Project.create()` validates not empty/exists/writable
- Layer 2: `WorkspaceManager` consumes the boundary-validated directory
- Layer 3: `WorktreeManager` refuses git init outside tmpdir in tests
- Layer 4: Stack trace logging before git init

**Historical result:** All 1847 tests passed in that investigation. This is not evidence for a new change; verify the affected behaviour.

## Red Flags

**Never:**
- Leave an independent external entry path unvalidated
- Treat a domain type as proof of mutable external state
- Add identical checks throughout internal code to compensate for an unclear boundary

**Always:**
- Parse external data into a validated domain type
- Keep operation guards tied to a distinct live hazard
- Remove redundant internal checks only after confirming the boundary guarantee
- Explain the failure each retained guard prevents

## Key Insight

Independent entry paths can bypass one adapter, and mutable state can invalidate an earlier precondition. Protect those cases explicitly. Mocks should preserve the real boundary contract; debug logging helps locate a violation.

**Validate at trust boundaries and guard live hazards.** More internal checks do not by themselves establish a stronger guarantee.
