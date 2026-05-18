---
name: create-kb-article
description: Use when you need to create a Pylon Knowledge Base article to document a resolved issue, workaround, or configuration guide.
---

# Create Pylon KB Article

When a resolved case has enough generalizable signal to deserve a KB article (see `kb-strategy` skill for the decision criteria), produce a draft using this template.

## Decision First

Use the `kb-strategy` skill to decide whether to create an article. If the answer is no, do not create one.

## Article Template

````markdown
# [Clear, searchable title]

## Problem

[1-2 sentences describing the symptom from the customer's perspective. Use their language, not internal jargon.]

## Cause

[Why this happens, in plain language. Reference docs/code when helpful.]

## Solution

[Step-by-step resolution. Numbered steps. Include code blocks where applicable.]

```sdk-language
[verified code example in the appropriate SDK]
```
````

## Related

- [Doc link]
- [Other KB article if applicable]

```

## Style Guidelines

- **Title**: searchable. Customers will Google or grep for this. Include the error message verbatim if there is one.
- **Problem**: customer-perspective. Use their words. Avoid implementation jargon they wouldn't know.
- **Cause**: brief. Customers care about the fix more than the why.
- **Solution**: actionable. Steps that can be followed without further reading.
- **Code**: verified per rule 17. No hallucinated APIs.

## Common Anti-Patterns

- **Internal-only article**: contains references the customer can't act on ("change the value in `internal-config.yaml`").
- **Too narrow**: solves one customer's specific situation rather than a generalized problem.
- **Wall of text**: no formatting, no steps. KB articles should be skimmable.

## Output

Produce the markdown article inline in the response so a human can paste it into your Pylon KB UI. Do NOT write a local file.
```
