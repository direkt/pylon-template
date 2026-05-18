# product/code/

Drop (or `git clone` / `git submodule add`) your product's codebase here. This folder is `.gitignore`d by default — Claude can read it locally, but you won't accidentally commit it back to the template.

## Why this exists

The `support-investigator` agent treats live code as Tier-1 ground truth (highest trust — beats docs when they disagree). To investigate a bug or trace a code path, it needs to be able to `Grep` and `Read` your actual source.

## Suggestions

- **Single repo**: `git clone git@github.com:your-org/your-product.git .` (note the trailing `.` — clone into this directory).
- **Multiple repos**: clone each into its own subfolder (`product/code/api/`, `product/code/sdk-python/`, `product/code/web/`).
- **Submodules**: `git submodule add` works but adds setup friction for newcomers. Local clones are usually simpler.
- Keep this read-only in spirit — the agents are configured (`disallowedTools: Write, Edit, Bash`) to never modify what's here.

## How rules reference this folder

`.claude/rules/05-codebase-map.md` is your search-location index. Update it to point at the actual subfolders you create here (e.g., `product/code/api/src/` for your API server).
