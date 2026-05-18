---
name: repro-strategy
description: Use when understanding how to capture and interpret reproduction information for a bug.
---

# Reproduction Strategy

A clear repro is the fastest path to a fix. The `<repro_context>` JSON block captures structured repro details for downstream automation or human verification.

## When Repro Matters

| Issue Type            | Repro priority                            |
| --------------------- | ----------------------------------------- |
| Bug / regression      | HIGH                                      |
| Performance / timeout | HIGH                                      |
| Config / setup        | MEDIUM (often configuration is the repro) |
| How-to                | LOW (no repro needed)                     |
| User error            | LOW                                       |

## What Goes in `<repro_context>`

Output valid JSON only. Use `{}` if no repro details are available.

```json
{
  "sdk": "your-sdk-py@1.2.3",
  "runtime": "python 3.11",
  "deployment": "hosted",
  "steps": [
    "Create a new project",
    "Call client.foo({...})",
    "Observe 500 response"
  ],
  "expected": "200 with foo_id",
  "actual": "500 with \"unknown field 'bar'\"",
  "request_id": "req_abc123",
  "first_seen": "2026-04-12T14:00:00Z"
}
```

Suggested keys (use what applies):

| Key             | Meaning                                |
| --------------- | -------------------------------------- |
| `sdk`           | SDK name + version                     |
| `runtime`       | Language runtime + version             |
| `deployment`    | hosted / self-hosted / cloud name      |
| `steps`         | ordered list of actions to reproduce   |
| `expected`      | what should happen                     |
| `actual`        | what does happen                       |
| `error_message` | verbatim error string (no PII)         |
| `request_id`    | server-side ID for log correlation     |
| `first_seen`    | ISO 8601 timestamp of first occurrence |
| `frequency`     | "always" / "intermittent" / "rare"     |
| `affected_orgs` | count, if known                        |
| `code_attached` | true if customer attached a script     |

## When to Ask vs. Infer

| Have                         | Action                                             |
| ---------------------------- | -------------------------------------------------- |
| Customer attached a script   | Use the script as the repro (don't ask)            |
| Stack trace + clear endpoint | Infer steps from the trace                         |
| Vague "it doesn't work"      | Ask one specific question to get the missing piece |

Never put `{}` and then add a TODO comment — that's lying about completeness.

## Interpreting Repro

If the repro is clean (deterministic, minimal, in customer's actual SDK), engineering can act on it directly. If it's not clean, the responder should:

- Acknowledge what's clear
- Ask for the specific missing piece (one question)
- Suggest a minimal repro the customer could share
