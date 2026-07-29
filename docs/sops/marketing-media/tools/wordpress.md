# WordPress

**Category:** Website / CMS

## What it's for

The CMS the entire bartlettroofs.com website runs on. Every page, post, and location page lives here.

## How we use it

- All page/content edits happen in WordPress admin, built in Draft and shown in Preview before anything publishes.
- The page builder is Avada/Fusion Builder — not Elementor. Global Avada templates affect many pages at once; never bulk-edit one without knowing every page it touches.
- A custom post type named 'service-areas' powers the individual city/location pages (e.g. /service-areas/boise-id/).
- Yoast (see separate entry) is installed on top of WordPress for SEO fields.

## What's actually confirmed vs. still open

Confirmed high-confidence (data/site-facts.json: fact-cms, fact-service-areas-cpt). The full active-plugin list was inventoried once (task ta983d02c21c843f2, done) — see memory/log.md and the dashboard's Archive tab for that snapshot rather than assuming it here.

## Cautionary Notes

- Never touch the live site unless explicitly asked — read-only discovery is the default.
- Confirm a working, restorable backup exists before any live-site change.
- Mikey logs in. Never ask for or handle WordPress or hosting passwords.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-wordpress`). docs/wordpress-safety.md, data/site-facts.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
