---
name: handling-github-pr-reviews
description: Use when user asks to review, respond to, or resolve GitHub PR comments
---

# Handling GitHub PR Reviews

Process PR review feedback: fetch → self-evaluate → iterate → fix → reply → resolve.

## Workflow

### 0. Validate PR and Local Workspace

Before any PR operations, verify the PR number and local workspace are correct.

```bash
# If PR number provided, inspect its head ref
gh pr view {N} --json number,headRefName,headRepositoryOwner,title,state

# If no PR number provided, ask the user for the PR number.
# Do not infer from ambient repository state.
```

Confirm with the user before editing if:
- the PR head ref does not correspond to the jj bookmark/change stack you are working on;
- the local workspace has unrelated changes;
- multiple plausible PRs could match.

**Never skip this step.** Wrong-PR errors waste significant time.

### 1. Fetch Comments

```bash
# Line comments
gh api repos/{owner}/{repo}/pulls/{N}/comments --paginate > /tmp/pr_comments.json

# Thread status (to see what's resolved)
gh api graphql -f query='{ repository(owner:"{owner}",name:"{repo}") { pullRequest(number:{N}) { reviewThreads(first:50) { nodes { id isResolved comments(first:1) { nodes { path body } } } } } } }' > /tmp/pr_threads.json
```

### 2. Extract Issues

Use `extract-pr-issues.py` (in this skill's directory) to parse comments:

```bash
python3 extract-pr-issues.py /tmp/pr_comments.json
# Or pipe directly:
gh api repos/{owner}/{repo}/pulls/{N}/comments --paginate | python3 extract-pr-issues.py
```

### 3. Self-Evaluate Each Comment

For each comment, before presenting to user:

1. **Read the code context** - fetch the relevant file/lines
2. **Evaluate against four criteria:**
   - Technically correct? Is the reviewer right?
   - Applies here? Does it affect this specific code?
   - Fits patterns? Conflicts with codebase conventions?
   - Worth it? YAGNI / complexity tradeoff
3. **Present recommendation with brief reasoning**
4. **Wait for natural response** (no formal prompt)

**Example output:**

```text
**File: src/api/client.ts:42**
> "Should handle null case here"

**Recommend: Fix** - Correct, this will throw on empty response.
Doesn't conflict with patterns, simple one-line fix.
```

### 4. Implement (if fixing)

Make the fix as agreed with user.

### 5. Reply to Thread

Reply in the inline review thread. Do not post a top-level PR comment for inline review feedback.

Add a brief reply explaining the action:
- "Implemented"
- "Added null check"
- "Skipping - this pattern is intentional for backwards compat"
- "Won't fix - unused code path, removing instead"

```bash
gh api repos/{owner}/{repo}/pulls/{N}/comments/{comment_id}/replies -f body="..."
```

### 6. Resolve Thread

```bash
gh api graphql -f query='mutation { resolveReviewThread(input: {threadId: "{THREAD_ID}"}) { thread { isResolved } } }'
```

Repeat steps 3-6 for each comment. No summary comment at the end.

## Quick Reference

| Task | Command |
|------|---------|
| Inspect PR head | `gh pr view {N} --json number,headRefName,headRepositoryOwner,title,state` |
| Confirm local stack | Use jj status/log commands appropriate to the repository |
| Missing PR number | Ask the user; do not infer from ambient repository state |
| Line comments | `gh api repos/{o}/{r}/pulls/{N}/comments --paginate` |
| Reply to comment | `gh api repos/{o}/{r}/pulls/{N}/comments/{id}/replies -f body="..."` |
| Resolve thread | GraphQL `resolveReviewThread` mutation |
| Check unresolved | GraphQL `reviewThreads` with `isResolved` |

## Evaluation Criteria

| Criterion | Question |
|-----------|----------|
| Technically correct | Is the reviewer right about the issue? |
| Applies here | Does it actually affect this specific code? |
| Fits patterns | Does it conflict with existing codebase conventions? |
| Worth it | YAGNI / complexity tradeoff |
