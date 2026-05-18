# Investigation Workflow

Follow this workflow for every support question.

## Workflow Overview

```
0. AUTO-FETCH PYLON (if case number provided)
   IMMEDIATELY fetch comments + attachments in parallel.
   → See: 09-pylon-auto-fetch.md
                 ↓
1. CLASSIFY THE ISSUE + SCORE CONFIDENCE
   Confidence scores per issue type.
   Identify: Primary path, Secondary path, Key signals.
   → Use: classify-issue skill
                 ↓
2. HISTORICAL SEARCH
   Pylon: similar/exact case search.
   → See: 11-pylon-historical-search.md
                 ↓
3. CHECK DOCUMENTATION (REQUIRED)
   Grep product/docs/ for relevant pages.
                 ↓
4. SEARCH CODEBASE
   Grep product/code/ for the symptom or method.
   → See: 05-codebase-map.md for locations
   → See: 04-source-priority.md for trust levels
                 ↓
5. VERIFY FINDINGS
   → See: 03-verification-checklist.md
                 ↓
6. RESPOND TO CUSTOMER
   → See: 07-response-format.md, 07a-writing-quality.md
   → End with: 99-final-customer-response.md
```

## Step Details

### Step 0: Auto-Fetch Pylon Case

Automatic when a case number is provided. See `09-pylon-auto-fetch.md`. Use the `attachment-analysis` skill for guidance.

### Step 1: Classify the Issue + Score Confidence

Generate a classification scorecard with confidence percentages. Thresholds: >80% high, 50-80% moderate, 30-50% investigate both, <30% ask questions. Use the `classify-issue` skill.

### Step 1.25: Scope Boundary Decision (REQUIRED)

For each symptom, put it in one of these buckets:

| Bucket                  | Definition                                               | Example                                              |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| **Your product**        | Something your code, API, SDK, docs owns                 | API returns 500 on a documented input                |
| **Your-adjacent infra** | Resources you provision or sign for                      | A signed URL issued by your service account          |
| **Customer infra**      | Customer's VPC, DNS, IAM, firewalls, runtime images      | `*.internal.customer.com` unreachable from their VPC |
| **Third-party**         | Upstream vendor, OS, OSS dependency outside your control | 429 from an upstream API                             |
| **User / config error** | Correct product, wrong usage                             | Wrong parameter value                                |

The investigator focuses on your-product + your-adjacent-infra. For customer-infra or third-party buckets, the responder offers guidance but does not own the fix. Mixed cases are common — split symptoms and handle each.

### Step 1.5: Investigation Ledger

Before deeper searching, keep a lightweight ledger:

- **Objective**: what problem you're resolving
- **Constraints**: SDK, deployment type, version
- **Known facts**: verified facts only, with evidence
- **Active hypotheses**: primary plus up to two alternatives
- **Open questions**: what still blocks a confident answer
- **Next discriminating action**: the single best next step

After each check, update: action taken, outcome, hypothesis status change, dead end, next action.

### Step 2: Pylon Historical Search

Required for errors/bugs/regressions. See `11-pylon-historical-search.md` and the `historical-search` skill.

### Step 3: Check Documentation

```
Grep(pattern="<feature>", path="product/docs/", glob="*.md", output_mode="content", "-C"=5)
```

### Step 4: Search Codebase

Branching rules:

- **Evidence strengthens lead hypothesis**: continue deeper.
- **Evidence contradicts it**: backtrack and reconcile before continuing.
- **Two paths remain plausible**: choose the next action that best separates them.
- **After two non-discriminating actions**: broaden scope or ask the customer.

### Step 5: Verify Findings

Use the appropriate level (Quick / Full). See `03-verification-checklist.md`.

### Step 6: Respond to Customer

Format per `07-response-format.md`. Synthesize content. End with the send-ready message per `99-final-customer-response.md`. If bug confidence >80%, use the `pr-draft` skill.

Evidence rules:

- **Internal triage**: include `file:line` + Pylon identifiers (internal-only).
- **Customer reply**: customer-safe only.

### Delta / Follow-Up Runs

See `incremental-investigation` skill for how messages are split and when to use each mode. Reconcile previous conclusions with any new evidence before reusing them. Preserve still-active theories; mark contradicted prior conclusions as refuted.

## Mandatory Steps

1. **Auto-fetch Pylon case if case number provided**
2. **Detect customer's SDK** — ALL code examples must match their SDK
3. **Search Pylon for similar cases**
4. **Check documentation** in `product/docs/`
5. **Verify before answering**
6. **Include evidence** — `file:line` in internal triage; public docs URLs in customer reply
7. **SDK-specific examples** — never mix languages
8. **Ask clarifying questions** when needed
9. **No local persistence** — don't write or update local files as part of support work

## When to Escalate

Use the `escalation` skill. Before escalating, ensure the handoff includes:

- Known facts with evidence
- Active hypotheses and what was ruled out
- Actions already taken and their outcomes
- What still needs to be answered next
