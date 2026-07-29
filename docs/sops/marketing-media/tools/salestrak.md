# SalesTrak

**Category:** CRM / Sales pipeline

## What it's for

The CRM sales reps use to pin leads on a map, move jobs through Insurance/Cash workflows, and track everything from first contact through invoicing/A-R.

## How we use it

- Every lead becomes a pin/project in SalesTrak (Map → Add Project), tagged Residential/Commercial, Inbound/Self-Gen, with a Stage (Observed Damage / No Visible Damage / Aged Roof) and a Lead Source.
- Jobs move through the Leads workflow, then automatically or manually into Insurance Jobs or Cash Jobs stages, then Approvals, then the post-sale Scheduling/Production/Invoicing/A-R stages.
- Rooflink integration: moving a job into 'Inspection Scheduled' should auto-create it in Rooflink; if that doesn't happen, move the job back one stage and retry.
- Marketing's interest in SalesTrak is primarily the Lead Source field (attribution) and the Lost Leads workflow (Not Interested / Interested in the Future / Not Enough Damage) — these should reconcile with GA4/CallRail/Meta attribution, not contradict it.

## What's actually confirmed vs. still open

Documented in detail in the separate Sales Representative SOP (Salestrak Desktop SOP.pdf, provided by Mikey). That SOP is the sales-team source of truth for SalesTrak procedure; this entry only summarizes the parts marketing needs to know for lead-source reconciliation.

## Cautionary Notes

- Marketing should read SalesTrak's Lead Source / Lost Leads data as a cross-check on attribution, not edit sales-side workflow stages directly.
- See the full Sales Representative SOP for anything beyond attribution reconciliation — don't duplicate sales-process detail here.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-salestrak`). Salestrak Desktop SOP.pdf (provided by Mikey, 2026-07-15), data/site-facts.json (fact-lead-stack) Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
