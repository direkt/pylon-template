# pylon-template

A starter for building an AI-powered support triage system on top of [Pylon](https://usepylon.com) using [Claude Code](https://claude.com/claude-code).

Ship this in any product company's repo and Claude Code becomes able to:

1. Auto-fetch a Pylon case when you give it a case number.
2. Triage the case (classify the issue, score confidence, identify the SDK/environment).
3. Investigate against your product's docs and code.
4. Draft a customer-safe Slack reply with citations.

**This template ships the agent framework only.** You provide your product's knowledge (docs, code, runbooks) via the `product/` folder. There are no fake examples — just clearly marked stubs to fill in.

---

## What's in the box

```
.claude/
  agents/    Three specialist subagents: triage, investigator, responder.
  rules/     ~15 process rules that govern how cases are handled
             (accuracy, verification, response format, etc.).
  skills/    ~10 invocable skills for common subtasks
             (classification, escalation, PR drafts, KB articles).
product/
  docs/      Drop your product's markdown docs here.
  code/      Drop (or submodule) your product's codebase here.
  notes/     Free-form runbooks, FAQs, internal notes.
CLAUDE.md    Project instructions Claude Code loads automatically.
.mcp.json    Wires up the Pylon MCP server.
```

---

## Setup (5 minutes)

### 1. Clone this template

```bash
gh repo create my-team/support-triage --template direkt/pylon-template
cd support-triage
```

### 2. Run the setup UI (recommended)

```bash
node setup.mjs
```

Opens a local web UI at http://localhost:7077 that walks you through everything:

- Paste your Pylon API token (writes `.env`)
- Verifies that `pylon-mcp-cli` is installed on your PATH
- Test-fetches a real Pylon case to confirm wiring
- Shows which `product/` subfolders still need content

Requires Node 18+ (uses built-in `fetch` and `node:` imports). Zero `npm install`.

Prefer to set things up by hand? Skip to **Manual setup** below.

### 3. Drop in your product knowledge

- **Docs**: put markdown files under `product/docs/`. Claude will `Grep` and `Read` them during investigation.
- **Code**: clone or submodule your codebase under `product/code/`. The `.gitignore` excludes this folder by default so you don't accidentally commit a giant tree back to the template.
- **Notes**: anything else useful — runbooks, common-issue cheatsheets, deployment quirks — under `product/notes/`.

### 4. Customize for your product

Skim these files and replace the `YOUR_PRODUCT` / `AcmeCloud` placeholders with your actual product name, SDK list, doc URLs, etc.:

- `CLAUDE.md`
- `.claude/rules/05-codebase-map.md` (search-location index)
- `.claude/rules/08-sdk-detection.md` (your SDK list, if you ship multiple)
- `.claude/agents/support-responder.md` (greeting voice, sign-off conventions)

### 5. Try it

```bash
claude
```

Then, inside the REPL, paste a Pylon case number:

```
1234
```

The auto-fetch rule will pull the case + attachments, dispatch the triage and (when warranted) investigator subagents, and emit a final response with these XML-tagged sections:

- `<internal_triage>` — analysis (not customer-visible)
- `<repro_context>` — JSON repro details (`{}` if none)
- `<references>` — sources opened
- `<customer_draft>` — the customer-safe reply
- `<slack_message>` — paste-ready Slack version (same content)

---

## Manual setup

If you'd rather not run the UI:

1. Install [`pylon-mcp`](https://github.com/direkt/pylon-mcp) and confirm `pylon-mcp-cli` is on your PATH.
2. `cp .env.example .env` and paste your token from https://app.usepylon.com/settings/api-keys
3. Make sure your shell exports `PYLON_API_TOKEN` when launching Claude Code (e.g., `source .env`).
4. Populate `product/{docs,code,notes}/` as described above.

---

## How the pipeline works

```
user types "1234"
        │
        ▼
   auto-fetch Pylon case + attachments  (rule 09)
        │
        ▼
   dispatch support-triage subagent     (rule 10)
        │
        ▼
   (if non-trivial) dispatch support-investigator
        │
        ▼
   dispatch support-responder
        │
        ▼
   render final XML output
```

The `support-triage` agent classifies the case in <30 seconds. The `support-investigator` agent searches your `product/` folder and historical Pylon cases. The `support-responder` agent drafts the customer reply, citing only sources actually opened.

---

## Customizing the voice

The `support-responder` agent and `99-final-customer-response.md` rule encode a specific reply style (conversational, ≤120 words, leads with the answer, no empathy filler). This is a working default — opinionated, terse, and developer-friendly. To rewrite for your team's voice, edit those two files. The example replies in `07a-writing-quality.md` are the best place to study the pattern before changing it.

---

## What this template intentionally does NOT include

- **No web dashboard.** Use Claude Code directly. If you want a UI/queue/worker later, that's a separate layer.
- **No semantic search service.** Plain `Grep` against `product/docs/` is usually enough. Add a search MCP later if your docs grow huge.
- **No Slack/Linear/GitHub/Datadog integrations.** Those rules and skills were stripped to keep the surface area small. Add them back as MCP servers if your team uses them.
- **No fake product examples.** The `product/` folder is intentionally empty.

---

## License

MIT — see [LICENSE](./LICENSE).
