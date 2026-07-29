# Birdeye

**Category:** Reviews / Local listings

## What it's for

Manages Google Business Profile (GBP) listings, review requests, and review replies across every market/office.

## How we use it

- Weekly: check for new reviews on Google + Birdeye, draft replies for Mikey's approval, flag anything needing a phone call.
- Monthly: pull new-review count + average rating per location against the 8-12/mo target; adjust ask timing/channel if a market is behind pace.
- NAP/category/hours audits and updates go through here — Birdeye is the single place GBP listings get edited.

## What's actually confirmed vs. still open

Confirmed already owned/in use (data/tasks.json: 'Birdeye (already owned)'). The automated review-request-on-job-completion configuration and the per-market baseline are open build tasks, not yet live.

## Cautionary Notes

- Draft replies for approval — do not post without sign-off, especially for negative reviews.
- Never use a CallRail number as the listed NAP phone number here.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-birdeye`). data/tasks.json, data/cadence.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
