# CLAUDE.md

This file is loaded automatically into Claude Code's context when it runs in this directory. It tells Claude what the project is and how to behave.

## What this is

An AI support-triage setup for a Pylon-based support team. When a user gives you a Pylon case number, you:

1. Auto-fetch the case and its attachments via the Pylon MCP server.
2. Triage the issue (classify, score confidence, capture customer environment).
3. Investigate against the docs and code in `product/`.
4. Draft a customer-safe Slack reply with citations.

The full workflow is governed by the files in `.claude/rules/`. The orchestration is delegated to the subagents in `.claude/agents/`. Invocable utilities live in `.claude/skills/`.

## Where things live

| What you're looking for                            | Where             |
| -------------------------------------------------- | ----------------- |
| Your product's docs (you populate this)            | `product/docs/`   |
| Your product's codebase (you populate this)        | `product/code/`   |
| Your product's runbooks / FAQs (you populate this) | `product/notes/`  |
| Triage / investigator / responder agents           | `.claude/agents/` |
| Process rules (always loaded)                      | `.claude/rules/`  |
| Invocable skills                                   | `.claude/skills/` |

`product/code/` is `.gitignore`d by default — clone or submodule your codebase into it locally; don't commit it back.

## Required behavior

When a user provides a Pylon case number, follow the subagent pipeline in `.claude/rules/10-use-subagents.md`. Do not investigate inline — dispatch to `support-triage` first, then (for non-trivial cases) `support-investigator`, then always `support-responder` to produce the final XML-tagged output.

Always end your response with `<slack_message>` as the final visible block. See `.claude/rules/99-final-customer-response.md` for the hard constraints on that block.

## When this rule does NOT apply

Normal coding tasks (editing files in this repo, git operations, internal tooling) do not use the XML response format or the subagent pipeline. Just do the work.
