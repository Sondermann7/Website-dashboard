# Bing Webmaster Tools

**Category:** Measurement

## What it's for

Bing's equivalent of Search Console — index coverage on Bing, and relevant to Microsoft/Copilot-style discovery.

## How we use it

- Account creation and sitemap submission (the Yoast XML sitemap URL) is a one-time setup task, followed up ~2 weeks later to check coverage.

## What's actually confirmed vs. still open

Not yet set up as of the last known status — this is an open task (t70b3e78f599c450c), not a live/confirmed account.

## Cautionary Notes

- Treat Bing as one important index source, not a guaranteed ChatGPT/Copilot citation lever.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-bing-webmaster`). data/tasks.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
