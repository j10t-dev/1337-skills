#!/usr/bin/env python3
"""Extract issues from GitHub PR review comments.

Usage:
    gh api repos/{owner}/{repo}/pulls/{N}/comments --paginate | python3 extract-pr-issues.py
    python3 extract-pr-issues.py /tmp/pr_comments.json
"""

import json
import sys


def main():
    # Read from file or stdin
    if len(sys.argv) > 1:
        with open(sys.argv[1]) as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    if not data:
        print("No comments found.")
        return

    for i, c in enumerate(data, 1):
        path = c.get("path", "N/A")
        line = c.get("line") or c.get("original_line", "N/A")
        body = c.get("body", "").strip()
        comment_id = c.get("id", "N/A")

        print(f"=== ISSUE {i}/{len(data)} ===")
        print(f"File: {path}:{line}")
        print(f"ID: {comment_id}")
        print()
        # Show body (truncate if very long)
        if len(body) > 800:
            print(body[:800] + "\n[...truncated]")
        else:
            print(body)
        print()


if __name__ == "__main__":
    main()
