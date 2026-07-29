# Gravity Forms

**Category:** Lead capture

## What it's for

The WordPress plugin powering the site's contact and quote forms.

## How we use it

- Same open question as Roofle — the lead-flow-mapping task documents notification emails, CRM/Zapier links, and CallRail/Roofle embedding for every form on the site.

## What's actually confirmed vs. still open

Confirmed part of the real lead-flow stack (data/site-facts.json: fact-lead-stack). Exact form-by-form destination wiring is unverified/open.

## Cautionary Notes

- Flag any form sending leads only to a personal inbox with no record — that's a real risk, not a hypothetical.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-gravity-forms`). data/site-facts.json, data/tasks.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
