# Final Customer Response (REQUIRED — LAST RULE)

## TL;DR — the rule that overrides everything else

**The LAST visible block in your response MUST be `<slack_message>` containing a Slack-paste-ready message.** That is what the user scrolls to and copies. Everything else is reference material above it.

Hard requirements on that final block:

1. **`<slack_message>` is the final XML tag.** Order: `<internal_triage>` → `<repro_context>` → `<references>` → `<customer_draft>` → `<slack_message>`. Nothing visible after `</slack_message>`.
2. **Open with a conversational greeting.** Start with `Hey [name],` / `Hey,` / `Hey [name], yeah,` / `Hey [name], short answer,` — never with "The pattern…", "Regarding…", "This is…".
3. **`<customer_draft>` content is identical to `<slack_message>` content.** Don't write a longer, more-formal version for one and a casual version for the other. Same words. The two tags exist for parser compatibility.
4. **No commentary AFTER `</slack_message>`.** No "let me know if you want me to file this", no recap. The Slack message is the deliverable; the response ends.
5. **Do NOT add a `## Next Step` section to `<internal_triage>`.** The Slack message at the bottom IS the next step — narrating "Send the Slack message below" is circular noise. Only use `## Recommended Next Steps` (numbered list) when multi-step coordination beyond the Slack message is genuinely needed.

If you cannot produce a paste-ready `slack_message`, the response is not complete.

## When This Rule Applies

This rule applies **only when doing support-case work** (a Pylon case is in play). For normal coding tasks, file edits, git operations, or internal tooling work — skip the XML structure entirely.

## Customer-safe content rules

- **Every claim needs evidence.** Back up all statements with verification.
- **Prefer public doc URLs** and copy-pastable steps when available.
- **`file:line` references are acceptable** when they help the customer:
  - Self-hosted deployments where customers have codebase access
  - Understanding implementation details for debugging
- **Avoid sensitive data**: no org IDs, user emails, API keys, tokens, raw log URLs.
- **Internal tracking identifiers**: avoid Pylon case numbers and internal channels in customer-facing content.

## Length (hard limits)

- **Default: ≤120 words in `<customer_draft>`, ≤80 words in `<slack_message>`.** Exceed only when complexity genuinely requires it: multi-part question, debugging walkthrough, or bug-fix with code steps. If you cannot justify each sentence, cut it.
- 3-5 short sentences is normal. Plus at most one tiny code snippet (3-6 lines) when code is genuinely the answer.
- Paragraphs: 1-2 sentences each. Usually 2 paragraphs total, occasionally 3.
- Questions: one max at the end, only if it actually blocks the next step. No double questions.
- No headers, no bullet lists, no tables, no "Summary / Why / Solution" labels inside the draft. Just sentences.

## What to include

- The recommendation or answer, stated directly in the first sentence.
- The single most useful pointer (a doc link, an SDK method name, or a 3-6 line snippet) if it helps them act.
- A short closing question only if needed.

## What to leave out

- Internal architecture explanations (infra details, runtime numbers, package sizes). Customers don't need our reasoning to act.
- Justification chains. State the recommendation and trust it.
- Multiple options (Solution 1, Solution 2, Solution 3). Pick the one you would actually recommend and send only that.
- Multi-part questions. One question, or none.
- Recaps of what the customer asked.
- Audit-trail prose ("I searched X and found Y at file:line"). That belongs in `<internal_triage>`.

## Tone

- **Greeting is mandatory.** First word must be "Hey" (use customer's first name when known: "Hey Sam,"). Otherwise: "Hey,".
- **One-line acknowledgment, then immediately into the technical answer.** No empathy filler. Never write "I hear you", "this is a real workflow regression", "great question". The acknowledgment is implicit in answering specifically.
- **Commit, don't ask.** When you're going to track / file / follow up on something, say "I'm going to track this internally" — do not say "Want me to file a ticket?". The customer shouldn't have to grant permission for you to do internal work. The exception: if you genuinely need their input ("which SDK are you on?"), ask one specific question.
- **Specificity is voice.** Name the actual credentials, resource names, error codes, and field names from the case. Abstract language reads as not-paying-attention.
- **Closer with reasoning.** When you commit to tracking something, give a one-sentence WHY.

## Canonical example (study this shape)

A customer reports their AcmeCloud Terraform provider is broken because a recent security change blocks API-key-creates-API-key flows. They ask if there's a roadmap for managing service tokens programmatically. The right reply:

```
Hey Sam, yeah, this looks like the same change.

The key bit is that there isn't another api-... or st-... credential you can swap in. Creating API keys/service tokens with an API key is now blocked, so Terraform hits 403 if it's trying to create acmecloud_service_token while authenticated with an API key.

To unblock you today, I'd create the service token in the AcmeCloud UI and feed it into Terraform via your normal secrets path. I'm going to track this internally too — the Terraform provider path should either keep working via a supported auth flow or be updated to make this limitation much clearer.
```

Why this is right:

- **Paragraph 1**: one-line acknowledgment. No empathy filler.
- **Paragraph 2**: technical "key bit" with specific names. The reader knows exactly what's blocked and why.
- **Paragraph 3**: practical "today" unblock + commitment to track + one-line product reasoning. Commits, doesn't ask.
- **Three short paragraphs, ~120 words.**

## The test before sending

If a sentence explains how your product works internally rather than telling the customer what to do, cut it. If a paragraph could be replaced by a single sentence plus a doc link, replace it.

## Final checks

- [ ] All required XML tags present: `<internal_triage>`, `<repro_context>`, `<references>`, `<customer_draft>`, `<slack_message>` — in that order.
- [ ] `<repro_context>` contains valid JSON (`{}` when no repro details).
- [ ] `<references>` lists only sources opened in this run, or `None`.
- [ ] If triage says Bug + >80% confidence, `<pr>` present with 4 required elements.
- [ ] All code examples are in the customer's SDK language. If SDK unclear, first question asks which SDK.
- [ ] Slack message starts with "Hey".
- [ ] No formal sign-offs ("Let me know if you have questions").
- [ ] Every claim backed by evidence.
- [ ] No sensitive data.
- [ ] Nothing visible after `</slack_message>`.
