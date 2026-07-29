# Memory Log

Dated findings, observations, and notes from live checks or Cowork sessions.
Append-only via the Memory tab (POST /api/memory/append) or by hand — newest at the bottom
is fine since each entry is timestamped; this file is not resorted.

### 2026-07-15 — Migration from localStorage dashboard started
Ported the bartlett_ops_v5 dashboard (Bartlett-Ops-Dashboard.html, Desktop) into this
file-backed repo. 40 cycle tasks and 14 cadence items (6 weekly, 8 monthly) imported
verbatim from the seed data, each tagged `verify.status: "unverified"` — none of the
dashboard's claims are treated as confirmed just because they're in the file. See
data/verification-queue.json (once seeded) for the highest-value claims to check first,
starting with the "top 50 vs top 100 contractor" conflict noted in the original plan.

### 2026-07-15 — Memory tab verified end-to-end
Appended a test finding through the dashboard's Memory tab (browser → POST /api/memory/append
→ this file) to confirm the write path works before relying on it for real findings.

### 2026-07-15 — Five data files scaffolded empty, `status: "pending"`
No placeholder data was invented for these — each needs real-world work first:
- `measurement-map.json` — needs a live GA4/GTM/CallRail/Meta tracking audit.
- `url-inventory.json` — needs a full site crawl.
- `location-page-triage.json` — needs a site crawl of the 109 city pages.
- `redirect-map.json` — needs actual approved redirect work to populate (not speculative).
- `ai-visibility-baseline.json` — needs the 30-query baseline actually run across the 5 AI engines.

### 2026-07-15 — Migration to Bartlett Ops Brain complete: summary

**What was migrated:**
- All 40 cycle tasks and 14 cadence items (6 weekly, 8 monthly) from `Bartlett-Ops-Dashboard.html`,
  ported verbatim, now living in `data/tasks.json` / `data/cadence.json`.
- The full dashboard UI (drag-and-drop board, cadence check-off, archive, carry-forward, search
  filters, "Copy Cowork brief") preserved in `public/`, now reading/writing through a small local
  API (`server/server.js`) instead of `localStorage`.
- 12 Bartlett context facts seeded into `data/site-facts.json`.
- The 4 decisions made while building this system, in `data/decisions.json` / `memory/decisions.md`.
- 6 known tool/source classifications seeded across `data/tool-registry.json` (4) and
  `data/source-registry.json` (2).
- 5 highest-value unverified claims seeded into `data/verification-queue.json`.
- Safety docs (`wordpress-safety.md`, `ads-safety.md`, `ai-search-rules.md`), the Cowork
  read/write contract, and an operator README.
- 13 automated tests (import, validate, server round-trip, schema checks) — all passing.
- Manually verified in a real browser: drag-and-drop, cadence check-off, Memory tab append, and
  full-reload persistence all round-trip correctly through `data/*.json`.

**What remains `unverified`:** everything imported from the old dashboard, by design — see
`data/verification-queue.json` for the 5 flagged first, and `data/site-facts.json` for the
per-fact status.

**What's `pending` (empty scaffolds, no invented data):** `measurement-map.json`,
`url-inventory.json`, `location-page-triage.json`, `redirect-map.json`,
`ai-visibility-baseline.json` — each needs real crawl/audit/baseline work before it can be
populated (see the entry above for what specifically unblocks each one).

**Needs Mikey's review, in priority order:**
1. The "top 50 vs top 100 contractor" + California-served conflict on the live Boise page —
   this is blocking several other content tasks from using either number.
2. Whether the local-only / no-remote decision (`dec-local-only`) still holds, given the Cowork
   contract is brief-and-paste-back rather than live sync.
3. Whether to run `npm run import` at some point to pick up any future edits to
   `scripts/seeds.mjs`, or whether the file-backed data is now the sole source of truth going
   forward (recommended: the latter — treat `data/*.json` as authoritative from here on, and
   only touch `seeds.mjs` if the *original* dashboard changes and needs re-importing).

