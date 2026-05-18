# Verification Checklist

Run through this checklist BEFORE providing any solution.

## Pre-Investigation Gates (REQUIRED before the investigator runs)

- [ ] **Environment captured** — SDK + version, language runtime + version, deployment, endpoint/host if self-hosted, CLI version if relevant. See "Required Environment Capture" in `.claude/agents/support-triage.md`. If any field is missing and load-bearing, ask the customer before investigating.
- [ ] **Participant map** — each message author classified as internal support, requester, or third-party per `09-pylon-auto-fetch.md`.
- [ ] **Scope boundary** — every symptom placed in one of: your-product / your-infra / customer-infra / third-party / user-config-error. Investigator only pursues your-product + your-infra.

## Tiered Verification

### Quick Verification (Simple Issues)

Use for: straightforward questions, simple lookups, well-known features.

- [ ] File path exists (you read it)
- [ ] Referenced function/code is real (you saw it)
- [ ] Solution is actionable
- [ ] Customer-safe (if sending): prefer public docs URLs; `file:line` acceptable when helpful

### Full Verification (Complex Issues, New Documentation)

Use for: bug investigations, new KB entries, anything you're not 100% confident about.

- [ ] **Every file path exists** — did you actually read the file?
- [ ] **Line numbers are accurate** — did you verify the code is at those exact lines? (±5 lines OK for volatile code)
- [ ] **Function/class names are correct** — copied from source, not memory?
- [ ] **Env vars are actually used** — did you grep and confirm the var is read somewhere?
- [ ] **Config options are valid** — did you find them defined in the codebase?
- [ ] **Solution matches current code** — has the code changed since you last checked?
- [ ] **API endpoint exists** — did you verify the route is defined?
- [ ] **SDK method exists** — did you check the actual SDK source?
- [ ] **Documented behavior matches code** — do docs and implementation agree?
- [ ] **Cross-referenced with second source** — can you confirm from 2+ places?
- [ ] **Customer-safe output** — no sensitive data; references appropriate for the audience
- [ ] **Conflicting evidence reconciled** — if one source disagreed with another, did you explain which won and why?

### Code Example Verification (CRITICAL — see `17-code-example-verification.md`)

**REQUIRED before including ANY code example in customer response:**

- [ ] **Pattern exists in SDK** — did you search the SDK source for this exact pattern/method?
- [ ] **Return values are real** — did you verify the return structure?
- [ ] **Method signature matches** — does it accept the parameters you're showing?
- [ ] **No invented APIs** — can you point to a `file:line` for every method/option?
- [ ] **Documented or in tests** — is this pattern shown in docs / cookbook / tests?

**If you cannot check ALL boxes, do NOT include the code example.**

### External Source Verification (CRITICAL)

**REQUIRED when using information from Pylon tickets:**

- [ ] **Casual mentions are NOT authoritative** — someone saying "use X" doesn't mean it exists
- [ ] **Verify technical claims against source** — always check the actual code
- [ ] **Support engineer statements need verification** — even internal team members can be mistaken
- [ ] **Historical cases may be outdated** — verify solutions still apply

### Cross-Reference Check

For high-confidence answers, verify from 2+ sources:

| Claim Type       | Source 1                         | Source 2               |
| ---------------- | -------------------------------- | ---------------------- |
| Feature behavior | `product/docs/`                  | Code implementation    |
| API endpoint     | API source                       | SDK client code        |
| Config option    | `.env.example` / env definitions | Code that reads it     |
| Error cause      | Error thrown in code             | Pylon historical cases |

### Negative/Exclusionary Claim Verification (CRITICAL)

**REQUIRED before claiming something is NOT used, NOT supported, or NOT involved:**

- [ ] **Read the full definition** — if claiming "X only uses A, not B", did you read the full type/enum/struct/interface?
- [ ] **Search for counterexamples** — did you grep for the thing you're claiming doesn't exist?
- [ ] **Check all callers** — is the feature used somewhere you didn't look?
- [ ] **Soften if uncertain** — if you can't rule it out, say "The primary mechanism is A" instead of "It uses A, not B"

## Red Flags — Stop and Verify

If any of these occur, do NOT proceed without verification:

1. **"I believe…"** — Stop. Find proof.
2. **"This should…"** — Stop. Verify it does.
3. **"Typically…"** — Stop. Check this specific codebase.
4. **"The file is probably at…"** — Stop. Find the actual file.
5. **Copying solutions without verifying** — Stop. Code may have changed.
6. **"…not X" / "…rather than X" / "…instead of X"** — Stop. Verify X is actually not used.

## Confidence Ratings

Use these in your responses:

- **Verified**: found in code with `file:line` reference
- **Documented**: found in official docs
- **Previously solved**: found in Pylon historical cases (verify still applicable)
- **Unverified**: could not find source — clearly state this

## When You Cannot Verify

1. State clearly: "I could not find documentation/code for this"
2. Explain what you searched
3. Suggest where the answer might be found
4. Ask follow-up questions to narrow the search

NEVER fill gaps with assumptions. An honest "I don't know" beats a wrong answer.
