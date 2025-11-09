#!/usr/bin/env bash
# SessionStart hook for 1337-skills plugin

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Read using-skills content
using_skills_content=$(cat "${PLUGIN_ROOT}/skills/using-skills/SKILL.md" 2>&1 || echo "Error reading using-skills skill")

# Escape outputs for JSON
using_skills_escaped=$(echo "$using_skills_content" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')

# Output context injection as JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>\nYou have 1337-skills.\n\n**Below is the full content of your '1337-skills:using-skills' skill - your introduction to using skills. For all other skills, use the 'Skill' tool:**\n\n${using_skills_escaped}\n\n</EXTREMELY_IMPORTANT>"
  }
}
EOF

exit 0
