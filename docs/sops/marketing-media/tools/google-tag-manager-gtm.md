# Google Tag Manager (GTM)

**Category:** Measurement

## What it's for

Tag/trigger management layer sitting in front of GA4, the Meta Pixel, and other tracking scripts.

## How we use it

- The likely source of the suspected GA4 double-fire (GA4 firing via both Site Kit and GTM) — GTM is the presumed single source of truth to keep once that's resolved.
- Used to fire GA4, Meta Pixel, and CallRail tags on new ad landing pages, along with a defined UTM convention.

## What's actually confirmed vs. still open

Existence/use inferred from the GA4 de-dupe task and ads tracking tasks — the exact current tag/trigger configuration has not been audited yet. Treat as an open Discovery item, not a confirmed-clean setup.

## Cautionary Notes

- Never change GTM tags/triggers/destinations without explicit approval.
- One change at a time; verify via Tag Assistant after each change.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-gtm`). data/tasks.json (GA4 double-fire task), data/site-facts.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
