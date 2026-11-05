---
name: requesting-pi-review
description: Use when the user explicitly asks for a cross-harness pi review of a design or plan document, or when finishing-development or show-me-your-work asks for the cross-model review of a decision trail
---

# Requesting a pi Review

## Overview

Request a document or code review from the `pi` harness and its configured models. 

The design and plan modes run only when the user explicitly asks for a cross-harness check; the trail mode runs whenever `finishing-development` or `show-me-your-work` asks for the cross-model trail review. `brainstorming` and `writing-plans` never route here; their mandatory independent review goes to `requesting-document-review`.

## Usage

For design and plan reviews: load `requesting-document-review` and follow its loop unchanged — triage under `receiving-code-review`, the 3-round bound, convergence, and reporting all apply exactly as written. Substitute the wrapper for the reviewer dispatch:

The wrapper is not on `PATH`. Invoke it by interpreter and absolute path, from any directory:

```
sh <skill dir>/pi-review design <doc>
sh <skill dir>/pi-review plan <doc> <design-ref>
```

`design-ref` (the design doc the plan must align with) is **required** for `plan` reviews and rejected for `design` reviews.

Defaults: pi's configured model, effort `high`. Override with `--model` / `--effort`, or `PI_REVIEW_MODEL` / `PI_REVIEW_EFFORT`.

The reviewer runs with `--no-session --no-context-files --no-extensions --no-skills`: no saved session, and no project AGENTS.md/CLAUDE.md, extensions, or skills loaded — only the prompt template and the document(s) passed in shape its judgement.

For design and plan reviews: if the wrapper exits non-zero, or its output contains no Status block, that is a failed invocation to diagnose and retry — it is not a review round and consumes nothing from the 3-round bound. Stop after 2 consecutive failed invocations and report the failure plainly.

## Trail reviews

From any directory, run `sh <skill dir>/pi-review trail <log-path> <transcript-path> <run-id>` with absolute file paths. The wrapper prints `reviewed by <provider>/<model>` followed by pi's response beginning `Attention`. The default effort is `low` for trail reviews. Validation and retry follow `show-me-your-work`, not the document-review loop.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reaching for this skill during brainstorming or writing-plans | Those use `requesting-document-review` and a native subagent |
| Re-deriving the loop here | The loop lives in `requesting-document-review`; this skill only swaps the reviewer |
| Treating a failed invocation as a review round | Diagnose and retry; stop after 2 consecutive failures |
| Treating a trail response without a Status block as a failure | A trail review returns an Attention block; `show-me-your-work` owns its validation |