### 2026-07-15 — End of day
- Finalized the Utah plan (not currently tracked as a dashboard task — no card exists for this).
- Finalized the content plan (same — not currently tracked as a dashboard task).
- Closed down markets on the website — marked "Remove the closed Pleasant Grove location
  completely" done on this basis; confirm this fully covers what was actually closed down, or
  flag if other markets besides Pleasant Grove were closed and need their own task/verification.
- Not done yet: QC tent mock-ups.
- Open decision: whether to schedule drone footage for tomorrow or the day after.
- Marked done on the dashboard: homepage title/meta fix, domain + territory facts confirmed,
  plugin list & Yoast config confirmed, GA4 + Search Console access confirmed.

### 2026-07-15 — Auto-launch Cowork on Doing, added and verified live
Built the fully-automatic launch feature (see `dec-auto-launch-cowork-on-doing` in
`decisions.md`). Extracted the brief-building logic out of `public/app.js` into an isomorphic
`public/brief.mjs` shared by both the browser and `server/server.js`, so the dashboard's "Copy
Cowork brief" button and the auto-launch always produce identical briefs. `public/app.js` is now
loaded as `<script type="module">`.

**A mistake worth flagging for next time:** while testing, I reflexively ran `npm run import` to
get to a "clean" state, not realizing the 5 tasks marked Done earlier that day were sitting only
in the uncommitted working tree — that command reseeds `tasks.json` from scratch and would have
silently wiped them. Caught it immediately by checking the pre-import `.bak-*` file `import.mjs`
makes automatically, restored the correct state, and confirmed no data was actually lost. Lesson:
don't run `npm run import` on a live/in-use `data/` directory without checking `git status` first
— it's meant for first-time seeding, not for "reset to test something quickly."

**Also found and fixed a real bug** via live testing: `cmd.exe`'s `start` silently drops the
launch entirely when its argument contains a newline — no error, the window just never opens.
Confirmed empirically (single-line args with quotes/colons/dashes launch fine; the same text with
`\n` does not launch anything). Fixed by collapsing the brief to one line before passing it to
`start`. Verified fixed with a real end-to-end test (synthetic harmless task, real `claude.exe`
process confirmed spawned, then cleaned up).

### 2026-07-15 — Auto-launch hardened after automated security review (2 findings, both fixed)
A background security review flagged the auto-launch feature above: (1) CRITICAL command
injection — task title/note/exec steps are writable via an unauthenticated local POST and were
being interpolated into a `cmd.exe`-parsed command line; (2) HIGH — the launch fired as an
unconditional side effect of any POST to `/api/tasks`, with no origin check, so a malicious
webpage could CSRF a crafted task list and trigger a launch with attacker-chosen content. See
`dec-secure-launch` in `decisions.md` for the full technical writeup.

Both are fixed: the brief now flows through a server-generated temp file into a fixed wrapper
script (`server/cowork-launch.ps1`) rather than ever touching a parsed command line, the launched
session runs in `--permission-mode plan` (read-only) by default, and all mutating routes reject
cross-origin POSTs. Verified live with a task titled to include `"`, `&`, backticks, and
newlines — no injected process ran, and the temp file was cleaned up automatically. This also
let me drop the earlier newline-collapsing workaround, so Claude now receives the brief with its
original formatting intact.

### 2026-07-16 — Auto-launch feature removed
Removed the auto-launch that spawned a Claude Code CLI session whenever a card moved to Doing
(`detectNewlyMovedToDoing()` / `launchCowork()` in `server/server.js`, plus
`server/cowork-launch.ps1`). Reason: moving several cards to Doing at once would spawn several
concurrent sessions unattended, and the real goal is a Claude Code *on the web* handoff (task
pre-loaded, live repo access) rather than a local terminal spawn — that needs the repo on a
GitHub remote, which is a separate decision to make later. Handoff is fully manual again via the
"Copy Cowork brief" button. The CSRF same-origin guard on mutating `/api/*` routes is unaffected
and stays. See `memory/decisions.md` (2026-07-16 entry) for the full writeup.

### 2026-07-27 — Dashboard "Done"-list audit, Murray NAP fix, and GTM / lead-attribution diagnostic
*(Cowork end-of-day debrief, pasted in full; see below for follow-through in data/site-facts.json,
data/verification-queue.json, and data/tasks.json)*

