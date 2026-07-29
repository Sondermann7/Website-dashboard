# Yoast SEO

**Category:** Website / SEO

## What it's for

The SEO plugin controlling page titles, meta descriptions, XML sitemaps, and taxonomy indexing settings for the WordPress site.

## How we use it

- SEO title + meta description edits for any page happen here (WordPress → Yoast → the page's SEO tab).
- The XML sitemap Yoast generates is what gets submitted to Google Search Console and Bing Webmaster Tools.
- Yoast's Settings → Content Types / Taxonomies screen controls which taxonomies (e.g. testimonial-tag, element-category) get their own sitemap entries and indexing — utility taxonomies unrelated to real content should be disabled here to avoid wasting crawl budget.

## What's actually confirmed vs. still open

Confirmed high-confidence as the SEO plugin in use, not Rank Math (data/site-facts.json: fact-seo-plugin).

## Cautionary Notes

- Not Rank Math — don't propose Rank Math-specific instructions.
- Verify any schema/meta change in View Source after publishing, not just the Yoast preview.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-yoast`). docs/wordpress-safety.md, data/site-facts.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
