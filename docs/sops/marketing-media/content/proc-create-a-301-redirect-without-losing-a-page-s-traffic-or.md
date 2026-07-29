# Create a 301 redirect without losing a page's traffic or causing a 404

**Department:** Content & On-Page
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Redirect or remove a URL cleanly — every source URL accounted for, every destination verified, no orphan links or new 404s.

## Procedure

1. Identify every place the source URL is referenced: sitemap entries, internal links, menu/footer links, and any known backlinks.
2. Add a row to the redirect-map tracker (data/redirect-map.json) — source, target, reason, owner, approval status — before touching anything live. No redirect goes live without a tracker row.
3. Confirm the target URL is correct, live, and actually the best-matching replacement for the source's intent.
4. Get explicit approval on the source-to-target row before publishing anything.
5. Implement one redirect at a time — never batch multiple redirects in a single pass.
6. Verify the resulting status code is 301 (not 302), and that there is no redirect chain (source should resolve in a single hop to the final live destination).
7. Update the XML sitemap and re-crawl the affected area to confirm no new 404s or orphan links were introduced.
8. Mark the tracker row resolved with the verification date and evidence (crawl export or screenshot).

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Build in Draft/Preview. Nothing publishes without explicit approval.
- Avada/Fusion Builder is the page builder (not Elementor); Yoast is the SEO plugin (not Rank Math).
- One change at a time for redirects, templates, schema, or location pages — batching hides which change caused a regression.

---

Source: `data/procedures.json` (id: `proc-redirect-301`). Derived from docs/wordpress-safety.md (one change at a time; verify status codes and no 404s) and the redirect-shaped tasks already in data/tasks.json (Pleasant Grove removal, 109-page tiering). Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
