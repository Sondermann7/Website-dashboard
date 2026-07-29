# Edit a data/*.json file directly without corrupting the brain

**Department:** Dashboard & Repo Operations
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Make a direct edit to a data file (outside the dashboard UI) safely, when the UI doesn't cover the change needed.

## Procedure

1. Prefer the dashboard/API paths (POST /api/tasks, /api/cadence, /api/archive) when the change is something the UI already supports — they validate automatically.
2. For a direct file edit, make the change, then immediately run `npm run validate`.
3. If validation fails, fix the file and re-run — never leave or commit a data file that fails validation.
4. Remember direct edits do not get the server's automatic pre-write backup — the safety net for a direct edit is validation plus normal git history.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Never paste secrets, passwords, or API keys into a task title, note, or exec step — that content becomes part of a Cowork brief and this repo's files.

---

Source: `data/procedures.json` (id: `proc-data-file-edit`). Derived from docs/README.md (writeValidated / backupThenWrite path) and scripts/validate.mjs. Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
