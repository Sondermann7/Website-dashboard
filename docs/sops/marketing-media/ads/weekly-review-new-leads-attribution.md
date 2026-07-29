# Review new leads + attribution

**Department:** Paid Media & Landing Pages
**Frequency:** weekly
**Where:** CRM + GA4 + Meta
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Make sure every lead is tracked to its source.

## Procedure

1. Pull this week's leads; confirm each has source/campaign.
2. Flag any with broken/missing attribution.
3. Report best + worst performing ad page this week.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Do not change GA4/GTM/CallRail/Meta tracking or form destinations without explicit approval.
- Verify test events with DebugView/Tag Assistant or a real test lead — don’t assume tracking works.
- Landing pages in /lp/ must be set to noindex.
- Meta domain verification and pixel wiring require Mikey to complete the actual steps in Meta Business Manager.

---

Source: promoted from `data/cadence.json` (id: `tcc8b3e86f4f84aff`). Edit the cadence entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
