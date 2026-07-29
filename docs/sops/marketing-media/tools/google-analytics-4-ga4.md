# Google Analytics 4 (GA4)

**Category:** Measurement

## What it's for

Primary web analytics/behavior tracking — traffic, conversions, and (once fixed) lead attribution.

## How we use it

- Weekly: cross-referenced with CallRail and Meta to confirm every lead has source/campaign attribution.
- Used with Tag Assistant/DebugView to verify a tracking change actually fires one clean event, rather than assuming a fix worked.
- Landing page performance (LCP, conversion rate, cost per lead) is reviewed here monthly alongside PageSpeed Insights and Meta.

## What's actually confirmed vs. still open

Access confirmed working with a 90-day baseline pulled (task t74893df606e34be5, done). A suspected double-fire (GA4 firing via both Site Kit and GTM simultaneously, inflating numbers) is an open Discovery task — treat current GA4 volume numbers as potentially overstated until that's resolved (data/site-facts.json: fact-tracking-gaps).

## Cautionary Notes

- Never change GA4 tracking or event/form destinations without explicit approval.
- Verify with DebugView/a real test lead — don't assume a tracking change worked.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-ga4`). docs/ads-safety.md, data/site-facts.json, data/tasks.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
