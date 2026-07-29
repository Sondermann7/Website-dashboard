# Marketing & Media SOPs

Standard operating procedures for the marketing/media/SEO workflows on Bartlett Roofing &
Exteriors. Generated from `data/cadence.json`, `data/procedures.json`, and
`data/tool-reference.json` — run `npm run sops` after editing any of those to regenerate this
index and every file. Mirrored to `Desktop/SOPs/Marketing and Media` for access outside this
repo. Internal dashboard/repo-tooling procedures live separately in `docs/sops/internal-ops/`
(not marketing/media work, and not mirrored to Desktop).

## The bus-factor test

Every SOP and tool-reference file here is written so that someone with no prior context —
another hire, a different agency, a future AI session — could open it and understand not just
*what* to do, but *which program* to do it in and *how that program fits into the bigger
picture*. That is the bar: could a stranger pick this up cold and know how everything works?

## What earns an SOP

The test: **would someone else — or you in 3 months — need to reproduce this exact sequence
of steps to get the same result?** If yes, it’s an SOP. If it’s a one-off judgment call with no
repeatable path, it stays a `memory/log.md` entry instead.

**Write one when the change/workflow is:**
- A recurring workflow (anything with a `freq` in `data/cadence.json`)
- A multi-click procedure in a specific tool that isn’t self-evident
- Safety/reversal-critical (redirects, NAP edits, schema, backups, noindex)
- A cross-tool or cross-person handoff that has to survive someone else picking it up

**Skip it when it’s:**
- A one-off content edit with no repeatable click-path
- Exploratory research with no fixed method
- A single decision with no procedure behind it
- Already covered by an existing SOP — update that one instead of duplicating

## AI-assisted work

- [How AI-Assisted Work Fits Into Marketing & Media](ai-assisted-work.md)

## Programs & tools reference

One file per program/system actually used for marketing & media work — what it's for, how we
use it here, and what's confirmed vs. still an open question. Not click-by-click tutorials for
the tool in general — that's what the vendor's own docs are for.

- [WordPress](tools/wordpress.md) — Website / CMS
- [Yoast SEO](tools/yoast-seo.md) — Website / SEO
- [Avada / Fusion Builder](tools/avada-fusion-builder.md) — Website / Page builder
- [Google Search Console](tools/google-search-console.md) — Measurement
- [Google Analytics 4 (GA4)](tools/google-analytics-4-ga4.md) — Measurement
- [Google Tag Manager (GTM)](tools/google-tag-manager-gtm.md) — Measurement
- [Bing Webmaster Tools](tools/bing-webmaster-tools.md) — Measurement
- [Semrush](tools/semrush.md) — Research / Competitive intelligence
- [CallRail](tools/callrail.md) — Lead tracking
- [Birdeye](tools/birdeye.md) — Reviews / Local listings
- [Meta Business Manager](tools/meta-business-manager.md) — Paid media
- [Roofle](tools/roofle.md) — Lead capture
- [Gravity Forms](tools/gravity-forms.md) — Lead capture
- [SalesTrak](tools/salestrak.md) — CRM / Sales pipeline
- [n8n / Zapier](tools/n8n-zapier.md) — Automation

## Departments (by phase)

### Technical & Site Health (`DISCOVERY`)

**Recurring (from data/cadence.json):**
- [Check Search Console for new errors + movers](discovery/weekly-check-search-console-for-new-errors-movers.md) — weekly
- [Full site crawl for 404s, orphans, broken redirects](discovery/monthly-full-site-crawl-for-404s-orphans-broken-redirects.md) — monthly
- [Confirm the backup ran successfully](discovery/monthly-confirm-the-backup-ran-successfully.md) — monthly

### Content & On-Page (`CONTENT`)

**Recurring (from data/cadence.json):**
- [Publish or refresh one content piece](content/weekly-publish-or-refresh-one-content-piece.md) — weekly

**Standing procedures (from data/procedures.json):**
- [Create a 301 redirect without losing a page's traffic or causing a 404](content/proc-create-a-301-redirect-without-losing-a-page-s-traffic-or.md)
- [Build a new location, service, or exteriors page that matches brand and GEO formatting from day one](content/proc-build-a-new-location-service-or-exteriors-page-that-matches.md)

### Local SEO / Google Business Profile (`LOCAL`)

**Recurring (from data/cadence.json):**
- [Reply to new reviews within 48h](local/weekly-reply-to-new-reviews-within-48h.md) — weekly

**Standing procedures (from data/procedures.json):**
- [Change a NAP or Google Business Profile field without creating conflicting citations](local/proc-change-a-nap-or-google-business-profile-field-without.md)

### Reputation & Reviews (`REVIEWS`)

**Recurring (from data/cadence.json):**
- [Review-velocity scorecard per market](reviews/monthly-review-velocity-scorecard-per-market.md) — monthly

### Link Building & Outreach (`LINKS`)

**Recurring (from data/cadence.json):**
- [Link-building outreach block (90 min)](links/weekly-link-building-outreach-block-90-min.md) — weekly

### Competitive Intelligence & Measurement (`RESEARCH`)

**Recurring (from data/cadence.json):**
- [Re-run the 30-query AI visibility baseline](research/monthly-re-run-the-30-query-ai-visibility-baseline.md) — monthly
- [Semrush: competitor + keyword-gap recheck](research/monthly-semrush-competitor-keyword-gap-recheck.md) — monthly
- [30/60/90 gate check — jobs won, not rankings](research/monthly-30-60-90-gate-check-jobs-won-not-rankings.md) — monthly

### AI Visibility (GEO) (`GEO`)

**Recurring (from data/cadence.json):**
- [Re-run 5 priority AI queries; log citation deltas](geo/weekly-re-run-5-priority-ai-queries-log-citation-deltas.md) — weekly
- [Refresh top 5 pages when there is a real update](geo/monthly-refresh-top-5-pages-when-there-is-a-real-update.md) — monthly

**Standing procedures (from data/procedures.json):**
- [Verify structured data (JSON-LD) the way AI and search crawlers actually see it](geo/proc-verify-structured-data-json-ld-the-way-ai-and-search.md)

### Exteriors Line Launch (`EXTERIORS`)

_No SOPs yet for this department._

### Paid Media & Landing Pages (`ADS`)

**Recurring (from data/cadence.json):**
- [Review new leads + attribution](ads/weekly-review-new-leads-attribution.md) — weekly
- [Review ad landing-page performance](ads/monthly-review-ad-landing-page-performance.md) — monthly

## Non-recurring tasks

One-off tasks in `data/tasks.json` (launches, migrations, one-time fixes) do not auto-generate
an SOP here. If a one-off task turns out to establish a repeatable procedure (you catch
yourself re-deriving the same steps a second time), promote it manually: add a cadence-style
entry to `data/cadence.json` if it’s truly recurring, or hand-write a file in the relevant
department folder following the same Objective / Procedure / Cautionary Notes shape.

## Sales (not generated here)

SalesTrak's full sales-rep procedure (pin creation, workflow stages, Rooflink handoff) lives in
the separate *Salestrak Desktop SOP.pdf* Mikey provided — that is the sales-team source of truth.
The [SalesTrak tool-reference entry](tools/salestrak.md) here only covers what marketing needs
for lead-source attribution reconciliation.
