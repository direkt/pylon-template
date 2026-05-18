---
name: validation-recovery
description: Use when producing output that must pass validation checks on the first attempt. Explains what to check before emitting the final XML response.
---

# Validation Recovery

The final XML response is parsed by downstream tooling (or a human pasting into Slack). Missing tags, wrong order, or invalid JSON cause real friction.

## Pre-emit Checklist

Run this checklist before you write the final response. Catching these before emit is cheaper than re-running.

### Tag Order (mandatory)

The exact order, top to bottom:

1. `<internal_triage>` (always)
2. `<repro_context>` (always — valid JSON, `{}` if empty)
3. `<pr>` (only if Bug + >80% confidence)
4. `<references>` (always — or `None`)
5. `<customer_draft>` (always when responding)
6. `<slack_message>` (always — MUST be the LAST visible block)

### Per-tag Checks

- [ ] `<internal_triage>`: contains `## Summary`, `## What I Checked`, `## Working Theory / Root Cause`
- [ ] `<internal_triage>`: does NOT contain `## Next Step` (the slack_message IS the next step)
- [ ] `<repro_context>`: valid JSON only — no comments, no trailing commas, no `{...}` placeholders
- [ ] `<pr>`: present only when triage says Bug + >80% confidence; contains all 4 required sections
- [ ] `<references>`: lists ONLY sources actually opened in this run; otherwise `None`
- [ ] `<customer_draft>`: same content as `<slack_message>`; ≤120 words by default
- [ ] `<slack_message>`: starts with "Hey", has greeting + acknowledgment + answer
- [ ] Nothing visible after `</slack_message>`

### Content Checks

- [ ] All code examples in the customer's SDK language
- [ ] Every claim has a citation (`file:line` in triage; doc URL in customer-facing)
- [ ] No invented methods, env vars, or config options
- [ ] No `[ASSUMPTION]`/`[UNVERIFIED]`/`[HYPOTHESIS]` labels in customer-facing content
- [ ] No sensitive data (tokens, org IDs, emails)

## Common Failure Patterns

| Failure                                           | Fix                                                       |
| ------------------------------------------------- | --------------------------------------------------------- |
| Tag missing                                       | Add it. Even `{}` for `<repro_context>` is valid.         |
| Wrong tag order                                   | `<slack_message>` MUST be last. Move other tags above it. |
| Top-level markdown headers (`## Internal Triage`) | Use XML tags instead.                                     |
| `<repro_context>` is not valid JSON               | Strip comments, fix commas. `{}` is always safe.          |
| Empty `<references>`                              | Use `None` literally — not blank.                         |
| Trailing prose after `</slack_message>`           | Delete it.                                                |
| `<customer_draft>` and `<slack_message>` differ   | Make them identical.                                      |

## Recovery if You Catch a Failure

If you notice a violation while drafting:

1. **Don't ship the broken version.** Fix it in place.
2. **If multiple violations**, fix them in order: tag order first, then content, then citations.
3. **If you cannot fix without re-investigating**, say so honestly in `<internal_triage>` and ship the partial response with a clear note.
