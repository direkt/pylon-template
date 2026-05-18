# Orchestrator Contract

When dispatching subagents, the orchestrator is responsible for all **context pre-fetching**. Subagents do deeper work on context they receive — they do not re-fetch what the orchestrator already has.

## What the Orchestrator MUST Pre-Fetch

Before dispatching any subagent on a support case, fetch:

1. **Pylon case + attachments** via `mcp__pylon__pylon_get_case_comments` + `mcp__pylon__pylon_get_case_attachments` (per `09-pylon-auto-fetch.md`).

If the case transcript is too large to hold in the orchestrator context, save it to a temp path and pass the path to the subagent — do **not** try to summarize it before the subagent sees it.

## What the Orchestrator Passes to Subagents

Every subagent dispatch prompt includes:

- The case number, title, state, priority, tier, creation/latest-message timestamps.
- A synthesized participant map (who is support, who is the requester, who is third-party).
- The current customer question (the last unresolved ask from the requester).
- Pointer to the large-transcript file on disk if applicable.
- A clear statement of what the subagent is expected to return.

## What Subagents MUST NOT Do

- Re-fetch the Pylon case transcript if it's been supplied.
- Treat the absence of a tool in their allowlist as "no data available" — instead, flag it and let the orchestrator fill the gap.

## What Subagents MAY Do

- Fetch _new_ Pylon artifacts they discover during investigation that the orchestrator didn't know about.
- Run grep, read files, and web fetches within their allowlist.
- Request additional context from the orchestrator by stating what they need.

## Delta Runs and Follow-Ups

On a delta or follow-up run (see `incremental-investigation` skill), the orchestrator MUST re-fetch any external state that ages (tracker tickets, deployment status). Do not reuse state from the prior run's cached output without verifying.

## Why This Exists

- Centralizing fetches in the orchestrator avoids "subagent couldn't call X" failures.
- The same case getting fetched three times across triage / investigator / responder wastes context and slows runs.
- Stale state is a common source of incorrect customer replies — fetch fresh, pass down.
