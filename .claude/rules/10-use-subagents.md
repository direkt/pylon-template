# MANDATORY: Use Subagents for Case Investigation

**This rule is NON-NEGOTIABLE.** When investigating a Pylon support case, you MUST use the subagent pipeline defined in `.claude/agents/`. Do NOT perform investigation inline.

## When This Applies

Any time a Pylon case number is provided or you are asked to investigate a support issue.

## Required Pipeline

After auto-fetching the Pylon case (Step 0), dispatch to subagents:

### Step 1: Triage (ALWAYS)

Spawn `support-triage` to classify the issue:

```
Agent(
  subagent_type="support-triage",
  description="Triage case #XXXX",
  prompt="<case transcript and attachments>"
)
```

### Step 2: Investigation (for non-trivial cases)

If triage confidence is <80% OR the issue is a bug/error/regression/performance problem, spawn `support-investigator`:

```
Agent(
  subagent_type="support-investigator",
  description="Investigate case #XXXX",
  prompt="<case context + triage classification>"
)
```

For simple how-to questions with >80% triage confidence, you MAY skip straight to the responder.

### Step 3: Response (ALWAYS)

Spawn `support-responder` to draft the final XML-tagged output:

```
Agent(
  subagent_type="support-responder",
  description="Draft response for case #XXXX",
  prompt="<case context + investigation findings>"
)
```

## Parallelization

- Triage and investigation can run in parallel when the case clearly involves an error/bug (spawn both at once).
- The responder MUST wait for investigation results before running.

## What You Do (orchestrator role)

1. **Auto-fetch** the Pylon case data (comments + attachments) — this is YOUR job, not the subagent's.
2. **Dispatch** to subagents as described above.
3. **Synthesize** the subagent outputs into the final response for the user.
4. **Present** the XML-tagged output (`<internal_triage>`, `<customer_draft>`, `<slack_message>`, etc.).

## What You Do NOT Do

- Do NOT perform deep investigation searches (docs, code, historical cases) yourself — that's the investigator's job.
- Do NOT draft the customer response yourself — that's the responder's job.
- Do NOT skip the subagent pipeline and go inline "for speed."

## Exception: Non-Support Tasks

This rule does NOT apply to:

- Normal coding tasks, file edits, git operations
- Questions about this repo's structure or internals
- Internal tooling work

## Exception: No Open Investigation Work

You MAY skip `support-investigator` when the remaining work is not investigation. Examples: the thread already references a tracker ticket whose current state drives the reply, a support author already sent a terminal handoff, or the case is terminal and just needs a verification pass. In those cases, run `support-triage` and `support-responder` only.
