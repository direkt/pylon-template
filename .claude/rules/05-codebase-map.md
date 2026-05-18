# Codebase Map — Where to Find Things

This is **YOUR** map. Fill it in with the real layout of your product so the investigator agent searches the right places.

> **TODO for adopters:** replace the placeholder paths below with the actual subfolders inside `product/code/` and the actual filenames inside `product/docs/`. The investigator agent uses these paths verbatim — wrong paths = wasted searches.

## Quick Reference (TEMPLATE — REPLACE)

| Looking for...            | Search here                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| API endpoints             | `product/code/<your-api>/src/routes.ts`                               |
| Database / storage        | `product/code/<your-storage>/src/`                                    |
| Authentication            | `product/code/<your-api>/src/auth/`                                   |
| SDK source — Python       | `product/code/<your-sdk-py>/src/`                                     |
| SDK source — JS/TS        | `product/code/<your-sdk-js>/src/`                                     |
| Web UI components         | `product/code/<your-web>/src/components/`                             |
| Documentation             | `product/docs/`                                                       |
| Environment variables     | `product/code/<your-api>/.env*`, `product/code/<your-api>/src/env.ts` |
| Infrastructure / IaC      | `product/code/<your-infra>/`                                          |
| Runbooks & internal notes | `product/notes/`                                                      |

## Common Search Patterns

> **Note:** `Grep` returns file paths by default. Add `output_mode="content"` to see matching lines, or `output_mode="content", "-C"=5` for context.

### Find API endpoint

```
Grep(pattern="router\\.(get|post|put|delete).*/<endpoint>", path="product/code/<your-api>/src/")
```

### Find where error is thrown

```
Grep(pattern="<exact error message>", path="product/code/")
```

### Find env var usage

```
Grep(pattern="process\\.env\\.<VAR_NAME>|<VAR_NAME>", path="product/code/")
```

### Find SDK method

```
# Python
Grep(pattern="def <method_name>", path="product/code/<your-sdk-py>/src/")

# TypeScript
Grep(pattern="<methodName>", path="product/code/<your-sdk-js>/src/")
```

### Find UI component

```
Glob(pattern="**/*<ComponentName>*.tsx", path="product/code/<your-web>/")
```

### Find documentation

```
Grep(pattern="<feature>", path="product/docs/", glob="*.md")
Grep(pattern="<feature>", path="product/docs/", glob="*.mdx")
```

## Common File Patterns

| File Pattern             | Purpose                          |
| ------------------------ | -------------------------------- |
| `*_types.ts`, `types.ts` | TypeScript type definitions      |
| `index.ts`               | Module exports, entry points     |
| `*.test.ts`, `*.spec.ts` | Tests                            |
| `env.ts`, `.env*`        | Environment variable definitions |
| `constants.ts`           | Constant values, config          |
| `util.ts`, `utils.ts`    | Utility/helper functions         |
| `schema.ts`              | Validation schemas               |
| `__init__.py`            | Python module entry              |

## How to use this file

1. Replace every `<your-...>` placeholder above with your actual folder/file names.
2. Add any product-specific search patterns that come up repeatedly.
3. Keep this file updated as your codebase evolves — wrong paths waste agent time.
