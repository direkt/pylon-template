---
name: kb-strategy
description: Use when deciding whether to create a Knowledge Base article from a resolved support case.
---

# KB Article Strategy

Not every resolved case deserves a KB article. Low-quality articles dilute search results and waste reader time.

## Decision Criteria

Create an article when **all** are true:

- [ ] **Generalizable**: applies to multiple potential customers, not one specific deployment
- [ ] **Resolved**: you have a verified solution, not a workaround for an open bug (workarounds get articles only when the bug is unlikely to be fixed soon)
- [ ] **Searchable**: customers will Google or grep for the symptom — the title can be the search term
- [ ] **Not already documented**: a doc search did NOT surface this answer cleanly
- [ ] **Likely to recur**: the issue category is common enough that someone else will hit it

## Skip the Article When

- The issue is a one-off customer config error specific to their environment
- The fix was already documented but the customer didn't find it (improve docs/SEO instead)
- The resolution was "customer reproduced it themselves and figured it out"
- The case was escalated and resolved by engineering with no support-actionable lesson
- You're not confident enough in the explanation to publish it externally

## Quality Bar Before Publishing

- Title is the customer's likely search query, not your internal label
- Steps work standalone (no "see prior case" references)
- Code examples verified per rule 17
- Tone is impersonal — no customer names, no case numbers

## Recommend, Don't Create

The agent should recommend creating a KB article in `<internal_triage>` (so a human reviewer decides):

```
## KB Article Recommendation
**Recommend**: Yes
**Title**: "[suggested title]"
**Why**: [one sentence — what gap this fills]
```

Use the `create-kb-article` skill for the template if the recommendation is approved.
