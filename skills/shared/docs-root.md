# Documentation paths

Designs and plans live in an external documentation repository, separate from the code repository.

- Resolve `$DOCS_ROOT` from the `DOCS_ROOT` environment variable, or the default in the active instructions. If neither defines it, ask the user. Never guess or fall back to storing these documents in the code repository.
- Derive `$projectName` from the target repository's directory name unless the user specifies a different docs project.
- Use the user-provided feature slug. Otherwise use a suitable current jj bookmark or change description, or ask for a slug.
- Expand variables and `~` to absolute paths before using them in file-tool calls or subagent prompts. Recipients must not need the caller's environment to resolve a path.

Document locations:

- Design: `$DOCS_ROOT/$projectName/designs/<slug>.md`
- Plan: `$DOCS_ROOT/$projectName/plans/<slug>.md`

When writing a document, create its target directory if needed.
