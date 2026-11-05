# Session transcripts

A skill reads the section for the harness it is running in; no canonical skill names one.

## Claude Code

- Root: `$CLAUDE_CONFIG_DIR/projects`, defaulting to `~/.claude/projects` when the variable is unset.
- Project directory: replace each `/` and `.` in the working directory with `-`. `/home/haxkie/.agents/1337-skills` becomes `-home-haxkie--agents-1337-skills`.
- Candidates: top-level `<id>.jsonl` files only. Exclude `<id>/subagents/*.jsonl` and files whose first user message has `isSidechain: true`.
- Opening prompt: the first line's `content` when its type is `queue-operation`; otherwise the text of the first `user` message.
- Session id: basename without `.jsonl`.
- Id to path: `<root>/<project directory>/<id>.jsonl`.

## pi

- Root: `~/.pi/agent/sessions`.
- Project directory: `--`, the working directory's path components joined with single `-`, then `--`. Keep dots. `/home/haxkie/dev/index-sync` becomes `--home-haxkie-dev-index-sync--`; `/home/haxkie` becomes `--home-haxkie--`; `/home/haxkie/.agents/1337-skills` becomes `--home-haxkie-.agents-1337-skills--`.
- Candidates: top-level `<timestamp>_<id>.jsonl` only. Exclude subdirectories such as `slavish/<id>/`. The first line is a `session` record whose `cwd` identifies the working directory.
- Opening prompt: the first `message` event whose message role is `user`.
- Session id: the `<id>` after the timestamp's underscore.
- Id to path: `<root>/<project directory>/*_<id>.jsonl`.

## Codex

- Root: `$CODEX_HOME/sessions/<yyyy>/<mm>/<dd>/`, defaulting to `~/.codex/sessions/<yyyy>/<mm>/<dd>/` when unset.
- Candidates: `rollout-*.jsonl` whose first line has type `session_meta`, `payload.cwd` equal to the working directory, and `payload.parent_thread_id` null or absent. Subagent rollouts carry a parent id and are excluded.
- Opening prompt: concatenate the text content of the first `response_item` whose `payload.type` is `message` and `payload.role` is `user`, skipping injected context: trimmed text beginning with `<`, `# AGENTS.md instructions for `, `Context handoff (full_thread_summary):`, or `[Historical user;`.
- Session id: the trailing id after `rollout-<timestamp>-` in the basename, without `.jsonl`.
- Id to path: `<root>/*/*/*/rollout-*-<id>.jsonl`, with `<root>` here meaning the configured `sessions` directory.

## Selection and reuse

The active session is the newest candidate whose opening prompt, trimmed, is a prefix of or equal to the active session's first live user request, trimmed, excluding the injected context listed above. Harnesses may expand slash commands or append attachments after the typed text. Read candidate metadata and opening prompts only; avoid unrelated conversation bodies.

Look up the session once, when writing the first trail row. Keep its id and absolute transcript path in working context. Later turns, compaction and harness resume use the id-to-path rule instead of repeating the opening-prompt lookup. Strip a run suffix such as `-2` or `-3` before resolving the session id; keep the native session id intact. If the log already contains the session id and the controller has lost its run id, take the next unused suffix.

When no candidate matches, `reflect` stops and says so; a trail run uses the label `<yyyy-mm-dd>-<request slug>-<uuid>` with a fresh random UUID from `uuidgen --random` for each new run, and its hand-back records that the audit and review were unavailable. Treat an unlisted harness the same way rather than guessing its transcript layout.
