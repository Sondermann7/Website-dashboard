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