**Confirmed / Done**
- Homepage title/meta drops CA — observed (live fetch of bartlettroofs.com): title reads "Bartlett
  Roofing | Trusted Local Roofers Serving GA, ID, UT, & WA."
- Domain redirect — observed: bartlettroofing.com 301-redirects to bartlettroofs.com.
- Pleasant Grove page (post 7387) office claims already corrected — observed (WP #content + live
  page, modified 2026-07-14): reads "Backed by our team at our Murray, UT office" and "dedicated
  team based out of our Murray, UT office." Remaining "office in Pleasant Grove" refers to a
  customer's building, not Bartlett's.
- Ogden page (post 5946) — observed: zero "office" language; no false local-office claim to fix.
- Murray page (post 6940) updated and published — observed (edited in WP, verified on live page
  with cache-buster): added NAP "1935 E Vine St #240, Murray, UT 84121 · (801) 509-6464" into the
  intro paragraph and set Yoast focus keyphrase "roofing company in Murray." H1 intact, NAP
  renders. NAP matches the GBP screenshot provided (user-stated source for the GBP values).
- GTM container inventory — observed (GTM live; account 6290459631, container 217451651, workspace
  5): exactly 3 tags — BLACKSTONE (Google Ads Conversion), Conversion Linker (Initialization – All
  Pages), formSubmission (Custom HTML). formSubmission only pushes a formSubmission dataLayer event
  that triggers itself and feeds no conversion — hollow.
- GTM double-load source identified — observed (live DOM = two gtm.js tags for GTM-M92NH73X; Site
  Kit Settings shows Tag Manager module connected to the same container; Site Kit itself warns
  "Placing two tags at the same time is not recommended"): the second load is Google Site Kit's Tag
  Manager module duplicating GTM4WP.
- Lead-attribution capture confirmed NOT built — observed (loaded homepage with
  `?gclid=TESTCONFIRM123&utm_source=testsrc…`): no hidden gclid/UTM fields on gform_3 (Home
  Inspection), no cookie set, only MonsterInsights references gclid internally.
  Customer-Service form (id 4) fields = First/Last Name, Phone, Email, Full Address, Service Area,
  Comments only.
- Gravity Forms inventory — observed (GF admin, 13 active): incl. dedicated ad forms Google Ads
  (id 10, 6 entries), Google Ads Blackstone HERO (id 14, 3), Google Ads Spokane 0% (id 16, 27),
  Google Ads Spokane No Payment (id 17, 17); main lead form Home Inspection (id 3, 1,145 entries).
- Existing Google Ads / GA4 setup — source-backed (Jul 16 outline + Jul 14 audit): Google Ads
  conversion AW-11173534158 fires on Gravity Form submit (gform_confirmation_loaded) and tel:
  clicks, single-fire since a duplicate snippet was deactivated July 15; GA4 (G-DMW97ZSJ6N)
  single-fire; GA4↔Google Ads (279-115-8719) linked since 2023.
- Deliverable produced — observed: Bartlett-Lead-Attribution-Explained.pdf (3 pages), text verified
  via pdfplumber.

**In Progress**
- Delete the hollow formSubmission GTM tag. Where it's at: attempted 4+ times; GTM repeatedly
  returned "Invalid input. You may have stale data; refresh the page and try again." Nothing
  changed (Workspace Changes: 0, never published). Next step: in the GTM tab open formSubmission →
  ⋮ → Delete → Delete, then click the blue Submit to publish — during a single clean GTM session
  with no other Site Kit/GTM tab syncing the same account.

**Corrected / Contradicted**
- Old belief: "No working form-lead conversion — Smart Bidding is flying blind." Corrected: the
  Google Ads form conversion does fire (AW-11173534158 on gform_confirmation_loaded + tel clicks),
  via a direct gtag Code Snippet, not the GTM tag. Consistent with the GTM tag being separately
  hollow.
- Old belief: "GA4 double-fire (Site Kit + MonsterInsights) is inflating numbers." Corrected: the
  Jul 16 outline's live check found GA4 single-fire/clean. The double-fire claim was inferred from
  seeing both plugins installed, not a counted duplicate hit (consent mode gated the GA4 beacons
  tested against).
