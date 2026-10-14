---
name: using-skills
description: Use when starting any conversation
---

# Using skills

If dispatched as a task-scoped subagent, follow the assignment and its named skills without restarting global skill routing.

Before responding or acting, invoke skills requested by the user, matching the current action, or required by the active workflow. This includes conversational prose guidance such as `unslop`. Reuse current guidance already loaded. Reading a skill as review material does not activate its workflow; set aside a skill that proves inapplicable.

Use process skills before implementation skills. Invoke `brainstorming` before entering plan mode if brainstorming has not already occurred. Follow skills without announcing invocation. Track applicable checklists in the harness, or briefly in chat if no tracker exists, unless the active skill specifies a durable progress file.

## Code principles

Before making or reviewing code decisions, map the task's concerns to the applicable principles:

| Concern | Skill |
|---------|-------|
| Code structure, naming, responsibilities or abstraction cost | `principle-reader-first-code` |
| Boundary parsing, validation, error handling or external adapters | `principle-boundary-discipline` |
| Domain models, type contracts or type-related correctness | `principle-type-system-discipline` |

Read each selected skill before applying it. Reuse loaded guidance. Select by the decisions involved, not merely the language or file extension; read-only investigation alone does not trigger this mapping. Revisit the selection when the task exposes another concern.

For each selected principle, identify the task-specific decision it bears on. Keep this in existing task context; no separate document or invocation announcement is required.

When explaining consequential code choices in your reply, name each principle that shaped a decision and the specific choice it changed. Cite only principles whose leaf SKILL.md you read this session. Routine edits need only their normal summary; do not add a compulsory principles section.

Principles guide work within the approved requirements and scope. Surface conflicts rather than silently changing an approved design or broadening the task.

## Harness and authority

If temporary files are useful, use `/tmp`.

References name this pack's skills. Use the loader's exact name and namespace, such as `1337-skills:brainstorming`; without a loader, read the discovered `SKILL.md`.

User instructions override skill defaults, including stop or change-course requests. System and harness rules still apply. Do the requested work; ask only for unsettled decisions while continuing independent work. Preserve VCS and external-action restrictions. When a rule blocks work, cite its file, quote the rule and state the decision needed.
