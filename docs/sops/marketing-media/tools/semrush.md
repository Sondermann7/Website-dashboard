# Semrush

**Category:** Research / Competitive intelligence

## What it's for

Competitor research, keyword-gap analysis, backlink auditing, and domain authority tracking.

## How we use it

- Monthly: re-pull domain_rank, domain_organic (top 50), domain_organic_organic, and a keyword-gap batch, compared against the prior baseline.
- The Backlink Audit / Backlinks report is used to identify and export confirmed spam/toxic referring domains (filtered by known spam anchor-text patterns) for a Google Search Console disavow file.
- Initial full pull completed June 2026 — that data lives in Bartlett-SEO-Intelligence.html on the Desktop, not in this repo.

## What's actually confirmed vs. still open

Confirmed in active use (data/tasks.json: monthly Semrush cadence item, disavow-file task). The Backlink Audit toxicity tool is UI-only, not API-accessible — exports must be pulled manually.

## Cautionary Notes

- A human must review the disavow domain list before it's ever submitted to Google — never auto-submit.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-semrush`). data/tasks.json, data/cadence.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