- Old belief (dashboard task, `tfdbea2ddec9a4c85`): "Remove the closed Pleasant Grove location
  completely — strip + redirect its 4 cities." **Corrected: Bartlett still services those cities;
  the Pleasant Grove and Ogden offices consolidated into Murray, not closed and abandoned.**
  Removal/redirect of the 4 city pages would destroy rankings for markets still being served — the
  correct action was office-claim/NAP copy fixes (done today), not page removal. This task was
  previously marked `done` on the wrong premise — reopened/corrected in `data/tasks.json`, see
  below.
- Old belief: "GTM double-fire — Site Kit never connected, ruled out." Corrected: Site Kit is fully
  connected and its Tag Manager module is the second GTM loader (observed live via Site Kit
  settings + DOM).

**Blocked**
- formSubmission deletion — blocked on a GTM "stale data" concurrency rejection; needs a clean
  single GTM session to retry.
- GA4 dedupe / disabling redundant tag sources — blocked on a decision (hold off; question raised
  whether a single source is actually needed).
- SalesTrak Lead Source mapping (downstream half of the capture build) — third party: Dan / n8n
  flow owner.
- Roofle webhook querystring forwarding — third party: Roofle support + n8n (Jon checking a
  roofle-st execution log per prior docs).
- Hostinger Reach email audit — blocked on IT/Hostinger access.

**New Open Questions**
- Google Ads auto-tagging on/off for account 279-115-8719 — unverified; gclid only appends if it's
  on (default assumed). Settles by checking account settings.
- GA4 single-fire vs. Site Kit Analytics + MonsterInsights both active — mild tension between the
  Jul 16 doc (single-fire) and what's installed. Settles by counting actual GA4 `/g/collect`
  page_view hits on a consented load, or confirming Site Kit Analytics isn't outputting its own
  snippet.
- Whether the dedicated Google Ads forms (id 10, etc.) store Source URL/referrer on entries — not
  checked this session. Settles by opening those forms' GF entries.
