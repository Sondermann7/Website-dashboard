# Golgotha Fellowship Website Rebuild Reference Pack

Research date: November 16, 2026. Location: Nampa, Idaho, USA.

## Contents

- `CLAUDE_CODE_MASTER_PROMPT.md`: paste this entire file into Claude Code as the primary brief.
- `RESEARCH_AND_CONTENT_INVENTORY.md`: source-checked church facts, theology, site map and existing-brand inventory.
- `DESIGN_TOKENS.json`: proposed new design colors and interface rules; these are NOT verified legacy brand colors.
- `capture_existing_site.mjs`: run from a machine with internet access to create real screenshots, a computed-style report and media asset inventory.
- `SOURCE_LINKS.md`: official source pages and images, plus external verification sources.

## Screenshot status

Actual website screenshots could not be captured in this environment. The browser's network access to the church website was blocked. Do not mistake this for a completed visual brand audit. Run the included Playwright capture script on an internet-enabled machine. It saves both desktop and mobile full-page screenshots. After capture, inspect the results before finalizing logo treatment, typography or current-site color claims.

Quick command (in a new or existing Node project with Playwright available):

    npm install -D playwright
    npx playwright install chromium
    node capture_existing_site.mjs

The script creates `reference/screenshots`, `reference/site_style_audit.json`, and `reference/site_media_inventory.json`. It does not modify the live church website.

## Important information boundaries

- The current official church site is the primary source for location, hours, identity, doctrine and public contact details.
- Exact original site hex colors, actual rendered screenshot appearance and rights to its media could not be independently verified from this environment.
- Any new design palette is a PROPOSAL, not claimed as an existing brand standard.
- Before launch, confirm all service times, ministry schedules, leadership titles, form destinations, giving link and imagery permissions with the church.
- Copy meaning faithfully, especially the Statement of Faith. No paraphrase should be represented as an official statement unless approved by church leadership.
