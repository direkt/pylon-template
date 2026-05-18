# Response Format Contract

This file defines the **required XML tags and structure** for support-case output.

For writing quality (tone, Slack style), see `07a-writing-quality.md`.
For PR draft templates (when bug identified), use the `pr-draft` skill.

## When This Format Applies

**Use XML-tagged output when:**

- Handling a Pylon case (case number provided)
- User asks for "customer draft", "triage", or "support response"
- Answering a support question about your product

**Skip XML format for:**

- Normal coding tasks, file edits, git operations
- General questions about this repo's structure
- Internal tooling work

## Required XML Tags

The expected order — `<slack_message>` MUST be last:

| #   | Tag                 | When Required                                                             | Purpose                                                               |
| --- | ------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | `<internal_triage>` | Always                                                                    | Analysis, root cause, investigation findings (not customer-visible)   |
| 2   | `<repro_context>`   | Always                                                                    | Machine-readable repro details as JSON (`{}` if unknown)              |
| 3   | `<pr>`              | When triage says Bug + Recommend tracker ticket Yes + bug confidence >80% | Draft bug report / code fix context (use `pr-draft` skill)            |
| 4   | `<references>`      | Always                                                                    | Exact list of sources opened in this run                              |
| 5   | `<customer_draft>`  | When responding to customer                                               | **Same content as `<slack_message>`** (kept for parser compatibility) |
| 6   | `<slack_message>`   | Always with customer_draft                                                | **LAST BLOCK.** Paste-ready message starting with "Hey [name],".      |

Nothing visible may appear after `</slack_message>`. No recap, no commentary, no "let me know". The Slack message is the deliverable.

**DO NOT** use top-level markdown headers like `## Internal Triage` — use XML tags. Do not create nested `## References` sections inside other tags. Put source citations only in the top-level `<references>` tag.

## Mode Selection

Default to (in order): **Internal Triage → Repro Context → References → Customer Draft → Slack Message**.

Add `<pr>` only when **all** of these are true:

- Triage says `Bug Classification: Bug`
- Triage says `Recommend tracker ticket: Yes`
- Bug confidence is **>80%**

If confidence is 60-80%, keep investigation findings in `<internal_triage>` and ask the customer the discriminating questions that would push you over the bar. Do not draft a fix you cannot stand behind.

## Template: internal_triage

Default template (3 sections):

```xml
<internal_triage>
## Summary
[1-2 sentences: what's broken or asked + impact]
Bug Classification: Bug | Not Bug. Recommend tracker ticket: Yes | No (only Yes when Bug + bug confidence >80%).

## What I Checked
- Pylon: [case #, key points; historical matches if relevant]
- Docs: [product/docs paths]
- Code: [product/code/file:line findings]
- Notes: [product/notes paths if checked]

## Working Theory / Root Cause
[Evidence-backed explanation, or "Not enough evidence — see questions"]
</internal_triage>
```

**Do NOT add a `## Next Step` section.** The Slack message at the bottom IS the next step.

**For complex multi-hypothesis bug investigations only**, add any of the following sections when they reflect real work done. Do not pad them on simple how-to or config cases.

- `## Active Hypotheses` — H1, H2 when more than one explanation is still plausible
- `## Actions Taken` — `[action] -> [result]` when sequenced steps need to be visible
- `## Dead Ends / Ruled-Out Paths` — paths you actually explored and ruled out
- `## Evidence -> Inference -> Next Action` — when the next step depends on a specific reading of evidence
- `## Recommended Next Steps` — numbered list when multiple discrete actions need ordering
- `## Known Facts` — verified facts with evidence

## Template: customer_draft

Write **one** concise customer-safe response inside the tag — no internal headers, no "Summary / Questions / Solution" labels, no audit-trail prose. The full style contract lives in `99-final-customer-response.md` (≤120 words by default, lead with the answer, conversational tone).

```xml
<customer_draft>
[One short paragraph leading with the answer. At most 3-5 sentences plus an optional code block (3-6 lines) when code is genuinely the fix. Optional one clarifying question at the end if it actually blocks the next step.]
</customer_draft>
```

Shape, not structure: the draft is prose, not a form.

## Template: repro_context

```xml
<repro_context>
{}
</repro_context>
```

Output valid JSON only. If you do not have enough information, use `{}`.

## Template: references

```xml
<references>
- [Exact file:line, URL, or Pylon case identifier opened in this run]
</references>
```

List only sources actually opened in this run. If you did not use tools or external sources, write `None`.

## Template: slack_message

````xml
<slack_message>
Hey [name], [brief acknowledgment].

[Direct answer first.]

[Code block if helpful:]
```
code here
```

[Follow-up answers on separate lines.]
</slack_message>
````

See `07a-writing-quality.md` for Slack message style guidelines.

## Template: pr (via skill)

When bug confidence >80%, use the `pr-draft` skill. Default structure:

```xml
<pr>
### Root Cause
### Buggy Code
### Proposed Fix
### Risk
</pr>
```

## Key Principles

### Every Claim Needs Evidence

- Internal triage: use `file:line` references from `product/code/`.
- Customer responses: prefer public doc URLs; `file:line` acceptable when helpful.
- Never make claims without verification.

### SDK-Specific Code Examples

ALL code examples MUST match the customer's SDK. Python users get Python code only. TypeScript users get TypeScript code only. If SDK unclear, ASK as first question.

## When You Can't Fully Answer

Same shape, no special template. Lead with what you confirmed, name the gap honestly in one sentence, and ask the single discriminating question that would unblock you. Avoid the "what I searched / what I couldn't find" audit trail — that belongs in `<internal_triage>`, not in front of the customer.

Anti-pattern: `## Summary / ## What I Found / ## What I Couldn't Determine / ## Questions for You / ## Next Steps` — five headers for what should be three sentences. If you cannot answer fully, the message gets shorter, not longer.
