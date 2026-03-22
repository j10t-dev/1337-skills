# Codex Tool Name Mappings

When a skill references Claude Code tools, use the Codex equivalents:

| Claude Code | Codex | Notes |
|---|---|---|
| `Task` (spawn subagent) | `spawn_agent` | Requires `multi_agent = true` in config |
| `Task` result | `wait` | Wait for spawned agent to complete |
| (auto-close) | `close_agent` | Explicitly close completed agents |
| `TodoWrite` | `update_plan` | Track task progress |
| `Skill` tool | N/A | Skills load natively via `~/.agents/skills/` discovery |
| `Read`, `Write`, `Edit` | Native file tools | Same functionality, different names |
| `Bash` | Native shell tools | Same functionality |
