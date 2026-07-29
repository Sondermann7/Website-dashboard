# Full site crawl for 404s, orphans, broken redirects

**Department:** Technical & Site Health
**Frequency:** monthly
**Where:** Crawler (Screaming Frog / SearchAtlas)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Catch link rot before it accumulates.

## Procedure

1. Crawl the full site for 404s, orphan pages, broken redirects, missing titles/meta.
2. Deliver a prioritized fix list.
3. Fix the critical ones in Draft for approval.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Findings only — do not noindex, redirect, or delete anything from a Discovery pass without logging it in the triage tracker and getting approval first.

---

Source: promoted from `data/cadence.json` (id: `tf2b690b572134036`). Edit the cadence entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
