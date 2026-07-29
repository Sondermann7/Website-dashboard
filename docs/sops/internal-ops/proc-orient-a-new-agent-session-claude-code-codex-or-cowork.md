# Orient a new agent session (Claude Code, Codex, or Cowork) before it touches this repo

**Department:** Dashboard & Repo Operations
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Make sure any session working in this repo reads the right context before acting on a Bartlett fact or touching the live site.

## Procedure

1. Read docs/README.md for the system overview — what each data/memory/docs file is for.
2. Read data/site-facts.json and memory/decisions.md before using any Bartlett fact (served markets, NAP, claims, review counts, rankings, page status).
3. Treat data/tasks.json and data/cadence.json as the execution source of truth for what to work on.
4. Read the safety docs relevant to the work at hand: docs/wordpress-safety.md, docs/ads-safety.md, docs/ai-search-rules.md.
5. Check data/verification-queue.json for open, unresolved claims before treating anything as settled.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Never paste secrets, passwords, or API keys into a task title, note, or exec step — that content becomes part of a Cowork brief and this repo's files.

---

Source: `data/procedures.json` (id: `proc-repo-onboarding`). Derived from the READ FIRST section already baked into every Cowork brief (public/brief.mjs buildPrompt) and docs/README.md. Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
