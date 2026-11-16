# Launch report

Build date: 2026-11-16. **Not launch-ready: 3 blockers.** The live site and DNS are untouched.

## Blockers (site must not go live until cleared)

| # | Blocker | What is needed | Where it goes |
|---|---|---|---|
| 1 | Statement of Faith not migrated verbatim. The old site was unreachable from the build environment. `/beliefs` shows a clearly labeled topic summary instead. | Paste the full official text, word for word; pastor approves. | `src/content/beliefs/statement.md` |
| 2 | Online giving link unverified. `/give` shows no online button. | Exact giving URL and provider name. | `giving` in `src/config/church.ts` |
| 3 | Official logo not supplied. Header/footer show the church name in type. | Church-owned original (SVG or transparent PNG), light variant if available. | `src/assets/brand/` |

`npm run launch-check` enforces all three.

## Needs pastoral / church approval

- All new welcome, mission and ministry-philosophy copy (homepage, About, I'm New). Written only from themes on the current site: line-by-line teaching, casual services, grace not legalism, Hebrews 10:23–25, Acts 2:42, Christ's return, Calvary Chapel distinctives.
- Pastor Marty's welcome: currently a factual one-liner. Needs his own message + portrait.
- Leadership roster: 9 names and titles, every one marked `confirm`.
- Youth: Friday 6:00 PM; ages/grades served; whether to keep "Called for a Purpose".
- Hold Fast radio stations and times.
- Ministry pages for men, women, outreach, missions: minimal by design. Need descriptions, women's schedule, study locations.
- Which translation to use if Scripture is quoted (none is quoted at present; only references).
- Real Impact page: migrate, or retire? (`/about-1` temporarily 302s to `/about`.)
- Photo permissions, including releases for any children's photos.
- Privacy policy wording, if the church or counsel requires one (none published).

## Unknown facts (never guessed; stand-in text shown)

- Parking, entrance, accessibility details.
- Typical service length.
- Church history / founding story (section omitted from About).
- How in-person giving works; mailing address for gifts.
- YouTube channel ID (enables automatic "Latest teaching").

## Forms

Built and tested, **switched off** (`PUBLIC_FORMS_ENABLED=false`). While off, Prayer,
Contact and Get Involved show phone + email buttons, so nothing a visitor types can be lost.

To turn on: create a church-controlled Resend account and verify the sending domain; set
`RESEND_API_KEY`, `FORMS_FROM`, `CONTACT_TO`, `PRAYER_TO`, `INVOLVED_TO` as Cloudflare
Pages secrets; add Turnstile keys; set `PUBLIC_FORMS_ENABLED=true`; send one test
through each form on the staged site and confirm receipt.

Protections: server-side validation, honeypot, optional Turnstile, same-origin check,
header-injection stripping, no storage, no message content in logs or analytics.
Recommended in Cloudflare: a WAF rate-limit rule on `/api/forms` (e.g. 5 requests / minute / IP).

If the church prefers to keep its existing hosted prayer/involvement forms, link to
them instead — the existing destinations were not verifiable.

## Redirects (`public/_redirects`)

| Old | New | Code |
|---|---|---|
| `/what-we-believe` | `/beliefs` | 301 |
| `/feed-my-lambs` | `/ministries/kids` | 301 |
| `/called-for-a-purpose` | `/ministries/youth` | 301 |
| `/team-3` | `/leadership` | 301 |
| `/about-6` | `/teachings` | 301 |
| `/contact-8` | `/get-involved` | 301 |
| `/missions` | `/ministries/missions` | 301 |
| `/about-1` | `/about` | 302 (pending decision) |

Not yet tested on Cloudflare (no deployment made). Re-crawl the old site's full URL list
(the capture script, or Search Console > Pages) before cutover: only the 9 URLs in the
reference pack are mapped.

## Test results (local production build)

| Check | Result |
|---|---|
| Pages built | 20 |
| Widths tested | 390, 768, 1024, 1440 — every page |
| Horizontal overflow | 0 pages |
| Interactive targets under 44×44 px | 0 |
| axe-core (WCAG 2.0/2.1/2.2 A + AA, best practices) | 0 violations, all pages, mobile + desktop |
| JavaScript errors | 0 |
| Lighthouse mobile: `/`, `/new-here`, `/beliefs`, `/contact` | Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100 |
| LCP / CLS / TBT (home) | 1.4 s / 0.001 / 20 ms |
| Keyboard | Skip link is first tab stop; mobile menu opens, Escape closes, focus returns to the Menu button |
| Form backend | 10 automated tests pass (validation, spam, injection, delivery failure, unconfigured) |
| Form UI | Inline errors, focus moves to first invalid field, failure message tells the visitor to call/email |
| Teaching search | Search, book, series, speaker, format, sort verified with temporary fixtures (removed) |
| Events | Listing, auto-hide of past events and empty state verified with a temporary fixture (removed) |
| Review flags in production build | 0 |
| Type check (`astro check`) | 0 errors |

Caveats: Lighthouse ran against a local server, so real-network numbers will be lower
(still expected well above 90: the homepage ships no framework JavaScript). The Google
Maps embed and YouTube thumbnails could not load in the test environment and were not
measured. Adding a large hero photo will affect LCP; re-run after photos are added.
Automated scans do not replace a manual screen-reader pass and a 200% zoom check.

## SEO readiness

Unique titles + descriptions, canonicals, XML sitemap (18 URLs), robots.txt, Open Graph
image, `Church` JSON-LD (name, address, phone, service times, social profiles), `FAQPage`
on I'm New, `Person` on Leadership. Review builds are `noindex` and block crawlers.
Analytics (GA4 and/or Cloudflare Web Analytics) and Search Console verification activate
by environment variable; goal clicks (directions, call, watch, plan-visit, give, email)
are tagged with `data-goal`. Nothing loads until an ID is set.

After launch: submit the sitemap in Search Console, update the Google Business Profile
website link, and ask churchstation.io to correct the old address and service time.

## Design decisions to confirm

- Palette is the **proposed** one (ink / cream / sage / clay / sand), not checked against
  the logo, which was unavailable. Clay is decoration-only (3.9:1 on cream).
- Fonts: DM Serif Display + Inter (per the build brief; the token file suggested Source
  Serif 4 + Atkinson Hyperlegible Next). Swapping is a two-line change.
- The favicon and social image are type-only stand-ins until the logo arrives.
- Navigation is flat (no dropdowns) so nothing depends on hover.
