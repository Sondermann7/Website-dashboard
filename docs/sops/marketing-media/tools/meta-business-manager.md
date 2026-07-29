# Meta Business Manager

**Category:** Paid media

## What it's for

Manages Facebook/Instagram ad campaigns, the Meta Pixel, and domain verification for ad landing pages.

## How we use it

- Ad landing pages in /lp/ get the Meta Pixel wired in alongside GA4 and CallRail, with a defined UTM convention.
- Domain verification for the ad landing-page domain has to be completed here before some ad features work.

## What's actually confirmed vs. still open

The landing-page build and tracking-wiring tasks (t{e2605450...}, t{f2104dbec...}) are open/not yet built — this is the intended architecture, not a confirmed-live setup.

## Cautionary Notes

- Meta domain verification and pixel wiring require Mikey to complete the actual steps in Meta Business Manager — an agent can guide, not log in on his behalf.
- Never invent stats, service areas, or claims in ad copy — if a number isn't verified, don't use it.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-meta-business-manager`). docs/ads-safety.md, data/tasks.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
