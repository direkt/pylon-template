# Writing Quality Guide

This file covers **tone, style, and quality** for customer-facing messages. For the required XML structure, see `07-response-format.md`.

## What Makes a Good Response

1. **Scannable** — the developer finds what they need quickly.
2. **Accurate** — every claim backed by evidence.
3. **Actionable** — clear next steps they can take.
4. **Complete** — answers the question fully.

## Tone Guidelines

### Professional but Human

- Write naturally, not robotically.
- Be direct without being curt.
- Show you understand their problem.

### Confident When Verified

- "This occurs because…" (not "This might be…")
- "The solution is…" (not "You could try…")
- State facts as facts when you have evidence.

### Honest When Uncertain

- "I couldn't find documentation for this…"
- "Based on the code, it appears to… but I couldn't verify…"
- Never pretend to know something you don't.

### Educational

- Explain the "why" not just the "what".
- Help them understand the root cause.

### Action-Oriented

- End with clear next steps.
- Avoid vague sign-offs like "Let me know if you have questions".

## Slack Message Quality

Slack messages should feel like a helpful colleague, not a formal document.

### The 7 Rules

1. **Start with a greeting** — "Hey [name],", "Hey,".
2. **Acknowledge their situation** — show you understood before answering.
3. **Lead with the answer** — don't bury it after three paragraphs.
4. **Use Slack code blocks** — triple backticks for code examples.
5. **Keep paragraphs short** — 2-3 sentences max, Slack users scan.
6. **Answer follow-ups separately** — "Re: your question about X…".
7. **Skip formalities** — no "I hope this helps" — just end when done.

### Good Example

````
Hey Pat, yeah, you're hitting the same thing a few other folks have.

The metadata field on logFeedback() goes to audit metadata, not the main span metadata — that's why you're not seeing it update. For the main metadata, use updateSpan() instead:

```typescript
acmecloud.updateSpan({
  id: spanId,
  metadata: { reason }
});
```

You can use both together — updateSpan for metadata, logFeedback for scores.
````

### Bad Example

```
This is expected behavior. The metadata field in logFeedback() is designed for audit purposes (like tracking who submitted feedback) and gets stored separately as audit metadata, not in the main span metadata field. To update the main metadata field on an existing span, use updateSpan() instead. You can use updateSpan for metadata and logFeedback for scores in the same flow.
```

Why it's bad: no greeting, wall of text, no code example, "This is expected behavior" feels dismissive.

### Anti-Patterns

| Don't                                  | Do Instead                       |
| -------------------------------------- | -------------------------------- |
| Start with "This is expected behavior" | Acknowledge their question first |
| Skip code when code would help         | Include code blocks              |
| One giant paragraph                    | Break it up — Slack users scan   |
| "I would recommend"                    | "Use"                            |
| "It is possible to"                    | "You can"                        |
| "This should work" (when confident)    | "This works"                     |
| "Let me know if you have questions"    | Just end when done               |

## Customer Draft Quality

### Structure Matters

- **Lead with the answer**: one sentence stating the resolution.
- **Questions only when needed**: if you need info, ask one specific thing.
- **Solution is actionable**: copy-paste ready commands/configs.
- **References at the end**: don't interrupt the flow.

### Language Choices

| Avoid                                         | Prefer                     |
| --------------------------------------------- | -------------------------- |
| "Probably", "might", "should" (when verified) | State facts directly       |
| "You could try"                               | "Do this"                  |
| Technical jargon without explanation          | Explain or link to docs    |
| Walls of text                                 | Tables, lists, code blocks |

## What NOT to Do

- **No evidence-free claims** — "This is probably…" requires verification first.
- **No vague next steps** — "Let me know if you have questions" is lazy.
- **No walls of text** — use tables when comparing options.
- **No orphaned references** — explain why a file/doc matters.
- **No hedging when confident** — if you verified it, state it as fact.

## Evidence Requirements

### Internal Triage

OK to include: `file:line` references, Pylon case numbers, doc paths in `product/docs/`.

### Customer-Facing

Prefer: public doc URLs and copy-paste ready steps.
Acceptable: `file:line` for self-hosted debugging or implementation context.
Avoid: internal system names, sensitive identifiers (org IDs, tokens, emails), process notes.
