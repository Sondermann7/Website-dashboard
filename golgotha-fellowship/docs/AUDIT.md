# Phase 1 audit: asset inventory and content migration checklist

Audit date: 2026-11-16. Sources: the supplied reference pack (`docs/reference-pack/`).

## What could not be done, and why

The build environment's network policy blocks `www.golgothafellowship.org`,
`static.wixstatic.com` and `youtube.com`. As a result:

- **No screenshots of the existing site were captured** (desktop or mobile).
- **No page text was read directly from the live site.** All facts come from the
  reference pack's source-checked inventory.
- **No logo or image files were downloaded.**
- **Legacy brand colors and typography were not measured.**

To finish the audit, run `node scripts/capture-existing-site.mjs` on any machine with
normal internet access (it writes `reference/screenshots/`, `site_style_audit.json`,
`site_media_inventory.json`), or allow those hosts in the cloud environment's network
settings and re-run this phase.

## Asset inventory

| Asset | Source | Status |
|---|---|---|
| Church logo, black letters ("Black letters no shadow box logo.png") | Wix media URL in `reference-pack/SOURCE_LINKS.md` | NOT obtained. Need church-owned original. Site shows the name in type until supplied. |
| Logo, white/light treatment (home hero) | Wix media URL | NOT obtained. Wanted as `logo-light` for the dark footer. |
| "Calvary Chapel Golgotha Fellowship" image | Wix media URL | NOT obtained. Variant; confirm whether still in use. |
| Calvary Chapel Association badge | Old site nav | NOT used. Affiliation mark, not the church logo. Stated in text instead. |
| "1st Church Service 2026" image | Wix media URL | NOT used. Event graphic. |
| Congregation / worship photo (hero) | Church to supply | MISSING |
| Pastor Marty portrait | Church to supply | MISSING |
| Building exterior / entrance | Church to supply | MISSING |
| Kids, youth, community photos (with releases) | Church to supply | MISSING |
| Leadership portraits | Church to supply | MISSING (intentionally omitted) |
| Legacy colors / fonts | Capture script | NOT VERIFIED. New palette is a proposal. |

## Content migration checklist

| Old URL | New URL | Content status |
|---|---|---|
| `/` | `/` | Facts migrated (times, address, phone, email, men's studies, radio). Old long-form homepage copy not read; new copy written from verified themes, needs pastoral approval. |
| `/what-we-believe` | `/beliefs` | **NOT migrated verbatim (blocker).** Labeled topic summary shown meanwhile. |
| `/team-3` | `/leadership` | 9 names + roles migrated, all marked `confirm`. Bios and photos not migrated. |
| `/feed-my-lambs` | `/ministries/kids` | Facts migrated (Answers in Genesis curriculum, check-in via greeters, worship/learning/crafts/prayer, nursery–6th grade). |
| `/called-for-a-purpose` | `/ministries/youth` | Facts migrated (Luke 6:46–48, Friday 6 PM, youth email). Schedule marked `confirm`. |
| `/about-6` | `/teachings` | **Archive links not migrated** (page unreadable). YouTube channel linked; library ready for entries. |
| `/contact-8` | `/get-involved` | All 17 volunteer areas migrated. Existing form destination unknown. |
| `/missions` | `/ministries/missions` | Minimal verified statement only. Full text + roles need confirmation. |
| `/about-1` (Real Impact) | none yet | **Not migrated — decision needed.** Temporary 302 to `/about`. |
| Giving link | `/give` | **Not verified (blocker).** No online button shown. |
| Prayer / involvement forms | `/prayer`, `/get-involved`, `/contact` | Backend built and tested; switched off until recipients confirmed. |
| — | `/new-here`, `/about`, `/events`, `/ministries`, `/ministries/men`, `/ministries/women`, `/ministries/outreach` | New pages from verified facts. |

## Known inconsistencies resolved

- Old beliefs-page footer shows 110 12th Avenue South #204; churchstation.io shows
  4085 E Greenhurst Road and Sunday 10 AM. **Neither is used.** The site uses the
  current homepage values: 1404 1st Street South; Sundays 8:30 and 10:30 AM.

## Facts still needing verification
See `docs/LAUNCH_REPORT.md`.
