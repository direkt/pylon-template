---
name: classify-issue
description: Use when triaging a support issue to generate confidence scores for each issue type and determine investigation paths.
---

# Issue Classification Scoring

## Output Format

```
## Classification Confidence

| Issue Type | Confidence | Key Signals |
|------------|------------|-------------|
| [Primary]  | XX%        | [signals]   |
| [Secondary]| XX%        | [signals]   |

**Primary Path**: [highest confidence]
**Secondary Path**: [if >30%]
```

## Signal Weights

Add weights for detected signals. Strong (+30-40%), Moderate (+15-25%), Weak (+5-10%).

| Category        | Strong Signals                                                             | Moderate Signals                                 |
| --------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| **Error/Bug**   | Stack trace (+40%), 5xx error (+35%), exact error quoted (+30%)            | "error/failed" (+20%), "broken" (+15%)           |
| **Config**      | Env var mentioned (+35%), "setup/configure" (+30%), self-hosted (+25%)     | "not connecting" (+20%), config file ref (+20%)  |
| **SDK**         | SDK language explicit (+35%), version mentioned (+30%), method name (+25%) | import shown (+20%), "client/library" (+15%)     |
| **Performance** | Timeout error (+40%), "slow" (+30%), large numbers (+25%)                  | "hanging/stuck" (+25%), time measurements (+20%) |
| **Auth**        | 401/403 (+40%), "OAuth/SSO" (+35%), "login" (+30%)                         | "token/API key" (+25%), "permission" (+25%)      |
| **Regression**  | "was working" (+40%), "suddenly" (+35%), "after update" (+35%)             | "stopped/broke" (+25%), date reference (+20%)    |
| **How-To**      | "How do I" (+40%), "best practice" (+30%), feature question (+25%)         | "trying to" (+20%), no error described (+15%)    |

## Negative Signals

| Signal             | Effect                  |
| ------------------ | ----------------------- |
| Stack trace        | -20% How-To, User Error |
| "How do I"         | -30% Error/Bug          |
| Works for others   | -25% Bug, +20% Config   |
| "first time setup" | -20% Regression         |

## Algorithm

1. Start at 0% per category
2. Add signal weights
3. Cap at 95%
4. Apply negative signals
5. Rank categories
6. Identify primary (highest) and secondary (if >30%)

## Confidence Thresholds

| Confidence | Action                                     |
| ---------- | ------------------------------------------ |
| **>80%**   | High — proceed with primary path           |
| **50-80%** | Moderate — primary with secondary fallback |
| **30-50%** | Low — investigate both                     |
| **<30%**   | Unclear — ask clarifying questions         |
