---
name: escalation
description: Use when you cannot resolve a support issue and need to escalate to engineering or other teams.
---

# Escalation

When you've hit the limit of what you can resolve from support tools alone, escalate cleanly with enough context that the next person doesn't have to redo your work.

## When to Escalate

- Bug confirmed in code, fix requires engineering judgment beyond support scope
- Active production incident affecting multiple customers
- Customer-specific deployment/infrastructure issue you don't have access to
- Question that requires product or business judgment (pricing, roadmap, security policy)
- Anything you've spent >30 minutes on with no convergence

## What NOT to Escalate

- Pure how-to questions answerable from docs
- Customer configuration errors
- Workaround-available bugs (provide the workaround, log the bug, move on)
- Cases where you just want a second opinion (ask first, escalate after if needed)

## Escalation Handoff Template

Put this in the `<internal_triage>` section so whoever picks up the case has it all in one place:

```markdown
## Escalation Required

**Why**: [1-2 sentences. What blocks you and what the next person needs.]
**Suggested owner**: [team / individual]
**Severity**: [Sev1 customer down / Sev2 broken feature / Sev3 minor]

### Known Facts

- [Fact]: [evidence — file:line or Pylon ref]

### Hypotheses

- H1: [primary] — [why you suspect it]
- H2: [alternative] — [why still plausible]

### Ruled Out

- [Path]: [why]

### Actions Taken

- [Action]: [outcome]

### Next Discriminating Action

[The single thing that would most reduce uncertainty]
```

## Customer Communication During Escalation

In `<slack_message>`, set expectations honestly without over-promising:

```
Hey [name], I want to escalate this to our engineering team — the issue looks deeper than a config tweak, and I'd rather they look at it than guess.

I'll keep you posted as we figure out the timeline. In the meantime, [workaround if any].
```

Do not promise specific timelines you don't control. "I'll keep you posted" is better than "we'll have a fix by Friday".
