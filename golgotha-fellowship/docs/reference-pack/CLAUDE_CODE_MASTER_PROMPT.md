# CLAUDE CODE MASTER BUILD PROMPT: GOLGOTHA FELLOWSHIP

Role: You are the lead full-stack developer, senior UX designer, accessibility specialist and technical SEO architect for a redesigned Golgotha Fellowship church website in Nampa, Idaho. Build a REAL functioning church website, not a mockup. Your work should be premium in appearance, contemporary without feeling trendy, warm to first-time visitors and entirely usable by seniors.

## FIRST: SOURCE CONTROL AND TRUTH RULES

The current official church website is https://www.golgothafellowship.org/ . Read this pack's `RESEARCH_AND_CONTENT_INVENTORY.md`, `SOURCE_LINKS.md`, and `DESIGN_TOKENS.json` first. Use the current website as primary source for church facts, not old directories. Before coding, run the screenshot capture script on a machine with browser network access, compare actual logos/colors/assets, and record what changes are needed.

NEVER invent events, people, contact details, doctrine, testimonies, children's protection practices, accessibility/parking details, live streams, amenities, times, sermon titles, or photographs of real church activities. For unverified details use a visible `TODO_VERIFY` in content files and hide from public production UI until confirmed.

DO NOT silently modernize theology. The full doctrinal statement at https://www.golgothafellowship.org/what-we-believe remains an authoritative source and should be migrated accurately with approval. It includes specific positions about Scripture, the Trinity, salvation through Christ, the Holy Spirit, Christ's return, creation and marriage. The site can be personally welcoming and comprehensible to first-time guests without rewriting beliefs or implying doctrines are different. Obtain pastoral approval of all final religious copy.

Only use genuine photos of the church, pastor, congregation and ministries with proper permission. Do not present generated/staged images as actual church events, worship or members. Preserve official logo identity until any redesign is approved. The Calvary Chapel Association mark is an affiliation badge, not necessarily the church's primary logo.

## OBJECTIVE

Redesign Golgotha Fellowship's site to help a 17-year-old, a 30-year-old parent and a 75-year-old first-time visitor accomplish the same essential tasks easily: know whether this is their kind of church, find service times, locate the building, understand kids/youth programs, watch teachings, reach someone, request prayer and optionally connect or give.

Use a 'you belong here / come as you are' tone grounded in the church's actual language about casual services, grace, imperfection, Scripture and fellowship. Do NOT invent a new theological posture. Keep all visitors able to navigate the same site; no separate senior mode or youth-only site.

## BRAND AND EXPERIENCE

Direction: editorial contemporary + humble local church + warm human portraits. Deliberate, generous whitespace; real photography, thoughtful typography, very clear navigation. Not a nightclub, event-ticketing site, corporate SaaS dashboard, or youth-conference neon brand. Avoid heavy gradients, glowing animated crosses, excessive parallax and gimmicky transitions.

PROPOSED palette (not official/verified existing colors):
- Ink #182A2B: headings, primary CTA, dark surface.
- Cream #FAF8F3: warm page background.
- White #FFFFFF: content surfaces.
- Sage #456458: supportive dark accent.
- Muted Sage #E5ECE7: subtle sections.
- Clay #A96F51: decorative accent only unless contrast verified.
- Warm Sand #F0E8DA: alternate section surface.
- Text secondary #465454 and border #D7DEDA.

Typography: Source Serif 4 or a similarly readable editorial serif for select display headings; Atkinson Hyperlegible Next or a highly readable modern sans-serif for body/UI. Fall back to accessible system fonts. Body 18px desktop / 17px mobile minimum, comfortable line-height and readable max text measure. Use a responsive clamp() heading scale but no massive cropped headings on phones.

Design decisions must be consistent via tokens; don't sprinkle random hex values. Include semantic focus, error and success states. Prefer simple real photographs to large icons. Gentle motion only, with reduced-motion support.

## VERIFIED CANONICAL CHURCH DATA (always keep editable in one file)

name: Golgotha Fellowship
location: 1404 1st Street South, Nampa, ID 83651, USA
phone: 208-572-3317
email: info@golgothafellowship.org
sundayServices: 8:30 AM, 10:30 AM
wednesdayService: 6:00 PM
menBibleStudy: Monday 6:00 PM, Saturday 8:00 AM
kids: nursery and through 6th grade for Sunday; also Wednesday children's ministry
fridayYouth: Friday 6:00 PM (VERIFY schedule prior to launch)
leadPastor: Dr. Martin Sondermann ('Pastor Marty')
affiliation: non-denominational fellowship holding Calvary Chapel distinctives / Calvary Chapel Association
teaching: systematic Bible teaching through Scripture
primaryVideos: https://www.youtube.com/@Golgothafellowship
instagram: https://www.instagram.com/golgotha_fellowship
facebook: https://www.facebook.com/GolgothaFellowship

