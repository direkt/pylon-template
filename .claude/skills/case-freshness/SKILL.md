---
name: case-freshness
description: Use when understanding case data staleness, refresh behavior, and how to ensure the agent works with current data. Covers TTL, auto-refresh, and stale indicators.
---

# Case Freshness

When investigating a Pylon case, data can go stale between fetches — new messages, status changes, or external work since the last pull.

## Signals That Data May Be Stale

- The case transcript references events ("I'll get back to you", "I deployed the fix") that imply new messages should exist
- Case `state` is `waiting_on_you` but you have no recent message in the transcript
- More than a few hours have passed since auto-fetch and the case is active

## Refresh Pattern

If you suspect staleness, re-fetch:

```
mcp__pylon__pylon_get_case_comments(case_number="<num>")
```

Diff against your earlier copy — only the _new_ messages need analysis.

## Best Practices

- Fetch fresh at the start of every conversation.
- For long-running investigations spanning hours, refresh before drafting the final response.
- Treat anything more than ~24h old as suspect on an active case.
- Never reuse a cached transcript from a previous conversation without re-fetching.

## When NOT to Refresh

- Case is `closed` and you're doing historical analysis.
- You're investigating root cause in code and the customer-facing transcript isn't changing your conclusions.
