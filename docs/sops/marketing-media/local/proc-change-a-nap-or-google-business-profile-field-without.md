# Change a NAP or Google Business Profile field without creating conflicting citations

**Department:** Local SEO / Google Business Profile
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Update a listing field (name, address, phone, hours, category) so every source of truth stays consistent — GBP, site schema, and citations.

## Procedure

1. Read-only: capture the current live NAP, category, and hours across GBP, the website, and any known top citations before proposing a change.
2. Draft the proposed change with a clear reason (closure, phone change, hours update, new service category, etc.).
3. Never use a CallRail dynamic tracking number as the public GBP/citation phone number.
4. Present the before/after for approval — do not apply the change speculatively.
5. Mikey applies the approved change directly in Birdeye/GBP — an agent drafts, it does not log in or publish.
6. After the change is live, confirm it is consistent across GBP, site schema, and the website's visible NAP.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Never use a CallRail dynamic tracking number as the public GBP/citation NAP phone number.
- Mikey approves and posts NAP/category/hours changes in Birdeye/GBP directly — draft, don’t publish.

---

Source: `data/procedures.json` (id: `proc-nap-gbp-update`). Derived from docs/wordpress-safety.md (never use CallRail number as public NAP) and the LOCAL-phase tasks already in data/tasks.json (GBP cleanup, exteriors listing update). Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
