# Source Priority and Trust Levels

Use the right source for the right question. When sources conflict, higher-ranked sources win.

## Source Hierarchy

### Tier 1: Ground Truth (Highest Trust)

1. **Running code in `product/code/`** — the actual implementation
   - Trust: absolute for "what does the code do"
   - Use for: bug investigation, behavior verification, implementation details

2. **Environment/config files** — actual configuration
   - Trust: absolute for "what config is used"
   - Use for: setup issues, env var questions

### Tier 2: Official Documentation (High Trust)

3. **`product/docs/`** — published documentation
   - Trust: high, but may lag behind code
   - Use for: how-to questions, feature explanations, user-facing behavior

### Tier 3: Historical Knowledge (Medium Trust)

4. **Pylon historical cases** — previously handled support tickets
   - Trust: medium for _what was observed_ and _what resolved the ticket_; may be outdated
   - Use for: finding prior investigations, workarounds, customer-impact patterns
   - **ALWAYS verify** against current code/docs before stating as current behavior
   - See `11-pylon-historical-search.md`

5. **`product/notes/`** — internal runbooks and notes
   - Trust: medium — useful for leads, may be outdated
   - **ALWAYS verify** technical claims against code

### Tier 4: External (Verify Required)

6. **User-provided information** — what the user says
   - Trust: variable — may be incomplete or mistaken
   - Always verify claims against code

7. **External community sources (Stack Overflow, blog posts)**
   - Trust: very low — often outdated or incorrect
   - Use for: last resort; always verify against current codebase

## When to Use Each Source

| Question Type               | Primary Source            | Verify With   |
| --------------------------- | ------------------------- | ------------- |
| "What does X do?"           | Code                      | Docs          |
| "How do I do X?"            | Docs                      | Code          |
| "Why is X broken?"          | Code                      | User symptoms |
| "What config for X?"        | `.env` files, config defs | Docs          |
| "Has this been solved?"     | Pylon                     | Current code  |
| "Has this happened before?" | Pylon historical          | Current code  |

## Source Conflict Resolution

When sources disagree:

1. **Code vs Docs**: code wins (docs may be outdated). Note the discrepancy. Suggest a docs update if significant.
2. **User claim vs Code**: investigate. User may have found a bug, may be using wrong version, or may be mistaken. Ask clarifying questions.

## Search Tool Selection

| Source             | Tool                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| Pylon historical   | `mcp__pylon__pylon_find_case_by_text`, `mcp__pylon__pylon_search_issues` |
| Code (targeted)    | `Grep(pattern="…", path="product/code/")`                                |
| Code (exploration) | Task + Explore subagent                                                  |
| Docs (keyword)     | `Grep(pattern="…", path="product/docs/", glob="*.md")`                   |
| Config             | `Glob(pattern="**/.env*", path="product/code/")`                         |
