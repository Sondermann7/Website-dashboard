# Build a new location, service, or exteriors page that matches brand and GEO formatting from day one

**Department:** Content & On-Page
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Ship a new page that is on-brand, genuinely differentiated, and answer-ready — not a templated clone.

## Procedure

1. Confirm the URL, nav placement, and market mapping as an approved structure before building anything.
2. Pull the existing Avada brand tokens/template so the new page matches the site exactly — Avada/Fusion Builder is the page builder, not Elementor.
3. Write genuinely differentiated copy for this page — no cloned paragraphs shared with similar pages.
4. Add a 40-60 word direct-answer intro at the top of the page.
5. Add accurate LocalBusiness/Service/Breadcrumb schema and verify it per the schema-verification procedure.
6. Build the page in Draft and show a Preview link for approval.
7. Leave real image placeholders for Mikey's own photos rather than presenting stock/generic images as real project photos.
8. Publish only on explicit approval.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Build in Draft/Preview. Nothing publishes without explicit approval.
- Avada/Fusion Builder is the page builder (not Elementor); Yoast is the SEO plugin (not Rank Math).
- One change at a time for redirects, templates, schema, or location pages — batching hides which change caused a regression.

---

Source: `data/procedures.json` (id: `proc-new-page-build`). Derived from the CONTENT/EXTERIORS-phase task patterns already in data/tasks.json (Boise page, Exteriors hub, individual service pages) and docs/wordpress-safety.md. Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
