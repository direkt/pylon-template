# product/docs/

Drop your product's user-facing documentation here. Markdown is best (`.md` / `.mdx`).

Claude Code will `Grep` and `Read` files in this folder during investigation. The `support-investigator` agent treats docs as a Tier-2 source (high trust, may lag behind the actual code).

## Suggestions

- Mirror the structure of your published docs site so file paths feel natural.
- Include API references, getting-started guides, and feature explanations.
- Include known-limitations docs — they're some of the highest-leverage content for triage.
- If your docs are huge and `Grep` becomes too slow, consider plugging in a docs search MCP later.

## How rules reference this folder

`.claude/rules/05-codebase-map.md` and `.claude/rules/06-investigation-workflow.md` both reference `product/docs/`. If you move or rename this folder, update those rules too.
