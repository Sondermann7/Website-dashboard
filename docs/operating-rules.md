# Operating Rules

## Distribution: strictly local, ever

This repo is **not intended for a public remote, ever.** It stays on this machine. `.gitignore`
still excludes secrets/PII as defense-in-depth (see below), and the repo is kept in a state where
it *could* be pushed to a **private** remote later if that's ever wanted — but no remote is
configured, and nothing here assumes one exists. If that decision changes, update this file first.

## Auto-commit: OFF by default

Nothing in this system commits automatically. Every commit — including the first one — is a
deliberate, asked-for action. This stays opt-in until Mikey has reviewed a run of manual commits
and explicitly asks for auto-commit-on-important-changes to be turned on. If/when that happens,
document the trigger conditions here.

## Secrets and PII policy

Treat every source folder under `05_Marketing & SEO\` as **working artifact, not verified truth,
and never a source to copy wholesale.** Specifically:

- Never commit `.env` files, API keys, tokens, passwords, connection strings, or anything
  matching common credential patterns.
- Never commit real customer PII — names, phone numbers, emails — the kind of data that shows up
  in lead exports, CRM screenshots, or CSV dumps.
- **Known risk, confirmed 2026-07-15:** `Ad Management Memory/Bartlett Marketing/Chat Logs/*` contains
  phone-number-shaped data (LSA/CallRail audit logs). That whole folder is `.gitignore`d
  (`**/Chat Logs/`) and is never read into this repo's `data/` or `memory/` files.
- `*.csv` is ignored by default, since lead exports are CSV. If a specific CSV is ever genuinely
  safe to track (no PII, no secrets), whitelist it explicitly in `.gitignore` rather than removing
  the blanket rule.
- Before any future import from a new source folder, re-run the same scan used in Task 0:
  ```
  grep -rlIE "AKIA|-----BEGIN (RSA|OPENSSH|PRIVATE)|xox[baprs]-|ghp_|sk-[A-Za-z0-9]{20}|[0-9]{3}[-.][0-9]{3}[-.][0-9]{4}" <folder>
  ```

## Source folders are read from, never copied wholesale

The Desktop folders under `05_Marketing & SEO\` (Ops Dashboard, SEO Plan, Command Center, Ad
Management Memory, Social Content) are inputs this system learns from. Specific facts, task text,
and schemas are ported deliberately (see `memory/decisions.md` for what and why). The folders
themselves are never bulk-copied or symlinked into this repo.