Allow easy modification of these values without code edits across multiple pages.

## INFORMATION ARCHITECTURE / ROUTES

1. `/` homepage: visitor welcome and compelling next actions, service times, current teaching and communities.
2. `/new-here` first-time guest landing page (the highest-priority conversion page).
3. `/about` story, mission, church beliefs overview and community/Calvary Chapel identity.
4. `/beliefs` accurate official doctrinal statement, easy anchor navigation, readable long-form presentation, citations to verses as on source.
5. `/leadership` pastor and ministry leaders, approved images, verified bios.
6. `/teachings` latest teachings and searchable archive, YouTube source and series grouping. Don't fake a streaming service.
7. `/teachings/[slug]` optional individual sermon page if real metadata available; video link, topic, text, notes/transcript where supplied.
8. `/ministries` overview with kids, youth, men's, women's, outreach and missions.
9. `/ministries/kids` updated Feed My Lambs information, child check-in and curriculum factual details.
10. `/ministries/youth` current real schedule and purpose built around hearing/doing the Word.
11. `/missions` existing missions work with content verified by ministry.
12. `/events` calendar / upcoming gatherings with only verified entries. Empty state must be honest, not look broken.
13. `/prayer` private request form routed to church-approved channel; alternatively existing hosted prayer link until handoff is ready.
14. `/get-involved` ministry interest form matching actual volunteer areas, with reliable delivery.
15. `/contact` phone, email, address, map/directions, and a plain question form.
16. `/real-impact` preserve as an appropriate section if leadership wants to migrate it, not main conversion path.
17. `/give` direct handoff to the church's verified existing giving provider (don't fake donation checkout).

Main navigation: Home | New Here | About | Teachings | Ministries | Events | Give. Put Prayer/Contact in a clear utility location. On mobile, prioritize Visit, Call, Directions, Watch. Keep the existing content accessible through sane redirects.

## HOMEPAGE COMPOSITION

Section 1: Full-bleed real church imagery if supplied; warm, dark but legible overlay; honest headline such as 'Come grow in God's Word with us.' Supporting line referencing the casual, Bible-centered fellowship without making guarantees. Primary CTA 'Plan Your Visit'; secondary CTA 'Watch a Teaching'. No invented photos.

Section 2: Service-times band: Sunday 8:30 / 10:30, Wednesday 6:00, street address and one-tap directions / phone. This is operational data and must appear high on the homepage.

Section 3: Three-card 'What to Expect': Bible teaching, welcoming casual gathering, children's ministry. Links to details.

Section 4: Pastoral welcome: real photo of Pastor Marty and a concise approved introduction.

Section 5: Latest teaching: actual linked YouTube video/series, title and date if verified; clear external YouTube fallback when API unavailable.

Section 6: Age/stage community cards for Kids, Youth and Community; use real ministry photos only. Do not imply additional group schedules.

Section 7: Brief beliefs statement with visible link to the full statement, not hidden or sanitized.

Section 8: Final invitation: 'Have a question or need prayer?' with action choices.

Section 9: Footer with readable contact/location, all navigation, legal and social links.

## NEW HERE PAGE MUST ANSWER

- Where is the church?
- What time are services, exactly?
- How long is a service? -> `TODO_VERIFY` until church confirms.
- What should I wear? Current site says services are casual; communicate this accurately.
- Where do I park and which entrance? -> `TODO_VERIFY`.
- Can I bring children? Yes, children through grade six / nursery according to official site; explain existing check-in without claiming unverified security procedures.
- Is there a youth program and when? Friday 6 PM on current youth page, VERIFY before launch.
- What is the teaching like? Describe Bible-centered, systematic teaching accurately.
- What if I just want to watch first? Obvious YouTube link, no sign-in.
- Can I get help? Direct call/email and optional form, no mandatory account.

## ACCESSIBILITY REQUIREMENTS (NONNEGOTIABLE)

- Target WCAG 2.2 AA. Real HTML landmarks, heading structure and keyboard navigation.
- Color contrast at least 4.5:1 for normal body and 3:1 for large text/UI components where applicable. Validate actual color pairings; don't assume tokens automatically pass.
- Readable body font 17-18px minimum; allow 200% zoom with no clipping/horizontal scroll for normal content.
- Design every essential clickable target to be at least 44x44px.
- Focus-visible outlines, skip-to-content link, alt text and ARIA where needed, not gratuitously.
- No hover-only menus; mobile menu supports escape, keyboard focus and screen readers.
- No autoplay video/audio; no timed carousels; reduced-motion media query for all transitions.
- Both tap and keyboard users can reach directions, phone, service times, teachings and Give.
- Forms have persistent labels, helpful validation, accessible success and error states, and explicit privacy wording.
- Mobile review at 390px; desktop at 1440px, and intermediate 768/1024 widths.
- Provide fallback for users on slow connections and older devices.

