# Installing 1337-skills for Codex

Enable 1337-skills in Codex via native skill discovery.

## Prerequisites

- Git

## Installation

1. **Clone the repository (if not already done):**
   ```bash
   git clone https://github.com/j10t-dev/1337-skills.git ~/.codex/1337-skills
   ```

2. **Create the skills symlink:**
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/1337-skills/skills ~/.agents/skills/1337-skills
   ```

3. **Restart Codex** to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/1337-skills
```

You should see a symlink pointing to your 1337-skills skills directory.

## Updating

```bash
cd ~/.codex/1337-skills && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/1337-skills
```

Optionally delete the clone: `rm -rf ~/.codex/1337-skills`
