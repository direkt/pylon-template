# product/notes/

Free-form internal notes that don't belong in published docs.

Good things to put here:

- **Runbooks** for common production issues.
- **Cheatsheets** for tricky features (auth flows, billing edge cases, version-skew rules).
- **Known issues** with workarounds, especially ones not (yet) in your public docs.
- **Customer-account context** (only what's safe to keep in a repo — no secrets, no PII).
- **Recent incident postmortems** (sanitized) that are likely to come back as support cases.

The `support-investigator` agent treats this folder as medium-trust — useful for finding leads, but verify against code/docs before stating as fact.
