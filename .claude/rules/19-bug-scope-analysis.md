# Bug Scope Analysis

When a bug is confirmed or suspected, perform a structured scope analysis to identify the root cause, understand the blast radius, and propose a concrete fix before recommending a tracker ticket or producing a PR draft.

## When to Run This

Run the full scope analysis when:

- An error or unexpected behavior is confirmed in the codebase (bug confidence >60%)
- A customer reports a regression and you need to trace what changed
- You are about to produce a `<pr>` section

Skip when:

- The issue is user/config error
- It's a pure how-to question
- You haven't yet confirmed the bug exists in the code

## Analysis Steps

### Step 1: Reproduce the Symptom in Code

Anchor the bug to a concrete code location before tracing.

1. Search for the exact error message or behavior:
   ```
   Grep(pattern="<exact error text>", path="product/code/", output_mode="content", -C=5)
   ```
2. Find the entry point (API route, SDK method, UI action) that triggers it.
3. `Read` the file — don't summarize from search results alone.

### Step 2: Trace the Code Path

Follow execution from the entry point to where the failure occurs:

1. **Entry point** → route handler, SDK method, UI action
2. **Processing layer** → business logic, validation, transformations
3. **Data layer** → database queries, storage reads, SDK calls to external APIs
4. **Failure point** → where the error is thrown or incorrect behavior occurs

At each step, note the `file:line` and what the code is doing. Do NOT skip to the failure.

**Example trace:**

```
Entry:     product/code/api/src/api.ts:312          → POST /v1/experiment/log
  ↓
Logic:     product/code/api/src/logger.ts:89        → validateAndBatch()
  ↓
Storage:   product/code/storage/src/insert.ts:201   → insertRows()
  ↓
Failure:   product/code/storage/src/insert.ts:234   → throws "Row too large"
```

### Step 3: Identify the Root Cause

| Question                          | What to look for                                                      |
| --------------------------------- | --------------------------------------------------------------------- |
| **What assumption is violated?**  | A value expected to be non-null, within a range, or a certain type    |
| **What edge case isn't handled?** | Input outside what the code was written to handle                     |
| **What changed recently?**        | Dependency update, config change, or refactor                         |
| **What's missing?**               | Validation, fallback, or error handling that should exist but doesn't |

State the root cause as a single sentence:

> "The bug occurs because [code at file:line] assumes [X] but [Y happens instead], causing [failure]."

Before making any exclusionary claim (e.g., "the bug is in A, not B"), apply rule 01 and rule 17 — read the full type/enum definition and search for counterexamples.

### Step 4: Assess Blast Radius

| Dimension          | Questions to answer                                       |
| ------------------ | --------------------------------------------------------- |
| **Scope**          | Shared utility with many callers, or a specific endpoint? |
| **Frequency**      | Always fails, or only under specific conditions?          |
| **Customers**      | All users, a specific tier, or only self-hosted?          |
| **Data integrity** | Silent data corruption, or loud failure?                  |
| **Workarounds**    | Can users avoid it? How?                                  |

### Step 5: Propose a Fix

Suggest a concrete fix — not a vague direction. Include:

1. **What to change** — the specific function, condition, or block
2. **Where** — `file:line` reference
3. **How** — a before/after code snippet
4. **Why it's correct** — brief explanation
5. **What to test** — the specific scenario that should now work

**Example:**

```typescript
// product/code/storage/src/insert.ts:201 (before)
if (row.size > MAX_ROW_BYTES) {
  throw new Error("Row too large");
}

// Proposed fix: truncate metadata instead of throwing, matching behavior
// elsewhere in the codebase (see product/code/storage/src/update.ts:145)
if (row.size > MAX_ROW_BYTES) {
  row.metadata = truncateMetadata(row.metadata, MAX_ROW_BYTES - baseSize);
}
```

If you cannot determine a safe fix, say so and explain what additional context is needed.

### Step 6: Check for Related Issues

```
Grep(pattern="<shared function or variable name>", path="product/code/")
mcp__pylon__pylon_find_case_by_text(needle="<keywords>", limit=5)
```

This prevents filing an isolated bug when it's actually part of a larger systemic issue.

## Output

Do NOT write any local files. Put all findings inline in the `<internal_triage>` and `<pr>` sections per `07-response-format.md` and the `pr-draft` skill.

## Anti-Patterns

- **Don't stop at the error message** — trace back to understand _why_ it's thrown.
- **Don't suggest vague fixes** ("add better error handling") — be specific.
- **Don't skip blast radius** — a fix that breaks 10 other callers is worse than the original bug.
- **Don't assume the fix is safe** — if the function has many callers, check them.
- **Don't propose a fix you haven't verified against the code**.
- **Don't write local files**.
