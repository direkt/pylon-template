# Quick Reference — Support Workflow

Start here for a rapid overview. See individual files for details.

## Workflow

Canonical workflow: see `06-investigation-workflow.md`.

Quick start:

- **If a case number is provided**: auto-fetch comments + attachments immediately (see `09-pylon-auto-fetch.md`)
- Classify the issue type with confidence scores (use `classify-issue` skill)
- Then follow the full workflow in `06-investigation-workflow.md`

## Pylon Auto-Fetch (when case number provided)

```
mcp__pylon__pylon_get_case_comments(case_number="<number>")
mcp__pylon__pylon_get_case_attachments(case_number="<number>", inline_images=true)
```

**Fetch automatically** — do not ask for confirmation.

## Essential Commands

### Pylon Search

```
# Exact text search
mcp__pylon__pylon_find_case_by_text(needle="<exact error or feature phrase>", limit=3)

# Broader keyword search
mcp__pylon__pylon_search_issues(query="<keywords>", state="closed", limit=5)

# Related issues
mcp__pylon__pylon_find_related_issues(issue_id="<id>", strategy="same_account", limit=10)
```

### Search Documentation

```
Grep(pattern="<feature>", path="product/docs/", glob="*.md", output_mode="content", "-C"=5)
```

### Search Codebase

```
Grep(pattern="<term>", path="product/code/", output_mode="content")
```

### Find Files

```
Glob(pattern="**/*<name>*.ts", path="product/code/")
```

## Where to Search

See `05-codebase-map.md` for the full component map. Key locations:

- **Documentation**: `product/docs/`
- **Codebase**: `product/code/`
- **Runbooks / Notes**: `product/notes/`
- **Historical Pylon cases**: via `pylon_find_case_by_text`, `pylon_search_issues`

## Response Format (Support Cases Only)

**Use XML tags when doing support-case work** (Pylon cases, customer drafts, triage):

```xml
<internal_triage>...</internal_triage>
<repro_context>{}</repro_context>
<references>...</references>
<customer_draft>...</customer_draft>
<slack_message>...</slack_message>
<pr>...</pr>  <!-- only when bug with >80% confidence -->
```

**Skip XML format for:** normal coding tasks, file edits, git operations, internal tooling.

See `07-response-format.md` for structure, `07a-writing-quality.md` for tone. Use `pr-draft` skill for bug fixes.

## Rule File Index

| File                              | Purpose                                             |
| --------------------------------- | --------------------------------------------------- |
| `01-accuracy-principles.md`       | Never guess, always verify                          |
| `03-verification-checklist.md`    | Checklist before answering                          |
| `04-source-priority.md`           | Which sources to trust                              |
| `05-codebase-map.md`              | Where to find things (YOU fill this in)             |
| `06-investigation-workflow.md`    | Full workflow steps                                 |
| `07-response-format.md`           | Response structure (XML tags)                       |
| `07a-writing-quality.md`          | Writing tone and style                              |
| `09-pylon-auto-fetch.md`          | Auto-fetch Pylon case data                          |
| `10-use-subagents.md`             | Mandatory subagent pipeline                         |
| `11-pylon-historical-search.md`   | Search older Pylon cases on errors                  |
| `13-orchestrator-contract.md`     | What orchestrator pre-fetches vs. what subagents do |
| `17-code-example-verification.md` | **CRITICAL**: anti-hallucination for code           |
| `19-bug-scope-analysis.md`        | Structured code-path trace + fix proposal           |
| `20-evidence-first.md`            | Cite evidence or label speculation                  |
| `99-final-customer-response.md`   | Final customer-safe message (last)                  |

## Skills Index

| Skill                       | Purpose                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `attachment-analysis`       | Use when case has attachments — download/analyze scripts/logs/configs |
| `case-freshness`            | When/why cases refresh and how to avoid stale data                    |
| `classify-issue`            | Confidence scoring for issue classification                           |
| `create-kb-article`         | Template for creating Pylon KB articles                               |
| `escalation`                | When and how to escalate issues                                       |
| `historical-search`         | Search Pylon historical cases for prior resolutions                   |
| `incremental-investigation` | How delta/follow-up investigations work                               |
| `kb-strategy`               | Decision framework for when a KB article is worth creating            |
| `pr-draft`                  | Comprehensive PR template for bug fixes                               |
| `repro-strategy`            | How reproduction runs trigger and how to interpret results            |
| `validation-recovery`       | Understanding validation checks to pass on first try                  |

## Critical Reminders

1. **NEVER trust customer assumptions** — verify before agreeing
2. **Case number = auto-fetch** — fetch comments + attachments immediately
3. **Check docs before answering** — search `product/docs/` for every issue
4. **Every claim needs evidence** — `file:line` in internal triage; public docs URLs in customer reply
5. **Verify before answering** — did you actually read the file?
6. **No local persistence** — do not write or update local files as part of support work

## NEGATIVE/EXCLUSIONARY CLAIMS (CRITICAL)

**Before saying "X does NOT do Y" or "X uses A, not B":**

1. Read the **full type/enum/struct definition** — don't assume the first variant is the only one
2. **Search for counterexamples** — grep for the thing you're about to say doesn't exist
3. If you can't rule it out, say "The primary mechanism is A" instead of "It uses A, not B"

## CODE ANTI-HALLUCINATION (CRITICAL)

**Before suggesting ANY code pattern:**

1. Search the SDK source in `product/code/` for the exact method
2. Read the implementation to confirm it works
3. If you can't find it, DO NOT suggest it

**THE TEST**: can you cite a `file:line` or verified source URL? If NO, don't suggest it.

See `17-code-example-verification.md` for full guidance.
