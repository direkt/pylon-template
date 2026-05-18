---
name: pr-draft
description: Use when bug classification confidence is >80% AND you've identified the root cause in code. Generates a focused PR section with the 4 essential elements (Root Cause, Buggy Code, Proposed Fix, Risk).
---

# PR Draft

When you've identified a bug with high confidence and the root cause is in `product/code/`, generate a `<pr>` section so engineering can act on it quickly.

## When to Generate

All of these must be true:

- [ ] Triage classifies as Bug
- [ ] Bug confidence >80%
- [ ] Root cause located in `product/code/` (you can point to `file:line`)
- [ ] Proposed fix is concrete (not "add better error handling")

If confidence is 60-80%, do NOT draft a PR. Put findings in `<internal_triage>` and ask discriminating questions.

## Required Structure (4 sections)

````xml
<pr>
### Root Cause
[1-2 sentences. What's wrong, why, and where (file:line). Evidence chain: customer symptom → code behavior → expected per docs.]

### Buggy Code
**File**: `product/code/path/to/file.ts:XX-YY`
```language
[annotated code showing the bug]
```

### Proposed Fix
```diff
- old code
+ new code  // FIX: now correctly handles [case]
```
**Why this works**: [1 sentence]

### Risk
- **Scope**: [Localized / Moderate / Wide-reaching]
- **Breaking changes**: [None / Yes — describe]
- **Rollback**: [Easy / Complex]
</pr>
````

## Optional Sections (add only when they reflect real work)

- **`### Code Path Analysis`** — when the bug is many call frames removed from the entry point
- **`### Behavior Change Analysis`** — when normal vs edge cases diverge in non-obvious ways
- **`### Testing Requirements`** — when the fix needs specific new test coverage (write the test, don't just describe it)
- **`### Related Issues`** — when this fix touches multiple Pylon cases or a known regression

Do not include every optional section by default. A one-line fix shouldn't ship with a 200-line PR draft.

## Quality Bar

- Every claim has a `file:line` citation
- The proposed fix is shown as a diff, not described in prose
- Risk assessment is specific (e.g., "Localized — only this one handler" beats "Low risk")
- No invented APIs in the proposed fix (rule 17 applies)
