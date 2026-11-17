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
| Lighthouse mobile: `/`, `/new-here`, `/beliefs` (revision 2) | Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100 |
| LCP / CLS (home, revision 2) | 0.8 s / 0.001 |
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

## Design (revision 2, 2026-11-16)

Rebuilt after owner feedback that revision 1 read as a generic template. Patterns are
taken from the approved Bartlett rebuild (`Bartlett-Roofs/bartlett-website-rebuild`,
version 9) and the biodwell.com motion notes recorded in that repo:

- Full-bleed photo hero with a navy fade, accent word in the headline, check-mark
  promises, and a white "Service times" card where Bartlett has its inspection form.
- Photo-led sections: welcome split with an inset portrait, three photo cards for a
  Sunday, a rounded navy teaching panel whose photo fades into the colour, ministries
  as photo tiles.
- "Hold fast." word band (Hebrews 10:23, also the name of the church's radio program)
  whose letters spread as the page scrolls: the biodwell "Breathe" idea.
- Motion: blocks rise 18px from 98.5% over .45s, 50 ms stagger capped at 250 ms, header
  shadow on scroll, gold progress line, button sweep. Transform and opacity only;
  nothing is hidden without JavaScript; all of it is off under "reduce motion".
- Navy + gold palette, Source Serif 4 headings, Source Sans 3 text, squared buttons.

**Not done, because the files could not be obtained from the build environment**
(the Netlify preview, biodwell.com, the church site, Wix media, Facebook and Instagram
are all blocked by the session's network policy; nothing for Golgotha was found in the
connected Google Drive or Canva):

| Needed | Status |
|---|---|
| Real photos (11 homepage/ministry slots) | None supplied. Review build shows labeled "Photo needed" boxes; the public build shows plain navy. **The design does not work without them.** |
| Official Golgotha logo | Not supplied. Name set in type. |
| Calvary Chapel dove | Not supplied, not redrawn. Slots in the footer and beliefs section. |
| Exact Golgotha navy | Not sampled. `#13294B` is a stand-in; one token to change. |
| Live look at the Netlify preview and biodwell.com | Not seen. Bartlett patterns came from its source repo and saved screenshots; biodwell only from notes in that repo. |

## Revision 3 (2026-11-16): real brand, photos, Pastor Marty page

- **Logo, dove, navy.** Lifted from phone screenshots of the church's own graphics. Navy
  is `#313D65`. All three are low-resolution stand-ins: replace with original files.
- **Photos.** 26 photos cropped from screenshots of the church's Facebook albums fill the
  homepage, every inner-page header, the men's and women's tiles and the pastor page.
  About 1,200 px wide. Confirm the photographer (Jaimee Hubert posted the album) and the
  people shown are happy to appear. No kids, youth or building-exterior photos yet.
- **Pastor Marty page** (`/pastor-marty`, data in `src/config/pastor.ts`). Built from web
  search summaries, not from the church site: Treasure Valley Men's Conference speaker
  bio (ministry roles), Amazon/Audible listings (four books, degrees, 25+ years),
  Apple Podcasts (Hold Fast), Revelation Roundtable (founder). "Former sports writer"
  is on the owner's word. Not included because unconfirmed: the Oregon men's conference,
  fiction titles listed on Audible, years married, a "Calvary Boise" listing.
  **Pastor Marty must approve this page.**
- **Still not done: matching the old website's writing.** `golgothafellowship.org` is
  still blocked from the build environment, so no page text has been read from it.
  The Statement of Faith, the old homepage copy, leadership bios, missions and the
  teaching archive are NOT migrated. Fix: allow the host in the environment's network
  settings, or paste/export the page text.
- Old details in the church's own graphics were not applied: "Sunday 10 AM, East Valley Middle School, 4085 E Greenhurst Rd" (old location). Wednesday confirmed by the owner (2026-11-17): 6:00 PM service; the potluck no longer happens.

## Functional audit (2026-11-17)

`npm run audit` (`scripts/site-audit.mjs`), run against the production build served by
Cloudflare's own local server (`npx wrangler pages dev dist`), so redirects, headers and
the form function behave as they will in production. Result: **all checks pass.**

- **Redirects:** 49 rules. Every old site URL (`/what-we-believe`, `/team-3`,
  `/feed-my-lambs`, `/called-for-a-purpose`, `/about-6`, `/contact-8`, `/missions`,
  `/about-1`, `/home`) and every short link lands on the right page, with and without a
  trailing slash. `/sermons/*` catches any old sermon path.
- **Links:** 30 distinct internal links and `#anchors`, 0 broken. 13 external links,
  all https on expected hosts (maps, YouTube, Facebook, Instagram, Amazon, Audible,
  Apple Podcasts, conference sites); not reachable from the build environment, so open
  each once in a browser before launch.
- **Facts:** on all 22 pages, every phone link is 208-572-3317, every email is the
  church or youth address, the address and Sunday times appear, and no old address
  (Greenhurst, 12th Ave), old service time, or placeholder text is present.
- **Pages:** one H1 each, unique titles and descriptions, correct canonical URLs,
  sitemap (21 URLs) and robots.txt correct, unknown URLs return the 404 page.
- **Forms:** all three validate in the browser; with delivery unconfigured the server
  refuses and the visitor is told to call or email (never a silent drop). With forms
  switched off (the default) each page shows call and email buttons.
- **Navigation:** skip link first, mobile menu opens, closes on Escape and navigates;
  quick-action bar has Visit, Call, Directions, Watch; the location map is pinned to
  the street address.
- **Accessibility sweep** on the same server: 0 violations, 0 overflow, 0 small targets.

**Cannot match the original site yet:** it is still blocked from the build environment,
so its page text, its giving link and any pages not in the reference pack have not been
compared. The two launch blockers (Statement of Faith text, giving link) remain.

## Design decisions to confirm

- Navy `#13294B` and gold `#C19A4B` are stand-ins until the logo is supplied.
- Headline copy and accent words need pastoral approval.
- The favicon and social image are type-only stand-ins until the logo arrives.
- Navigation is flat (no dropdowns) so nothing depends on hover.
