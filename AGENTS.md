# Working in 1337-skills

- Read the README section "Intentional Divergences from Upstream" before syncing anything from obra/superpowers. Update it when you add a delta.
- Load `skills/writing-for-agents/SKILL.md` before editing any skill.
- Write canonical prose in UK English without naming a harness. Put harness specifics in `adapters/<harness>/`.
- When `skills/drawing-diagrams` changes, run `bun test` in `skills/drawing-diagrams/scripts`. When `skills/statechart` changes, run `bun run test` in `skills/statechart/scripts`. Do not add test scripts for skill prose.
- Four tree rules hold; check them by reading, or with a throwaway script you do not commit:
  - Each `SKILL.md` is under 20,000 bytes.
  - `skills/` holds no `CREATION-LOG.md`, `test-*.md` or stray `*.test.ts` files.
  - No `SKILL.md` body contains a dollar sign followed by a digit.
  - Skills invoke bundled scripts by interpreter and `<skill dir>/` path, as in `bash <skill dir>/scripts/render`.
- These rules exist because Claude Code re-attaches skills after compaction and substitutes arguments into skill bodies.
- VCS is jj. Never run git. Commit only on explicit instruction.
