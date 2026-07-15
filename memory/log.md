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
