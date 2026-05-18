---
name: incremental-investigation
description: Use when understanding how delta/follow-up investigations work after a case receives new messages.
---

# Incremental Investigation

When a case you've already analyzed receives new messages, don't reinvestigate from scratch — incrementally update what you already know.

## Two Modes

| Mode          | When                                                  | What's preserved                                                                    |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Delta**     | New messages arrived, prior investigation still valid | Ledger (hypotheses, ruled-out paths, facts) is preserved; only new info is analyzed |
| **Follow-up** | New messages contradict prior conclusions             | Re-investigate from the point of contradiction; mark refuted theories explicitly    |

## Delta Workflow

1. Re-fetch the case (per `case-freshness` skill).
2. Identify the **new** messages since your last run (by timestamp).
3. Read only the new messages with the prior context in mind.
4. Update the ledger:
   - Add new facts
   - Mark hypotheses as confirmed/refuted/still-active
   - Add new open questions
   - Identify the next discriminating action
5. Skip docs/code searches you already did unless the new info changes the relevant query.

## Follow-up Workflow

1. Same as delta, but when new info contradicts a prior conclusion:
   - Mark the contradicted conclusion as **refuted** (don't silently drop it)
   - Re-investigate from that point
   - Update the response draft to reflect the new understanding

## What to Preserve

| Item              | Action                         |
| ----------------- | ------------------------------ |
| Verified facts    | Keep, unless contradicted      |
| Active hypotheses | Re-evaluate against new info   |
| Ruled-out paths   | Keep, mark date of rule-out    |
| Dead ends         | Keep (prevents re-exploration) |
| Action log        | Append, don't restart          |

## When to Restart From Scratch

- New customer report describes a fundamentally different problem
- Case was reassigned or escalated and you lack the prior context
- More than ~2 weeks have passed and the codebase / docs likely changed

## Output

The XML response shape is the same. The `<internal_triage>` section should make it clear what changed since last analysis (e.g., add `## What's Changed Since Prior Analysis`).
