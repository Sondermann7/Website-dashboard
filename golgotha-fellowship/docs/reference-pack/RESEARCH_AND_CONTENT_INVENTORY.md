# Golgotha Fellowship: Source-Checked Website Audit

Research date: 2026-11-16. Source hierarchy: official site > official linked channels > directory listings. This document distinguishes verified web content from design recommendations.

## 1. Identity and church profile (verified)

- Public name: Golgotha Fellowship.
- Location: 1404 1st Street South, Nampa, Idaho 83651, in downtown Nampa.
- Phone: 208-572-3317 (official homepage).
- Main email: info@golgothafellowship.org.
- Sunday services: 8:30 AM and 10:30 AM.
- Wednesday evening service: 6:00 PM.
- Nursery and children's ministry through sixth grade are described for Sunday services. Children's ministry also noted for Wednesdays.
- Men's Bible studies: Monday 6:00 PM and Saturday 8:00 AM, according to official home page.
- Youth ministry: Friday at 6:00 PM according to official youth page (confirm before launch).
- Senior pastor: Dr. Martin Sondermann (Pastor Marty), as listed on official leadership page.
- Identity: non-denominational local fellowship that affirms historic Calvary Chapel distinctives and identifies with the Calvary Chapel Association.
- Core focus: Bible teaching line by line; fellowship and practical discipleship; Scripture and the gospel of Jesus Christ.
- Anchor themes appearing on the site: Hebrews 10:23-25, Acts 2:42, grace, the authority of God's Word, the imminent return of Christ, and invitation to fellowship.
- Public YouTube channel: @Golgothafellowship.
- Teaching archive includes notes/commentary and content on Revelation. The home page promotes current Bible studies and Hold Fast radio programming.

Citations: https://www.golgothafellowship.org/ ; https://www.golgothafellowship.org/team-3 ; https://www.golgothafellowship.org/called-for-a-purpose ; https://www.youtube.com/@Golgothafellowship

## 2. Theology: MUST NOT CHANGE without leadership approval

This is a faithful topic inventory, not a replacement statement of faith. Preserve the canonical doctrinal text from https://www.golgothafellowship.org/what-we-believe and obtain pastor approval after migration.

The public doctrinal statement explicitly affirms:
1. Scripture is inspired, authoritative, infallible, and inerrant in its original writings.
2. Jesus Christ is the only way of salvation; his death and resurrection are central to the gospel.
3. Salvation is by God's grace through faith, not earned by works.
4. The Trinity: Father, Son, and Holy Spirit, one God.
5. Jesus' deity, virgin birth, sinless life, miracles, atoning death, bodily resurrection, ascension, and future return.
6. A pre-tribulational, premillennial rapture, imminence of Christ's return, and a literal millennial kingdom.
7. A literal Genesis creation interpretation and young-earth creation perspective.
8. Marriage described doctrinally as a lifelong union between one genetic man and one genetic woman.
9. The Holy Spirit indwells believers and empowers spiritual gifts.

The homepage also says the church understands Christian discipleship as a relationship grounded in love and grace rather than legalistic merit. The website references Acts 2:42 as an outline for doctrine, fellowship, communion and prayers. The Nampa Chamber describes its approach as simple, systematic line-by-line Bible teaching.

Visitor-friendly design requirement: communicate welcome and practical visiting information without omitting, secretly rewriting, or misrepresenting these doctrinal commitments. Put the official full statement one click from About, with a clear unedited doctrinal page. The welcome message should be hospitable without promising that all visitors will agree with the church's positions.

## 3. Other ministry content (verified)

Kids / Feed My Lambs: the current site says the church uses an Answers in Genesis curriculum, has a child check-in process, includes worship, learning, crafts/activities and prayer, and directs newcomers to greeters for check-in. Source: https://www.golgothafellowship.org/feed-my-lambs

Youth: emphasis on hearing Scripture and putting it into practice, with Luke 6:46-48 as a foundation. Current page advertises Friday 6 PM and youth@golgothafellowship.org. Source: https://www.golgothafellowship.org/called-for-a-purpose

Involvement: opportunities listed include greeters, kids, youth, security/medical, worship, audio-video, events, discipleship, biblical counseling, outreach, jail/prison ministry, care, radio/YouTube, men/women, home groups and general help. Source: https://www.golgothafellowship.org/contact-8

Missions: current page describes a missions leader and church-plant work including a French-language ministry; confirm current roles before publishing biographical details. Source: https://www.golgothafellowship.org/missions

Real Impact: this is a separate issue/civic-engagement ministry on the existing site. Preserve its existence and source material if leadership asks, but do not make it the primary visitor path or add political endorsements to the new site. Source: https://www.golgothafellowship.org/about-1

Hold Fast radio: home page lists KSPD 790 AM / 94.5 FM weekdays 12:15-12:30 and KIDH 97.5 weekdays 3:45-4:00. Confirm current stations/times before publishing.

## 4. Leadership content (verified public page, can change)

- Dr. Martin Sondermann / Pastor Marty - Senior Pastor.
- Doug Turner - Prison and Jail Outreach Pastor.
- Chris Bent - New Believer and Discipleship Pastor / Elder.
- Jeremy Gayou - Men's and Children's Ministry Pastor.
- Hugh Theriault - associated with missions / church plant in Canada.
- Christina Bent - Women's Ministry Leader.
- Jon Poston - Elder.
- Nathan Cooney - Elder.
- Jenifer Gayou - Children's Ministry.

