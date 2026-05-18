#!/usr/bin/env node
// pylon-template setup UI
//
// Usage: node setup.mjs
//
// Launches a local web UI at http://localhost:7077 that lets you:
//   1. Set your Pylon API token (writes to .env)
//   2. Verify that pylon-mcp-cli is installed and on your PATH
//   3. Test-fetch a Pylon case to confirm end-to-end wiring
//   4. See which product/ subfolders still need content
//
// Zero dependencies — uses only Node built-ins.

import { createServer } from "node:http";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import { platform } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 7077;
const ENV_PATH = join(__dirname, ".env");

// ---------- helpers ----------

async function readEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const text = await readFile(ENV_PATH, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function writeEnv(updates) {
  const current = await readEnv();
  const merged = { ...current, ...updates };
  const text =
    Object.entries(merged)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") + "\n";
  await writeFile(ENV_PATH, text, "utf8");
}

async function checkPylonMcp() {
  try {
    const { stdout } = await execAsync("pylon-mcp-cli --version", { timeout: 3000 });
    return { installed: true, version: stdout.trim() || "unknown" };
  } catch {
    try {
      const { stdout } = await execAsync("which pylon-mcp-cli", { timeout: 3000 });
      return { installed: true, version: "unknown", path: stdout.trim() };
    } catch {
      return { installed: false };
    }
  }
}

async function checkProductFolder(name) {
  const dir = join(__dirname, "product", name);
  if (!existsSync(dir)) return { exists: false, populated: false, count: 0 };
  const entries = await readdir(dir);
  const meaningful = entries.filter((e) => !e.startsWith(".") && e !== "README.md");
  return { exists: true, populated: meaningful.length > 0, count: meaningful.length };
}

async function getStatus() {
  const env = await readEnv();
  const [mcp, docs, code, notes] = await Promise.all([
    checkPylonMcp(),
    checkProductFolder("docs"),
    checkProductFolder("code"),
    checkProductFolder("notes"),
  ]);
  return {
    token: { set: !!env.PYLON_API_TOKEN, masked: env.PYLON_API_TOKEN ? maskToken(env.PYLON_API_TOKEN) : "" },
    pylonMcp: mcp,
    product: { docs, code, notes },
  };
}

function maskToken(t) {
  if (!t || t.length < 8) return "•".repeat(t.length);
  return t.slice(0, 4) + "•".repeat(Math.max(t.length - 8, 4)) + t.slice(-4);
}

async function testFetch(caseNumber) {
  const env = await readEnv();
  const token = env.PYLON_API_TOKEN;
  if (!token) return { ok: false, error: "No PYLON_API_TOKEN set. Save your token first." };
  if (!/^\d+$/.test(String(caseNumber))) {
    return { ok: false, error: "Case number must be digits only." };
  }
  try {
    const res = await fetch(`https://api.usepylon.com/issues?number=${caseNumber}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: res.status === 401 ? "Pylon rejected the token (401)." : `Pylon returned HTTP ${res.status}.`,
      };
    }
    const body = await res.json();
    const issue = Array.isArray(body?.data) ? body.data[0] : body?.data || body;
    if (!issue || !issue.id) {
      return { ok: false, error: `No case found with number ${caseNumber}.` };
    }
    return {
      ok: true,
      case: {
        id: issue.id,
        number: issue.number,
        title: issue.title || "(no title)",
        state: issue.state || "(unknown)",
      },
    };
  } catch (err) {
    return { ok: false, error: `Network error: ${err.message}` };
  }
}

function openBrowser(url) {
  const cmd =
    platform() === "darwin" ? "open" : platform() === "win32" ? "start" : "xdg-open";
  spawn(cmd, [url], { detached: true, stdio: "ignore" }).unref();
}

// ---------- HTML ----------
// All dynamic content rendered by client-side JS uses textContent or
// DOM construction — no innerHTML with untrusted strings.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>pylon-template setup</title>
<style>
  :root {
    --bg: #0f1115;
    --panel: #181b22;
    --border: #262a33;
    --fg: #e6e8ec;
    --muted: #8a92a3;
    --accent: #7aa2ff;
    --ok: #4ade80;
    --warn: #fbbf24;
    --err: #f87171;
    --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 16px;
    background: var(--bg); color: var(--fg);
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  }
  main { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 4px; font-weight: 600; }
  .lede { color: var(--muted); margin: 0 0 32px; }
  section {
    background: var(--panel); border: 1px solid var(--border); border-radius: 10px;
    padding: 20px; margin-bottom: 16px;
  }
  h2 {
    font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--muted); margin: 0 0 14px; font-weight: 600;
  }
  .row { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
  .row .label { flex: 1; }
  .pill {
    font-family: var(--mono); font-size: 12px; padding: 3px 8px; border-radius: 999px;
    border: 1px solid var(--border);
  }
  .pill.ok { color: var(--ok); border-color: rgba(74, 222, 128, 0.3); background: rgba(74, 222, 128, 0.08); }
  .pill.warn { color: var(--warn); border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.08); }
  .pill.err { color: var(--err); border-color: rgba(248, 113, 113, 0.3); background: rgba(248, 113, 113, 0.08); }
  .pill.muted { color: var(--muted); }
  input[type=text], input[type=password] {
    width: 100%; padding: 10px 12px; border-radius: 6px;
    background: #0b0d12; color: var(--fg); border: 1px solid var(--border);
    font-family: var(--mono); font-size: 13px;
  }
  input:focus { outline: none; border-color: var(--accent); }
  button {
    padding: 9px 14px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--accent); color: #0b0d12; font-weight: 600; cursor: pointer;
    font-size: 13px;
  }
  button:hover { filter: brightness(1.1); }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .form-row { display: flex; gap: 8px; align-items: center; }
  .form-row input { flex: 1; }
  .form-row input.small { max-width: 160px; flex: 0 0 160px; }
  .help { color: var(--muted); font-size: 13px; margin-top: 8px; }
  .help code { font-family: var(--mono); background: #0b0d12; padding: 1px 5px; border-radius: 3px; }
  .result { margin-top: 12px; padding: 10px 12px; border-radius: 6px; font-size: 13px; }
  .result.ok { background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.3); }
  .result.err { background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.3); }
  .result pre { margin: 6px 0 0; font-family: var(--mono); font-size: 12px; white-space: pre-wrap; }
  footer { color: var(--muted); font-size: 12px; text-align: center; margin-top: 32px; }
  footer a { color: var(--accent); text-decoration: none; }
  pre.cmd {
    background: #0b0d12; border: 1px solid var(--border); border-radius: 6px;
    padding: 12px; font-family: var(--mono); font-size: 13px; margin: 12px 0 0;
  }
</style>
</head>
<body>
<main>
  <h1>pylon-template setup</h1>
  <p class="lede">Configure your local instance. Changes write to <code>.env</code> and disk only.</p>

  <section>
    <h2>1. Pylon API token</h2>
    <div class="row">
      <span class="label">Status</span>
      <span id="tokenStatus" class="pill muted">checking…</span>
    </div>
    <div class="form-row" style="margin-top:10px">
      <input type="password" id="tokenInput" placeholder="Paste your PYLON_API_TOKEN" autocomplete="off" />
      <button id="tokenSave">Save</button>
    </div>
    <div class="help">Create one at <code>app.usepylon.com/settings/api-keys</code>. Written to <code>.env</code> as <code>PYLON_API_TOKEN</code>.</div>
    <div id="tokenResult"></div>
  </section>

  <section>
    <h2>2. pylon-mcp server</h2>
    <div class="row">
      <span class="label">Installation</span>
      <span id="mcpStatus" class="pill muted">checking…</span>
    </div>
    <div class="help">If missing, install per the <a href="https://github.com/direkt/pylon-mcp" target="_blank" rel="noopener">pylon-mcp README</a>. The CLI must be on your PATH as <code>pylon-mcp-cli</code>.</div>
  </section>

  <section>
    <h2>3. Test-fetch a case</h2>
    <div class="help">Hits the Pylon API directly with your saved token. Confirms the token works end-to-end.</div>
    <div class="form-row" style="margin-top:10px">
      <input type="text" id="caseInput" class="small" placeholder="e.g. 1234" />
      <button id="caseFetch">Fetch</button>
    </div>
    <div id="caseResult"></div>
  </section>

  <section>
    <h2>4. product/ folders</h2>
    <div class="row"><span class="label">product/docs/</span><span id="docsStatus" class="pill muted">checking…</span></div>
    <div class="row"><span class="label">product/code/</span><span id="codeStatus" class="pill muted">checking…</span></div>
    <div class="row"><span class="label">product/notes/</span><span id="notesStatus" class="pill muted">checking…</span></div>
    <div class="help">Drop your product's docs, codebase, and runbooks into the matching folders. Anything beyond <code>README.md</code> counts as populated.</div>
  </section>

  <section>
    <h2>5. Launch Claude Code</h2>
    <div class="help">When the token + MCP install + test fetch are all green, you're ready. From this directory:</div>
    <pre class="cmd">claude</pre>
    <div class="help" style="margin-top:8px">Inside Claude Code, type a Pylon case number (e.g. <code>1234</code>) to start a triage.</div>
  </section>

  <footer>Local server on :7077 • <a href="#" id="stopLink">stop server</a></footer>
</main>

<script>
const $ = (id) => document.getElementById(id);

function pill(el, kind, text) {
  el.className = 'pill ' + kind;
  el.textContent = text;
}

// Build result blocks via DOM nodes (no innerHTML for dynamic content).
function setResult(container, kind, message, pre) {
  container.replaceChildren();
  const box = document.createElement('div');
  box.className = 'result ' + kind;
  box.textContent = message;
  if (pre) {
    const p = document.createElement('pre');
    p.textContent = pre;
    box.appendChild(p);
  }
  container.appendChild(box);
}

async function refresh() {
  const r = await fetch('/api/status').then(r => r.json());

  if (r.token.set) pill($('tokenStatus'), 'ok', r.token.masked);
  else pill($('tokenStatus'), 'err', 'not set');

  if (r.pylonMcp.installed) {
    const v = r.pylonMcp.version;
    pill($('mcpStatus'), 'ok', 'installed' + (v && v !== 'unknown' ? ' • ' + v : ''));
  } else {
    pill($('mcpStatus'), 'err', 'not found on PATH');
  }

  for (const [name, el] of [['docs', $('docsStatus')], ['code', $('codeStatus')], ['notes', $('notesStatus')]]) {
    const f = r.product[name];
    if (!f.exists) pill(el, 'err', 'missing');
    else if (!f.populated) pill(el, 'warn', 'empty — drop content here');
    else pill(el, 'ok', f.count + ' item' + (f.count === 1 ? '' : 's'));
  }
}

$('tokenSave').addEventListener('click', async () => {
  const token = $('tokenInput').value.trim();
  if (!token) return;
  $('tokenSave').disabled = true;
  const res = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  }).then(r => r.json());
  $('tokenSave').disabled = false;
  if (res.ok) {
    setResult($('tokenResult'), 'ok', 'Saved to .env.');
    $('tokenInput').value = '';
    refresh();
  } else {
    setResult($('tokenResult'), 'err', res.error || 'Failed to save.');
  }
});

$('caseFetch').addEventListener('click', async () => {
  const caseNumber = $('caseInput').value.trim();
  if (!caseNumber) {
    setResult($('caseResult'), 'err', 'Enter a case number.');
    return;
  }
  $('caseFetch').disabled = true;
  setResult($('caseResult'), 'ok', 'Fetching…');
  const res = await fetch('/api/test-fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseNumber })
  }).then(r => r.json());
  $('caseFetch').disabled = false;
  if (res.ok) {
    setResult($('caseResult'), 'ok', '✓ Fetched case #' + (res.case.number || caseNumber), JSON.stringify(res.case, null, 2));
  } else {
    setResult($('caseResult'), 'err', res.error || 'Unknown error.');
  }
});

$('stopLink').addEventListener('click', (e) => {
  e.preventDefault();
  fetch('/api/quit').finally(() => {
    document.body.replaceChildren();
    const m = document.createElement('main');
    const p = document.createElement('p');
    p.style.cssText = 'text-align:center;padding:60px;color:#8a92a3';
    p.textContent = 'Server stopped. You can close this tab.';
    m.appendChild(p);
    document.body.appendChild(m);
  });
});

refresh();
setInterval(refresh, 5000);
</script>
</body>
</html>`;

// ---------- server ----------

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  const json = (status, obj) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
  };

  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(HTML);
    }

    if (req.method === "GET" && url.pathname === "/api/status") {
      return json(200, await getStatus());
    }

    if (req.method === "POST" && url.pathname === "/api/token") {
      const body = await readBody(req);
      const { token } = JSON.parse(body || "{}");
      if (!token || typeof token !== "string" || token.length < 8) {
        return json(400, { ok: false, error: "Token looks too short — paste the full token." });
      }
      if (/[\r\n]/.test(token)) {
        return json(400, { ok: false, error: "Token contains newlines — strip them and retry." });
      }
      await writeEnv({ PYLON_API_TOKEN: token });
      return json(200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/test-fetch") {
      const body = await readBody(req);
      const { caseNumber } = JSON.parse(body || "{}");
      return json(200, await testFetch(caseNumber));
    }

    if (req.method === "GET" && url.pathname === "/api/quit") {
      json(200, { ok: true });
      setTimeout(() => process.exit(0), 100);
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  } catch (err) {
    json(500, { ok: false, error: err.message });
  }
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}`;
  console.log(`pylon-template setup running at ${url}`);
  console.log("Press Ctrl+C to stop.");
  openBrowser(url);
});
