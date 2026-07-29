# Hand a task to a Claude Code or Cowork session manually

**Department:** Dashboard & Repo Operations
**Type:** Standing procedure (as-needed, not on a fixed cadence)
**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey

## Objective

Move a task to Doing and hand it off yourself — the dashboard no longer auto-launches anything, so know the manual copy/paste flow and how findings come back.

## Procedure

1. Before handing off, confirm the task's title, note, and execution steps are accurate — that exact content becomes the brief.
2. Move the card to Doing (drag on the board, or POST /api/tasks with col: "doing") — this only saves the task's state, it does not launch or open anything.
3. Open the task's "Cowork execution plan" and click "Copy Cowork brief" to copy the full operator brief to the clipboard.
4. Open a Claude Code or Cowork session yourself and paste the brief as the opening message.
5. Let the session work through to one of: Done, Draft ready, Blocked, or Needs approval, per the Final Report Format baked into the brief.
6. Bring findings back through you: paste observations into the Memory tab (POST /api/memory/append), add unverified claims to data/verification-queue.json, and log decisions in memory/decisions.md.
7. Only move the card to Done once the deliverable and verification are actually confirmed — not just because the session reported success.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- Never paste secrets, passwords, or API keys into a task title, note, or exec step — that content becomes part of a Cowork brief and this repo's files.

---

Source: `data/procedures.json` (id: `proc-cowork-task-launch`). Derived from docs/cowork-contract.md and memory/decisions.md (the 2026-07-16 decision removing the auto-launch feature that dec-secure-launch had hardened). Edit the procedures entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
