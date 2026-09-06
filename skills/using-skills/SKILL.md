---
name: using-skills
description: Use when starting any conversation
---

# Using skills

If dispatched as a task-scoped subagent, stop here and execute the assignment without restarting global skill routing.

Before responding or acting, invoke skills requested by the user, matching the current action, or required by the active workflow. This includes conversational prose guidance such as `unslop`. Reuse current guidance already loaded. Reading a skill as review material does not activate its workflow; set aside a skill that proves inapplicable.

Use process skills before implementation skills. Invoke `brainstorming` before entering plan mode if brainstorming has not already occurred. Follow skills without announcing invocation. Track applicable checklists in the harness, or briefly in chat if no tracker exists.

References name this pack's skills. Use the loader's exact name and namespace, such as `1337-skills:brainstorming`; without a loader, read the discovered `SKILL.md`.

User instructions override skill defaults, including stop or change-course requests. System and harness rules still apply. Do the requested work; ask only for unsettled decisions while continuing independent work. Preserve VCS and external-action restrictions. When a rule blocks work, cite its file, quote the rule and state the decision needed.