- (LSA CallRail number pool and Roofle querystring forwarding remain open from the Jul 16 doc —
  see `vq-lsa-callrail-number` / `vq-roofle-querystring-populates` in `data/verification-queue.json`,
  unchanged by today's session.)

**Mistakes / Lessons**
- Two conclusions ("no form conversion," "GA4 double-fire") were asserted before verifying; both
  were wrong and corrected by the uploaded audits. Lesson: separate observed from inferred — plugin
  presence ≠ a counted duplicate hit.
- Murray page near-miss: the raw `#content` textarea was edited first while Avada Fusion Builder
  was active; that edit would have been discarded on Save because the builder re-serializes
  `post_content`. Caught before publishing by switching to "Default Editor." Lesson: on Avada pages,
  edit via Default Editor (or the builder), never the hidden textarea while the builder is live.
- GTM deletes kept failing with "stale data," likely from concurrent GTM/Site Kit sessions on the
  same account; closing the duplicate tab + parking the Site Kit dashboard + reloading did not
  clear it. Lesson: GTM edits need one clean session, and this environment may still reject.
- A JS tool repeatedly returned "[BLOCKED: Cookie/query string data]" when output contained
  URLs/query strings; had to scrub URLs from return values to get results. Lesson: strip
  URLs/long tokens from JS tool output.

### 2026-07-28 — Taxonomy sitemap cleanup, GSC sitemap submission, indexing diagnosis, authority-score plan

**Confirmed / Done**
- Noindexed 5 junk taxonomy sitemaps — testimonial-tag, offer-type, slide-page, element_category,
  fusion_tb_category (Yoast → Show in search results = No). Observed — each verified gone from
  sitemap_index.xml.
- Audited + noindexed 5 more thin taxonomies — categories (blog, one "posts" term), tags/post_tag
  (26 thin archives), service-category (1 term, dup of /commercial-roofing/), tesimonial-format,
  author archives. Kept state archives (Idaho/Utah have real value). Observed — sitemap index now
  7 entries, down from 14.
- Submitted sitemap_index.xml in Google Search Console — Status: Success; first time it was ever
  submitted. Observed (GSC Sitemaps, Jul 28).
- Verified the noindex changes did no harm — Observed: GSC Links = all 874 external backlinks
  point to homepage + real pages (SLC 41, Boise 32, Spokane 32, Pleasant Grove 13, Ogden 10,
  Kennesaw 8), zero to any noindexed taxonomy; GSC Performance = every noindexed archive had 0
  clicks in 3 months (author 288 impr/0, tag/commercial-roofing 147/0, category/posts/page/3
  109/0).
- "roofer near me" ranking analysis — Observed (GSC): location-personalized; Ogden #2.5,
  SLC/Atlanta/Kennesaw ~17, Boise ~25, Spokane page #52 (10,697 impr / 0 clicks); ~3 total near-me
  clicks in 3 months.
- Dashboard updates — marked "Fix 'roofer near me' URL targeting" Done; added new LOCAL task
  "Capture 'roofer near me' via GBP + reviews + local pages (not internal links)" with GSC context.
  Observed (Done 10→11, total tasks →44).
- Indexing investigation (the 351-pages claim) — Observed (GSC Pages, data 7/23): 269 indexed / 309
  not indexed — Crawled-not-indexed 184, 404 65, redirect 30, canonical 23, noindex 7. Drilldowns:
  the 184 = WP technical noise (/?p=277, /wp-json/oembed/…, /blog/page/8/) + state/tag archives +
  real blog posts Google declined (/blog/how-to-choose-the-right-ventilation-system…,
  /blog/roofing-costs-in-2025/); the 65 404s = deleted CA pages (/service-areas/brea-ca/,
  /orange-county-commercial-roofing/), tag pagination, a /home link, and 2 real blog posts
  (prevent-roof-leaks-before-they-start, signs-you-need-a-new-roof).

**In Progress**
- Authority-score push — decision made, not started (waiting on go-ahead). Chosen first lever:
  disavow the ~319 spam backlinks (~140 domains). Exact next step: pull backlinks from Semrush →
  isolate confirmed-spam domains → compile the GSC disavow .txt → show the full list → submit in
  GSC only after approval. Nothing pulled or built yet.

**Corrected / Contradicted**
- Old (dashboard task): "'roofer near me' — the Spokane page wrongly owns it; fix via internal
  linking." Corrected: near-me is location-personalized, no single page can own it, Spokane's
  #52/0-clicks isn't blocking anything, and internal linking is the wrong lever. Observed (GSC).
  Task closed and replaced with a GBP/reviews/local-pages task.
- Old (stated goal): "Authority Score to 100." Corrected: 100 is unreachable for a local business
  (log-scale metric; national brands sit 80s–90s); realistic strong target is ~mid-30s–40s, and AS
  is ~90% a backlink metric. Expert-stated (general SEO knowledge, not a live pull).

**Blocked**
- Disavow submission — on a go-ahead (decision made). Caveat: toxicity scoring was previously
  flagged Semrush-UI-only / not API-accessible, so isolating toxic domains may need manual/pattern
  work — to be confirmed on the next pull attempt.
- Link-building outreach (the bigger AS lever) — prospect list + templates can be built, but
  sending emails needs approval.
- Dead-inbox lead-notification fix (raised as a candidate today) — needs a decision on destination
  (real bartlettroofs.com inbox vs. SalesTrak/CRM).

**New Open Questions**
- Is Google Ads auto-tagging on? (account 279-115-8719) — unverified; gclid capture depends on it.
  Settles by checking Ads account settings. (Carried over from 2026-07-27; still open.)
- Were the two 404'd blog posts renamed to /blog/roof-leak-warning-signs-every-homeowner-can-see/?
  Unverified. Settles by checking WP Posts; if renamed, 301 them.
- What links to /home (and /wp-content/*) causing those 404s? Unverified. Settles by finding the
  source link.
- Will the kept state pages (/states/idaho/, currently "crawled, not indexed") earn indexing, or
  are they too thin? Settles by monitoring after content/authority work.
- Can the Semrush MCP/API surface the toxicity data needed for the disavow, or is manual export
  still required? Settles by attempting a backlinks_research pull.

**Mistakes / Lessons**
- Coordinate clicks on the dashboard "Done" button missed twice (layout shifted on scroll) before
  succeeding via element-ref click. Lesson: use element-ref clicks for small dynamic buttons, not
  pixel coordinates.
- Yoast taxonomy route slugs ≠ sitemap slugs — the blog category route is `categories` (not
  `category`); Fusion ones use underscores (`element_category`, `fusion_tb_category`). Guessed
  hyphen slugs bounced to Site features. Lesson: read the nav hrefs to get exact routes first.
- JS tool output blocked ("Cookie/query string data") whenever return values contained URLs/query
  strings during taxonomy scans. Lesson: scrub URLs from JS returns (same lesson as 2026-07-27,
  recurring — worth actually fixing the habit rather than re-learning it each session).

### 2026-07-29 — Deployed live to Railway for remote/home access

**Confirmed / Done**
- Added HTTP Basic Auth to server/server.js, gated by DASH_USER/DASH_PASS env vars — enforced only
  when both are set, so local dev at localhost:4178 stays open exactly as before. Observed: live
  URL returns 401 with no credentials and with a wrong password, 200 with the correct ones.
- Added DATA_DIR/MEMORY_DIR env-var overrides plus a one-time seedActiveDirsIfEmpty() copy, so a
  fresh Railway volume gets seeded from the repo's data/memory on first boot but is never
  overwritten on later deploys. Observed: /api/state and /api/memory on the live URL returned the
  same 44 tasks / 14 cadence items / 10 log entries as local.
- Created Railway project `bartlett-ops-brain` in the existing "Bartlett Roofing" workspace,
  attached a persistent volume mounted at /appdata, deployed via `railway up` (no GitHub remote
  involved — direct CLI upload), and generated a public domain:
  https://bartlett-ops-brain-production.up.railway.app
- Verified persistence end-to-end, not just deploy success: appended a
  `PERSISTENCE-TEST-MARKER` finding through the live Memory tab API, ran `railway restart`
  (restarts the container without rebuilding — the exact case that would lose data on an
  unmounted/ephemeral filesystem), and confirmed the marker was still present afterward. That
  marker entry is now a permanent (harmless) part of the log, consistent with the log being
  append-only.
- Added a dedicated test (`checkBasicAuth` in tests/api-security.test.mjs) covering the open/unset
  case and correct/incorrect credential cases. Full suite (18 tests) passes.

**Corrected / Contradicted**
- I had previously told Mikey (2026-07-27 session) that this repo had no git history and no commit
  safety net. That was wrong — `git log` shows a full commit history going back to the initial
  scaffold (15 commits), just with a large amount of uncommitted work accumulated across sessions
  since. No decisions were made based on the earlier wrong claim, but it should not have been
  stated without checking `git log` directly first.

**Blocked / Deferred**
- GitHub CLI (`gh`) is not installed, so the repo was not pushed to GitHub and Railway is not
  wired for auto-deploy on push — this deploy was a one-time direct upload via `railway up`.
  Continuous deployment from GitHub is an optional follow-up, not required for the dashboard to be
  live and usable from home today.
- The large set of locally uncommitted changes (see `git status`) was not committed as part of this
  work, since committing wasn't explicitly asked for — only `railway up`'s direct file upload was
  used to get the current working tree live.

**New Open Questions**
- None from this session specifically.

**Mistakes / Lessons**
- Always verify claims about repo/infra state (e.g. "no git history") by running the actual
  command (`git log`) before stating it, rather than inferring from an environment flag or an
  earlier assumption — see the Corrected/Contradicted note above.
- `railway volume add -m /appdata` failed twice from this Bash tool with "Mount path must start
  with a `/`" even though it did — root cause was Git Bash/MSYS silently rewriting the leading-slash
  path before Railway ever saw it. Fixed with `MSYS_NO_PATHCONV=1`. Also hit a CLI panic
  (`Option::unwrap() on a None value`) when passing `--service`/`--environment` by *name* to
  `railway volume add`; passing the explicit service and environment *IDs* instead worked cleanly.
  Lesson: prefer IDs over names for `railway volume` subcommands, and disable MSYS path conversion
  for any Railway CLI flag that takes a literal `/`-prefixed path.