Several role and biography descriptions differ across indexed revisions. Treat the live leadership roster as needing verification and do not add headshots or years of service without current approval.

Source: https://www.golgothafellowship.org/team-3

## 5. Brand and visual identity: VERIFIED versus NOT VERIFIED

Verified from indexed image references: the website uses more than one Golgotha logo/media asset, including an image named "Black letters no shadow box logo.png," a Calvary Chapel Golgotha Fellowship image, and a home image with a white/light treatment. The navigation also includes a Calvary Chapel Association badge. This indicates multiple logo contexts and association marks that must be distinguished, but NOT the exact visual design or original editable logo artwork.

Not verified: exact church hex palette, primary/secondary typography, logo geometry, logo clear space, photography tone, homepage layout, mobile appearance or desktop screenshots. The capture environment could read indexed content but could not access the rendered website. Run `capture_existing_site.mjs` locally before claiming colors, pixel layout, or screenshot-based findings.

Proposed new direction (judgment, not fact): sophisticated warm editorial church design; charcoal/ink + parchment + muted sage; generous whitespace; authentic photography of the actual Nampa congregation; expressive but restrained serif headings; highly legible body text; gentle transitions; no nightclub aesthetic or heavy motion. Age inclusive, especially readable for seniors.

## 6. Existing site problems identified from content/structure

- Long, dense paragraphs on the homepage bury the information a newcomer first needs.
- A deeply nested or generic 'More' menu likely creates discoverability friction; confirm visually after capture.
- Inconsistent labels and legacy paths (examples: /team-3, /about-6, /contact-8) make migration and SEO redirect planning important.
- The beliefs page has an older footer location (110 12th Avenue South #204) while the current homepage uses 1404 1st Street South.
- An older directory lists 4085 E Greenhurst Road and Sunday 10 AM. Do not use these old values.
- Current teaching material mixes live/current teaching, archives and radio programs; organize the new content around identifiable content types and search.
- Some source pages show old copyright and placeholder-style contact text in search extraction. Verify each live footer instead of copying it wholesale.
- Conversion path: 'Plan Your Visit' exists but the first-time guest experience should be a dedicated page with times, parking, entrance, what to wear, children check-in, and no account requirement.

## 7. Recommended UX and information architecture

Main navigation:
- Home
- I'm New (Plan Your Visit)
- About (Our Story, Beliefs, Leadership)
- Teachings (Latest, Series, Archive, Radio)
- Ministries (Kids, Youth, Men, Women, Outreach, Missions)
- Events
- Give (external existing provider)

Persistent utility links: Prayer and Contact. Mobile quick actions: Directions, Call, Plan a Visit. Keep all actions keyboard operable and easy for older visitors.

Suggested homepage reading order:
1. Real congregation photograph + truthful invitation + two CTAs: Plan Your Visit and Watch a Teaching.
2. Service times and address, visible without scrolling too far.
3. What to expect: casual services, Scripture-centered preaching, nursery/children through sixth grade, friendly greeters.
4. Upcoming gatherings / next event.
5. Latest teaching from verified official YouTube data.
6. Meet Pastor Marty (short, approved biography).
7. Kids + Youth + Find Community cards.
8. Short church beliefs summary linking to exact Statement of Faith.
9. Prayer / questions / contact options.
10. Accessible footer with the correct address and external channels.

Plan Your Visit needs: service time, address, map and directions, parking/accessibility details, exact kids check-in steps, optional contact form, dress code as the church describes it ('casual'), arrival guidance and contact. Never invent parking, wheelchair access, coffee or check-in hours. Use labeled placeholders for missing details.

## 8. Accessibility: age-inclusive design requirements

- Target WCAG 2.2 AA. Body 17-18px or larger; resize 200% without loss; strong contrast. Focus visible and keyboard operation for every interactive feature.
- At least 44x44 CSS pixel target sizes (a deliberate design standard exceeding some minimum WCAG requirements).
- Two-click reach to service times, directions and phone from any page.
- No autoplaying audio. Avoid auto-rotating content and animation-heavy backgrounds; honor prefers-reduced-motion.
- No invisible dropdown-only navigation, hover-only actions or gestures required for essential tasks.
- Mobile nav with clear labels. Older adults must not need to install an app or register to read sermons or service times.
- Sermon pages link to captions/transcripts if available; never imply all material has transcripts if it does not.
- Form labels always visible, large error messages and accessible success confirmation.
- Respect children/photography release consent and limit contact/prayer form data access.

## 9. Migration, operations and data

- Preserve or 301-redirect indexed legacy routes before replacing the site.
- Preserve factual content, verified social destinations, giving provider and prayer/intake workflows, with approved domain routing.
- Store time-sensitive information as one editable structured source; do not hardcode times into 8 components.
- Add simple ministry/event content editing; if no CMS is available, structured markdown/YAML or a controlled spreadsheet can work.
- Cache/fail gracefully if external YouTube feed is unavailable. No invented sermon dates/titles.
- SEO: Church / PlaceOfWorship structured data accurately reflecting visible information, descriptive page titles, OG images, sitemap.xml, robots.txt, canonical tags and local Google Business Profile link as approved.
- Forms: protect against spam, validate server side, use role-scoped notifications, do not log prayer content or personal information in analytics.
- Publish staged preview and get pastor/content approval before production DNS changes.

## 10. Source links

See SOURCE_LINKS.md for primary sources, official-channel addresses and direct logo/media references.
