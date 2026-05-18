---
name: historical-search
description: Search historical Pylon cases for prior resolutions and workarounds.
---

# Historical Search

Search older Pylon cases when investigating errors, regressions, or repeated issues. Prior resolutions often save investigation time.

## Decision Tree

```
Issue is error/bug/regression/perf? → SEARCH
Issue is pure how-to with clear docs answer? → SKIP
Customer has a long Pylon history? → Add same-account search
```

## Tool Selection

| Scenario                   | Tool                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| Exact error message        | `mcp__pylon__pylon_find_case_by_text`                               |
| Vague symptoms             | `mcp__pylon__pylon_search_issues`                                   |
| Same customer / account    | `mcp__pylon__pylon_find_related_issues` (strategy=`same_account`)   |
| Same requester             | `mcp__pylon__pylon_find_related_issues` (strategy=`same_requester`) |
| Specific case number known | `mcp__pylon__pylon_get_case_comments`                               |

## Query Construction

| Needle Type        | Example                                                |
| ------------------ | ------------------------------------------------------ |
| Exact error string | `"Cannot read properties of undefined (reading 'id')"` |
| Normalized error   | strip IDs/UUIDs/timestamps from the customer's error   |
| Feature + symptom  | `oauth login redirect_uri mismatch`                    |
| Account + keyword  | `acme-corp timeout`                                    |

## What to Extract

For each promising match:

- **Confirmed root cause** (avoid speculation)
- **Workaround** (if any)
- **Final resolution** (fix shipped? config change? user error?)
- **Version/release** details
- **What customer questions unblocked the case**

## What to Do With Findings

- **Very similar case with verified fix**: surface it early, verify the fix still applies.
- **Similar case but conflicts with current code/docs**: treat it as a lead, not a conclusion. Verify against the current source.
- **No matches**: continue investigation; don't claim "this is a known bug" without evidence.

## Anti-Patterns

- Quoting historical cases verbatim in customer-facing reply (use the lesson, not the citation)
- Trusting a 2-year-old case as current behavior without re-verifying
- Searching only by customer name and missing better matches by error text
