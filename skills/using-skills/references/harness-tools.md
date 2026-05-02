# Harness Tool Name Mappings

Use the current harness's native tools. Skill text should name the intent first, then the tool where the harness has one.

| Intent | Claude Code | Codex | Pi in this environment | Notes |
|---|---|---|---|---|
| Load a skill | `Skill` | native skill discovery | read discovered `SKILL.md` path | Follow the loaded skill content directly |
| Track tasks | `TodoWrite` | `update_plan` | explicit checklist if no task tool is exposed | Use a visible task tracker when available |
| Spawn subagent | `Task` | `spawn_agent` | extension-specific, if installed | Otherwise execute directly or ask for preferred delegation path |
| Wait for subagent | `Task` result | `wait` | extension-specific, if installed | Close/clean up completed agents where the harness requires it |
| Read file | `Read` | native file tool | `read` | Same intent, different names |
| Write file | `Write` | native file tool | `write` | Same intent, different names |
| Edit file | `Edit` | native file tool | `edit` | Same intent, different names |
| Run shell | `Bash` | native shell tool | `bash` | Same intent, different names |
