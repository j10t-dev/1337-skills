---
name: requesting-pi-review
description: Use when the user explicitly asks for a cross-harness pi review of a design or implementation-plan document
---

# Requesting a pi Review

## Overview

Claude-only adapter. It substitutes `pi` — a different harness, in a fresh
context — for the native reviewer subagent that `requesting-document-review`
would otherwise dispatch.

This skill runs **only** when the user explicitly asks for a cross-harness
check. `brainstorming` and `writing-plans` never route here; their mandatory
independent review goes to `requesting-document-review`.

## Usage

Load `requesting-document-review` and follow its loop unchanged — triage under
`receiving-code-review`, the 3-round bound, convergence, and reporting all
apply exactly as written. Substitute the wrapper for the reviewer dispatch:

The wrapper is not on `PATH`. Invoke it by its canonical absolute path:

```
~/.claude/skills/requesting-pi-review/pi-review design <doc>
~/.claude/skills/requesting-pi-review/pi-review plan <doc> <design-ref>
```

`design-ref` (the design doc the plan must align with) is **required** for
`plan` reviews and rejected for `design` reviews.

Defaults: pi's configured model, effort `high`. Override with `--model` /
`--effort`, or `PI_REVIEW_MODEL` / `PI_REVIEW_EFFORT`.

The reviewer runs with `--no-session --no-context-files --no-extensions
--no-skills`: no saved session, and no project AGENTS.md/CLAUDE.md,
extensions, or skills loaded — only the prompt template and the document(s)
passed in shape its judgement.

If the wrapper exits non-zero, or its output contains no Status block, that is
a failed invocation to diagnose and retry — it is not a review round and
consumes nothing from the 3-round bound. Stop after 2 consecutive failed
invocations and report the failure plainly.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reaching for this skill during brainstorming or writing-plans | Those use `requesting-document-review` and a native subagent |
| Re-deriving the loop here | The loop lives in `requesting-document-review`; this skill only swaps the reviewer |
| Treating a failed invocation as a review round | Diagnose and retry; stop after 2 consecutive failures |
