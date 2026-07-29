# Avada / Fusion Builder

**Category:** Website / Page builder

## What it's for

The visual page-building tool used to lay out every page on the site, including new location and service pages.

## How we use it

- New pages (Exteriors hub, service pages, location pages) are built by pulling the existing Avada brand tokens/template so they match the rest of the site.
- Global Avada templates apply to many pages at once — a change to one propagates everywhere it's used.

## What's actually confirmed vs. still open

Confirmed high-confidence as the page builder in use, not Elementor (data/site-facts.json: fact-cms).

## Cautionary Notes

- Never bulk-edit an Avada global template without understanding every page it affects.
- Build in Draft, show Preview, publish only on approval.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-avada`). docs/wordpress-safety.md Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
