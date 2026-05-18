# Pylon Historical Case Search (REQUIRED for errors/problems)

For quick command reference, use the `historical-search` skill.

When an issue looks like an **error/problem** (error messages, failures, regressions, timeouts), **search older Pylon cases** to avoid repeating investigations and to surface known workarounds/resolutions.

## When to Run This

Run for:

- Error/Bug reports
- Regressions
- Performance/timeout incidents
- "It used to work and now it doesn't"
- Repeated integration failures (SDK/API)

Optional for:

- Pure how-to questions with no failure mode

## What to Search For

Use the best available "needle":

1. **Exact error message** (verbatim)
2. A shortened/normalized variant (remove IDs/UUIDs/timestamps)
3. Key endpoint / feature name
4. Account/org name (if known) + keyword

## Search Tools

```
# Exact text match
mcp__pylon__pylon_find_case_by_text(needle="<exact error phrase>", limit=3)

# Broader keyword search
mcp__pylon__pylon_search_issues(query="<keywords>", state="closed", limit=5)

# Related issues for the same account / requester
mcp__pylon__pylon_find_related_issues(issue_id="<issue_id>", strategy="same_account", limit=10)

# Pull a specific case transcript
mcp__pylon__pylon_get_case_comments(case_number="<number>")
```

## When to Use Which

| Scenario                                    | Recommended                 |
| ------------------------------------------- | --------------------------- |
| Vague symptoms ("it's slow", "not working") | `pylon_search_issues`       |
| Exact error message                         | `pylon_find_case_by_text`   |
| Same customer / account history             | `pylon_find_related_issues` |
| Specific case number known                  | `pylon_get_case_comments`   |

## What to Extract

From older cases, capture:

- **Confirmed root cause** (avoid speculation)
- **Workaround** (if any)
- **Final resolution** (fix shipped? config change? user error?)
- **Version/release** details
- Any **required customer questions** that unblocked the case

Also record:

- What branch the older case took (bug, config, user error, docs gap, escalation)
- What was ruled out before resolution

## How It Feeds the Current Workflow

- If an older case is highly similar with a verified workaround, surface it early.
- Still verify against current code/docs before stating as fact.
- If the older case conflicts with current code/docs, downgrade it to a lead and verify the current source.
