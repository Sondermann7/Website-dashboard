# n8n / Zapier

**Category:** Automation

## What it's for

Automation/integration glue connecting forms, CRM, and notification tools together.

## How we use it

- Exact workflows (which automations exist, what they connect) are part of the open lead-flow-mapping task — document any CRM/Zapier link found for each form.

## What's actually confirmed vs. still open

Confirmed part of the real lead-flow stack (data/site-facts.json: fact-lead-stack). No specific workflow has been confirmed/documented yet.

## Cautionary Notes

- Don't assume an automation exists or works until the lead-flow map confirms it.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-automation-glue`). data/site-facts.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
