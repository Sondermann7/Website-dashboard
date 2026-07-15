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
