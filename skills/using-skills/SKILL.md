---
name: using-skills
description: Use when starting any conversation
---

<SUBAGENT-STOP>
If you were dispatched as a subagent for a specific task (implementation, review, etc.), STOP HERE. Do not activate the skill workflow. Execute your assigned task directly.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
Invoke a skill when the user requests it, its description matches the current action, or the active workflow explicitly requires it. Reading a skill as review material does not activate its workflow.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalise your way out of this.
</EXTREMELY-IMPORTANT>

## The Rule

**Invoke relevant or requested skills BEFORE any response or action** — including clarifying questions, exploring the codebase, or checking files. If an invoked skill turns out wrong for the situation, you don't have to use it.

**Before entering plan mode:** if you haven't already brainstormed, invoke the brainstorming skill first.

Follow the skill without announcing its invocation. Track its checklist in the harness, or briefly in chat if no tracker exists.

Skill references belong to this pack. Use the loader's exact name, including its namespace, e.g. `1337-skills:brainstorming`. Without a loader, read the discovered `SKILL.md`.

## Skill Priority

When multiple skills apply, process skills come first — they set the approach, then implementation skills (frontend-design, etc.) carry it out. Brainstorming and systematic-debugging are the most common process skills, but the rule holds for any of them.

- "Let's build X" → brainstorming first, then implementation skills.
- "Fix this bug" → systematic-debugging first, then domain skills.

## Red Flags

These thoughts mean STOP—you're rationalising:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check repo/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Invoke current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## User Instructions

User instructions override skill defaults, including instructions to stop or change course. System and harness rules still apply.

Do the requested work. Ask for decisions the requirements do not settle; continue independent work. Keep the user's VCS and external-action restrictions.

When a rule blocks work, cite its file, quote the rule and state the decision needed.
