# How AI-Assisted Work Fits Into Marketing & Media

**Department:** Marketing & Media (cross-cutting)
**Type:** Standing procedure — read this before treating any AI output as finished work.

## Objective

Explain how Claude Code / Cowork sessions actually get used to execute marketing and media
tasks on this account, so anyone picking this up — including a future hire — knows what an AI
session can be trusted to do on its own, and what always needs a human.

## How it works today

1. Every task in `data/tasks.json` / `data/cadence.json` carries an execution plan. Moving a
   card to Doing on the dashboard only saves that state — it does not launch or open anything
   automatically (an earlier auto-launch feature was removed 2026-07-16; see
   `docs/cowork-contract.md` and `memory/decisions.md`).
2. Handoff is manual: click "Copy Cowork brief" on the task, then paste it as the opening
   message into a Claude Code or Cowork session yourself (see the Dashboard & Repo Operations
   SOPs in `docs/sops/internal-ops/` for the exact steps). Findings get pasted back into the
   dashboard's Memory tab or the verification queue.
3. The brief itself carries the same non-negotiable rules regardless of which session runs it:
   start read-only, work in Draft/Preview, one change at a time, never invent facts, never
   handle passwords, stop and ask before anything live/irreversible.

## What AI is trusted to do unsupervised

- Read-only research, audits, and findings (GSC pulls, competitor research, AI-visibility checks).
- Drafting: copy, replies, redirect maps, schema — anything shown for approval before it goes live.
- Logging findings into `memory/log.md` or `data/verification-queue.json`.

## What always needs Mikey

- Publishing anything live, or any GBP/NAP/tracking/schema change that states a business fact.
- Logging into WordPress, hosting, GBP, ad accounts, or any tool requiring a password.
- Treating a single AI response (from this system or from ChatGPT/Perplexity/etc. during GEO
  research) as proof of anything — it is a data point, not a verified fact.

## Cautionary Notes

- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.
- An AI session's own status report ("Done") is not verification — confirm the deliverable and
  evidence yourself before moving a card to Done.

---

Source: `docs/cowork-contract.md`, `public/brief.mjs`, `memory/decisions.md`. Hand-maintained —
not templated from a data file, since it describes a working relationship rather than a
single tool or task.
