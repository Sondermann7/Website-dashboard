# Cowork Read/Write Contract

This repo is **strictly local, ever** (see `docs/operating-rules.md`) — there is no public
remote, and no live network sync to a Cowork session is wired up. Cowork participates one way:
the **manual brief-out/paste-back** loop below. Handoff is always something Mikey does on purpose.

## Auto-launch removed (2026-07-16)

A brief-lived feature auto-spawned a local Claude Code CLI session the moment a card moved to
Doing (`server/server.js` → `launchCowork()`, invoked via `detectNewlyMovedToDoing()` from the
`/api/tasks` POST handler; wrapper script `server/cowork-launch.ps1`). It was removed:

- Moving several cards to Doing at once would have spawned several concurrent sessions
  unattended — not something Mikey wants.
- The longer-term direction is a **Claude Code on the web** handoff (a browser session with a
  pre-filled task and live repo access), which needs the repo connected to a GitHub remote — that
  would revisit the "strictly local, ever" decision and is deferred to a later design pass.

The command-injection hardening and the `--permission-mode plan` enforcement that used to gate the
launched session (see the former `dec-secure-launch` writeup in `memory/decisions.md`) went away
with the feature itself — there's no launch left to harden. The **CSRF protection is unaffected
and still in force**: all mutating `/api/*` routes (`tasks`, `cadence`, `archive`,
`memory/append`) still reject cross-origin `POST` requests via `isSameOriginRequest()`, since that
guards the whole file-backed brain, not just the removed launch path.

Moving a card to Doing today just saves its column — nothing opens automatically. Handoff is the
manual flow below.

## Manual: Cowork gets the brief via copy/paste

Every task in the dashboard (both Cycle and Cadence views) has a **"Copy Cowork brief"** button.
Clicking it builds a full operator brief (`buildPrompt()` in `public/app.js`) containing:

- the task's metadata (stage, phase, priority, cadence, where to work, likely access needed),
- the exact execution steps from `data/tasks.json` / `data/cadence.json`,
- the required deliverable and definition of done for that task's phase,
- the safety rules from `docs/wordpress-safety.md`, `docs/ads-safety.md`, `docs/ai-search-rules.md`,
- explicit stop-and-ask conditions.

Paste that brief into a Cowork (or any Claude) session to hand off the task. If that session also
has filesystem access to this repo, it can additionally read `data/site-facts.json` and
`memory/decisions.md` directly for fuller context — but the copied brief alone is a complete,
self-contained handoff even without repo access.

## Write-back: Cowork's findings come back through you

Cowork does not write directly back into this repo over the network. When a session reports
back:

1. **Findings and observations** → paste into the **Memory tab** in the dashboard. That calls
   `POST /api/memory/append`, which appends a timestamped entry to `memory/log.md`.
2. **New unverified claims worth tracking** → add a row to `data/verification-queue.json`
   (`{id, claim, sourceRef, status, assignedTo, addedAt, resolvedAt, resolution}`).
3. **Architectural or strategic decisions** → add an entry to `memory/decisions.md` (and mirror
   it in `data/decisions.json` if it should be machine-readable) using the existing template:
   decision, rationale, confidence, reversal conditions, source.
4. **Task status changes** (done, blocked, needs approval) → update the task's column in the
   dashboard directly (drag the card, or edit `data/tasks.json`) — this writes through
   `POST /api/tasks` the same way any other dashboard interaction does.

## The local-only caveat

This loop works because a human (Mikey) is the bridge between the local file-backed brain and
whatever remote session Cowork runs in. If real-time, no-paste read/write access from Cowork
directly into this file tree is ever wanted, that requires a private git remote (or another sync
mechanism) — which would mean revisiting the "strictly local, ever" decision in
`docs/operating-rules.md` and `memory/decisions.md` (`dec-local-only`). That hasn't happened and
isn't assumed by anything in this repo.
