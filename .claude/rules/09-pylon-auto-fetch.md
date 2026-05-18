# Pylon Case Auto-Fetch

When a user provides a Pylon case number, **automatically fetch all case data** before any other investigation steps.

## Trigger Detection

Recognize case numbers in these formats:

- **Explicit case reference** (always fetch): `#9895`, `case 9895`, `ticket 9895`, `pylon 9895`
- **Bare number as the entire user message** (treat as case number): `9895`
- **In context with clear intent**: "look at case 9895", "help with ticket #9895"

### Ambiguity guardrails (privacy + correctness)

Do **not** auto-fetch when the number could plausibly be something else (and fetching the wrong ticket could expose unrelated customer data), for example:

- HTTP status codes: `400`, `401`, `403`, `404`, `429`, `500`
- Versions: `1.0.3`, `v2`, `2024.12.17`
- Multiple unrelated numbers in the same message with no "case/ticket/#" marker

If the user's message contains ambiguous numbers, ask a single clarifying question first:

> "What's the Pylon case number you want me to pull (or can you prefix it like `case 1234` / `#1234`)?"

### Multiple case numbers

If the user clearly references multiple case numbers (e.g., "cases #1234 and #5678"), fetch each in parallel.

## Participant Identity (REQUIRED — do this every time)

Before reading the transcript, classify every message author into one of three roles:

| Role                    | How to recognize                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Internal support**    | Message `author` is a Pylon `user` (not `contact`) with an email domain matching your company. These are the only messages that count as official support responses.                                    |
| **Requester**           | Pylon `contact` whose `id` matches `issue.requester.id`. Their messages are the customer's ask.                                                                                                         |
| **Third-party contact** | Pylon `contact` with an `id` that does NOT match `requester.id` — usually another person at the customer's org. Their messages are context or peer discussion, **not** support handoffs or resolutions. |

Bot-generated messages are neither support nor customer — treat them as system noise unless they contain a useful hint.

**Why this matters:** a "handoff already delivered" or "the issue is resolved" claim is only authoritative when it comes from your internal support team. A peer at the customer's org saying "ask our internal team instead" is context — the case is still open from your side unless your support confirms.

Record the participant map in your internal triage so the responder doesn't misinterpret the thread.

## Auto-Fetch Sequence

When a case number is detected, **immediately** fetch the case data using the Pylon MCP server:

```
mcp__pylon__pylon_get_case_comments(case_number="<number>")
mcp__pylon__pylon_get_case_attachments(case_number="<number>", inline_images=true)
```

Call them in parallel.

Do NOT ask the user for confirmation. Fetch automatically.

## Information to Extract

### Ticket Metadata

- **State** (waiting_on_you, waiting_on_customer, closed, new, etc.)
- **Priority** (low/medium/high/urgent)
- **Tier** (if available)
- **Question type** (bug, feature_request, how_to, user_error — infer from context if not labeled)

### Customer Context

- Customer name and organization
- Contact email
- Previous interactions (check for related cases if needed)

### Issue Details

- **Exact error messages** (copy verbatim for searching)
- **Affected features/endpoints**
- **Environment details** (cloud, self-hosted, SDK version)
- **Timeline** (when did it start, any recent changes)

Preserve verbatim:

- Exact error strings
- Versions, timestamps, request IDs, trace IDs
- Commands, queries, and customer scripts
- Decisive log lines

Summarize instead:

- Long conversational backstory
- Repeated log patterns
- Historical case takeaways

### Attachments

- **Screenshots**: view inline to understand visual context
- **Scripts/code files** (.py, .js, .ts, .sh, etc.): **MUST download and analyze** — these contain the customer's actual code
- **Log files**: **MUST download and analyze** — these contain error traces
- **Configuration files** (.json, .yaml, .env): download to check for misconfigurations
- **Other files**: note what was attached

## Analyzing Attachments

**CRITICAL: scripts and logs often contain the solution.** After fetching attachments:

1. **Download script/code attachments** using `WebFetch`:

   ```
   WebFetch(url="<attachment_url>", format="text")
   ```

2. **Analyze** for:
   - Exact code the customer is running (may differ from docs)
   - Error handling that could be causing issues
   - API usage patterns (correct/incorrect)
   - Configuration values
   - Stack traces in logs

3. **Use findings**:
   - If the customer's code has a bug, point to the specific line
   - If they're using an API incorrectly, show the correct usage
   - If logs reveal the error, quote the relevant section

**File types to always download:** `.py`, `.js`, `.ts`, `.tsx`, `.jsx`, `.sh`, `.bash`, `.zsh`, `.log`, `.json`, `.yaml`, `.yml`, `.sql`, `.rb`, `.go`, `.rs`, `.java`.

## After Auto-Fetch

1. **Summarize the ticket** in a brief triage format:

   ```
   ## Ticket #XXXX: [Title]

   | Field | Value |
   |-------|-------|
   | Status | ... |
   | Priority | ... |
   | Tier | ... |

   ### Customer Issue
   [1-2 sentence summary]

   ### Key Details
   - [Exact error messages]
   - [Affected features]
   - [Attachments noted]
   ```

2. **Proceed with investigation** following `06-investigation-workflow.md`.
3. **Ask clarifying questions** only if critical information is missing.

## Large Tickets / Pagination

1. Start with the default fetch (it may already cap messages/attachments).
2. If you need more context, request more pages explicitly and summarize what changed.
3. If images aren't essential, set `inline_images=false` and rely on filenames/URLs.

## Example Flow

**User input**: `9895`

**Claude response**:

1. [Fetches comments and attachments automatically]
2. [Displays ticket summary]
3. [Begins investigation based on issue type]
4. [Provides solution or asks targeted follow-up questions]
