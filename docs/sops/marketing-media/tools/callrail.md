# CallRail

**Category:** Lead tracking

## What it's for

Call tracking with dynamic phone numbers, used to attribute inbound calls to their source/campaign.

## How we use it

- Weekly lead-review checks that GA4/CallRail/Meta attribution lines up for every new lead.
- Part of the tracking stack wired into ad landing pages alongside GA4 and the Meta Pixel.

## What's actually confirmed vs. still open

Confirmed part of the real lead-flow stack (data/site-facts.json: fact-lead-stack), but the exact current wiring is an open Discovery task (mapping where contact/quote forms submit).

## Cautionary Notes

- Never use a CallRail dynamic tracking number as the public GBP/citation NAP phone number — this is a hard rule, not a style preference.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-callrail`). data/site-facts.json (fact-callrail-nap-rule, fact-lead-stack) Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
