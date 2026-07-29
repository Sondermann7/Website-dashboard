# Verify structured data (JSON-LD) the way AI and search crawlers actually see it

**Department:** AI Visibility (GEO)
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Confirm schema is present, accurate, and machine-readable in raw HTML — not just in the rendered page.

## Procedure

1. Open View Source for the page (Ctrl+U or equivalent) — never rely on the browser inspector/rendered DOM alone.
2. Locate the JSON-LD <script> block(s) directly in the raw HTML response, confirming they are not injected only after JavaScript executes.
3. Confirm the schema type(s) present match what the page needs (Organization, LocalBusiness, Service, Breadcrumb, Article, or Person as applicable).
4. Confirm every NAP field in the schema exactly matches the live Google Business Profile listing — no discrepancies in name, address, or phone.
5. Validate the markup with the current official rich-results/schema validator tool (not a cached or third-party mirror).
6. Report pass/fail per page type, and flag any assumption based on a deprecated or unsupported rich-result feature.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Schema must be verified in View Source (raw HTML), not the rendered DOM — AI crawlers generally skip JS execution.
- Separate search/index crawlers from training crawlers; verify any bot-specific claim against current official docs before stating it as fact.
- Treat AI-visibility work as a measurement system, not a promise that any engine will cite or rank Bartlett.

---

Source: `data/procedures.json` (id: `proc-schema-verification`). Derived directly from docs/ai-search-rules.md (schema must render in raw HTML; verify against current official docs). Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
