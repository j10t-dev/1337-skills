---
name: handling-github-pr-reviews
description: Use when user asks to review, respond to, or resolve GitHub PR comments
---

# Handling GitHub PR Reviews

Process PR review feedback: fetch → self-evaluate → iterate → fix → reply → resolve.

## Workflow

### 0. Validate Branch & PR Match

Before any PR operations, verify you're on the correct branch:

```bash
# If PR number provided, validate it matches current branch
current_branch=$(git branch --show-current)
pr_branch=$(gh pr view {N} --json headRefName -q '.headRefName')

if [[ "$current_branch" != "$pr_branch" ]]; then
    echo "ERROR: PR #{N} is for branch '$pr_branch' but you're on '$current_branch'"
    # Stop and clarify with user before proceeding
fi

# If no PR number provided, auto-detect from current branch
gh pr view --json number -q '.number'
```

**Never skip this step.** Wrong-PR errors waste significant time.

### 1. Fetch Comments

```bash
# Line comments
gh api repos/{owner}/{repo}/pulls/{N}/comments --paginate > /tmp/pr_comments.json

# Thread status (to see what's resolved)
gh api graphql -f query='{ repository(owner:"{owner}",name:"{repo}") { pullRequest(number:{N}) { reviewThreads(first:50) { nodes { id isResolved comments(first:1) { nodes { path body } } } } } } }' > /tmp/pr_threads.json
```

### 2. Extract Issues

```bash
python3 ~/.claude/skills/1337-skills/handling-github-pr-reviews/extract-pr-issues.py /tmp/pr_comments.json
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
| Validate PR branch | `gh pr view {N} --json headRefName -q '.headRefName'` |
| Auto-detect PR | `gh pr view --json number -q '.number'` |
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
