# WordPress Safety Rules

Non-negotiable, carried over from the Bartlett Ops Brain build plan. Any agent (Claude Code,
Codex, Cowork) working against the live WordPress site must follow these.

- **Do not touch the live website unless explicitly asked.** Read-only discovery is the default.
- **Backup before any live-site change.** Confirm a working, restorable backup exists first —
  don't assume one does.
- **The user logs in.** Never ask for or handle WordPress, hosting, or plugin passwords.
- **Work in Draft/Preview for WordPress.** Nothing publishes without explicit approval.
- **Show changes before publishing.** Before/after diffs, not just a description.
- **One change at a time** for redirects, templates, schema, tracking, NAP, and location pages.
  Batch changes hide which one caused a regression.
- **Avada/Fusion Builder is the page builder, not Elementor.** Don't propose Elementor-specific
  instructions.
- **Yoast is the SEO plugin, not Rank Math.** Don't propose Rank Math-specific instructions.
- **Never bulk-change Avada global templates** without understanding every page it affects.
- **Never use CallRail dynamic tracking numbers as the public GBP/citation NAP** phone number.

## Definition of done for a WordPress task

- The requested work is completed in Draft/Preview, or documented as read-only findings.
- Evidence attached: URLs, screenshots, exports, source paths, date ranges, exact changed fields.
- Verification specific to the change type (redirects: confirm status codes and no 404s; schema:
  verify in View Source, not just the rendered DOM; tracking: confirm via DebugView/Tag
  Assistant with a real test event).
- Any remaining approval, access, or owner decision is listed clearly.

See `data/tasks.json` / `data/cadence.json` for the live task list this applies to, and each
task's "Cowork execution plan" (via the dashboard's Copy Cowork brief button) for the per-task
version of these rules.
