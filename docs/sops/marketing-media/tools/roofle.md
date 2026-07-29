# Roofle

**Category:** Lead capture

## What it's for

Instant roofing-quote tool embedded on the site, generating leads directly.

## How we use it

- One of the forms whose destination is being mapped in the open lead-flow-mapping task — where Roofle submissions actually land (CRM, email, or otherwise) is not yet fully confirmed.

## What's actually confirmed vs. still open

Confirmed part of the real lead-flow stack (data/site-facts.json: fact-lead-stack), but exact wiring is unverified/open (task t7bc1058ff4294488, currently in progress).

## Cautionary Notes

- Do not assume Roofle leads are reaching a tracked destination until the lead-flow map confirms it.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-roofle`). data/site-facts.json, data/tasks.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
