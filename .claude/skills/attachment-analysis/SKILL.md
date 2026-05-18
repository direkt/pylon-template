---
name: attachment-analysis
description: Use when a Pylon case has attachments (scripts, logs, configs, screenshots). Guides downloading, analyzing, and extracting actionable insights from each file type.
---

# Attachment Analysis

When a Pylon case has attachments, you MUST download and analyze them. The customer's actual code/logs/configs often contain the answer.

## File Types and Priorities

| File Type                           | Priority | Why                                  |
| ----------------------------------- | -------- | ------------------------------------ |
| `.py`, `.js`, `.ts`, `.tsx`, `.jsx` | HIGH     | Customer's actual code               |
| `.sh`, `.bash`, `.zsh`              | HIGH     | Shell scripts often have config/auth |
| `.log`, `*.log.*`                   | HIGH     | Stack traces, error messages         |
| `.json`, `.yaml`, `.yml`            | HIGH     | Configuration                        |
| `.sql`                              | MEDIUM   | Query syntax                         |
| `.rb`, `.go`, `.rs`, `.java`        | MEDIUM   | Other code                           |
| Screenshots (`.png`, `.jpg`)        | MEDIUM   | UI context                           |
| Other binaries                      | LOW      | Note only                            |

## Download Pattern

```
mcp__pylon__pylon_get_case_attachments(case_number="<num>", inline_images=true)
# then for each url:
WebFetch(url="<attachment_url>", format="text")
```

## Analyze For

- **Customer's actual code** — may differ from docs
- **Error handling** that could be the cause
- **API usage patterns** (correct/incorrect)
- **Configuration values**
- **Stack traces and error messages in logs**

## Use Findings

- Customer code has a bug? Point to the specific line.
- API used incorrectly? Show the correct usage.
- Logs reveal the error? Quote the relevant section.

## Do NOT Skip

Attachment analysis is non-optional when attachments exist. The customer's actual code is more valuable than hypothetical scenarios.