## TECHNOLOGY / IMPLEMENTATION

First inspect the repository and preserve its existing stack where reasonable. If starting from scratch and no existing constraints, prefer Astro + TypeScript + Tailwind CSS + simple content collections because the church website is content-driven and performance matters. Avoid complex client-side frameworks for static text pages. React islands only for genuinely interactive elements.

Use static rendered HTML where possible, lazy-load YouTube thumbnails/embeds, responsive locally optimized imagery with approved assets, font fallbacks and conservative JavaScript.

Build a central `churchConfig` content object with the verified facts and links. Store doctrinal text in a source-managed file with clear approval status. Structure teachings/events/ministry records so non-developers can update them with a low-overhead workflow (CMS if existing; otherwise structured markdown/data plus simple instructions).

Existing giving, prayer and involvement integrations may use Tithe.ly and a hosted church-management domain; confirm actual destination URLs and maintain them until equivalent server-side form routing is live and tested. Do not make a fake form that discards submissions.

Security: use server-side validation, spam filtering/rate limiting as appropriate, secret env storage, no personal data in analytics or log payloads, image-use permission records and minimal form PII. Children's photos demand appropriate permissions.

SEO: 301 redirect existing paths: `/what-we-believe` -> `/beliefs`, `/feed-my-lambs` -> `/ministries/kids`, `/called-for-a-purpose` -> `/ministries/youth`, `/team-3` -> `/leadership`, `/about-6` -> `/teachings`, `/contact-8` -> `/get-involved`. Keep `/missions` and `/about-1` under mapped destinations if migrated. Preserve essential text semantics, old index visibility, page titles and internal links. Add robots.txt, sitemap.xml, canonicals, descriptive metadata, OG, `Church` / `PlaceOfWorship` Schema.org structured data that matches visible facts. Use local Nampa terminology naturally, no keyword stuffing or unsupported claims.

Analytics only with approved privacy handling. Capture measurable visitor goals such as clicks for directions, call, Watch and Plan Your Visit without collecting prayer or personal message contents. Ensure consent and privacy policy are implemented as required by church/legal counsel.

## SOURCE ASSETS

Use URLs in `SOURCE_LINKS.md` only as download leads. The official site has multiple logo variants; visually inspect and request church-owned originals before choosing a final brand treatment. No image-generation recreation of the church's existing trademark unless the owner approves. Distinguish Calvary Chapel Association logo from Golgotha Fellowship logo.

Real images needed: church exterior and entrance, congregation/worship, pastor teaching, kids ministry (released), youth ministry (released), candid community photos. If unavailable, build graceful textured/type-based fallbacks, not made-up church scenes.

## BUILD WORKFLOW

1. Audit the existing repository. Read all reference files. Capture/inspect source site screens and media if browser network works. List any blocked facts.
2. Produce a compact page map and component map with 'must be verified' notes. Don't endlessly interview; implement using conservative placeholders.
3. Create the design tokens and foundational components (nav, button, section, card, sermon card, utility strips, footer, forms).
4. Build homepage and `/new-here` fully responsive first. Verify keyboard, phone, call/directions links and actual text content.
5. Implement beliefs, leadership, ministries, teachings, events, contact, prayer, involvement, Give route.
6. Wire REAL existing destinations, data update method and redirects. Verify functional forms via test submissions approved by church owner.
7. Add SEO metadata, schema and link auditing.
8. Run visual regression on desktop/mobile and accessibility checks. Repair readability, spacing, interactions, layout shifts and empty states.
9. Produce a launch report including what's verified, what requires pastor approval, accessibility score, redirects, form destinations and smoke tests.

## ACCEPTANCE TESTS

A new visitor can find Sunday service times, address and directions in 10 seconds or less without sign-in. A senior using 200% zoom can find the phone number, watch a teaching and locate kids info without horizontal scrolling or a hover menu. A keyboard-only tester can use every critical action. The facts on every page agree with the single church config. Every live form has a confirmed recipient. The Give link resolves to the existing legitimate payment provider. Old URLs redirect correctly. The official doctrinal statement remains intact. No fabricated events/sermons/photos are published. The site's performance remains usable on a midrange smartphone and slow network.

The design should look clearly newer, warmer and more premium than the old site, yet the church's theology and name remain recognizable. Build the website. Don't stop at a plan or moodboard unless there is an actual missing input that would cause false or unsafe public content.
