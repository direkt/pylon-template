# Code & Infrastructure Verification (CRITICAL — Anti-Hallucination)

**CRITICAL**: NEVER suggest code patterns, API methods, function signatures, SDK behaviors, OR infrastructure outputs/configs without verifying they exist in the actual source. Hallucinated examples damage customer trust and waste their time.

## The Golden Rule

**If you cannot find it in `product/code/`, do not suggest it.**

Before including ANY code example in a customer response:

1. **Search the SDK source** for the exact method/pattern you're about to suggest
2. **Read the actual implementation** to confirm it works as you expect
3. **Cite the source** (`file:line`) in your internal triage
4. **If you cannot find it**, do NOT suggest it — instead say "I couldn't find a built-in way to do this"

## Mandatory Verification Steps

### Before Suggesting ANY SDK Pattern

```
# REQUIRED: Search for the pattern in the actual SDK
Grep(pattern="<method_name>|<class_name>", path="product/code/<your-sdk>/", output_mode="content")

# REQUIRED: Read the file to understand the actual API
Read(file_path="<found_file>")

# REQUIRED: Check docs for official examples
Grep(pattern="<feature>", path="product/docs/", glob="*.md")
```

### Verification Checklist (REQUIRED before finalizing code examples)

- [ ] **Method exists**: did you find this method/function in the SDK source?
- [ ] **Signature matches**: does the method accept the parameters you're showing?
- [ ] **Return type matches**: does the method return what you're claiming?
- [ ] **Pattern is documented**: is this pattern shown in official docs/examples?
- [ ] **No invented APIs**: are you 100% certain you didn't make up this API?

## Common Hallucination Patterns to AVOID

### 1. Invented Return Values/Options

**BAD** (hallucinated):

```python
def my_task(input):
    if condition:
        return {"skip": True}  # THIS IS MADE UP
```

**GOOD** (verified):

```python
# Verified: scorers can return None to skip (product/docs/evals.md:489)
def my_scorer(input, output, expected):
    if condition:
        return None  # Skip this score
    return compute_score()
```

### 2. Invented Configuration Options

**BAD**:

```python
# WRONG — skip_empty is not a real option
experiment = acmecloud.init_experiment("project", skip_empty=True)
```

**GOOD**:

```python
# Verified: actual init_experiment signature in product/code/sdk-py/src/acmecloud/__init__.py:XXX
experiment = acmecloud.init_experiment("project", "experiment")
```

### 3. Invented Environment Variables

**BAD**:

```bash
# WRONG — this env var doesn't exist
export ACMECLOUD_SKIP_VALIDATION=true
```

**GOOD**:

```bash
# Verified: Grep(pattern="ACMECLOUD_", path="product/code/sdk-py/")
# Found in product/code/sdk-py/src/acmecloud/logger.py:45
export ACMECLOUD_API_KEY=your_key
```

### 4. Plausible-Looking But Fake APIs

These patterns LOOK real but may not exist:

- `{"skip": True}` — plausible but doesn't exist
- `result.skip()` — plausible but doesn't exist
- `@acmecloud.skip_if(condition)` — plausible but doesn't exist
- `experiment.filter(lambda x: ...)` — plausible but may not exist

**ALWAYS VERIFY** before suggesting any method or pattern.

## What To Do When You Can't Find a Feature

### DO Say:

> "I searched the SDK and couldn't find a built-in `skip` mechanism for eval tasks. The available options are:
>
> 1. [Verified option from docs]
> 2. [Verified option from code]
>
> If you need this functionality, you could [suggest a workaround using verified APIs]."

### DON'T Say:

> "You can use `return {"skip": True}` to skip rows."

(This is made up and will waste the customer's time.)

## Verification Sources by Priority

1. **SDK Source Code** (highest trust) — the actual implementation in `product/code/`
2. **Official Documentation** (high trust) — `product/docs/`; may lag behind code
3. **Cookbook Examples** (medium trust) — working examples; may be outdated
4. **Test Files** (medium trust) — show real usage patterns

## External Source Verification

**REQUIRED when using information from Pylon tickets:**

- [ ] **Casual mentions are NOT authoritative** — someone saying "use X" doesn't mean it exists
- [ ] **Verify technical claims against source** — always check the actual code
- [ ] **Support engineer statements need verification** — even internal team members can be mistaken
- [ ] **Historical cases may be outdated** — verify solutions still apply

## Red Flags — Stop and Search

If you catch yourself writing any of these, STOP and verify:

**Code/SDK Red Flags:**

- "You can return `{...}` to…"
- "Set the `X` option to…"
- "Use the `skip`/`exclude`/`filter` parameter…"
- "The SDK supports…"
- Any method name you haven't seen in `product/code/`

**Negative/Exclusionary Claim Red Flags (CRITICAL):**

- "…based on X, **not** Y" — did you verify Y is actually not used? Read the full type definition.
- "…only uses X" — did you check for other mechanisms/variants?
- "…does not use the `id` field" — did you grep for all usages of the field?
- Any claim that a field, method, or mechanism is NOT involved requires searching for counterexamples.
- **The rule**: finding that A is used does NOT prove B is not used.

**Infrastructure Red Flags:**

- "The `X` output from the module…"
- "Use the `ProxyURL`/`LambdaURL`/`DirectEndpoint`…"
- "The module exposes…"
- Any infrastructure output name you saw in a ticket but didn't verify in the actual module.

## Integration with Response Format

In your `<internal_triage>` section, include verification notes:

```markdown
## Code Examples Verification

- Pattern A: Verified in product/code/sdk-py/src/acmecloud/framework.py:489
- Pattern B: NOT FOUND — removed from response
- Pattern C: Verified in product/docs/evals.md:518-522
```
