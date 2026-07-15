# Cowork Read/Write Contract

This repo is **strictly local, ever** (see `docs/operating-rules.md`) — there is no public
remote, and no live network sync to a Cowork session is wired up. Cowork participates two ways:
an **automatic local launch** the moment a task hits Doing, and a **manual brief-out/paste-back**
loop for anything not covered by that (Cadence items, re-running a task, or working from a
non-Windows machine).

## Automatic: moving a card to Doing launches a live session (2026-07-15)

Dragging a Cycle task card into the **Doing** column fully automatically spawns a new terminal
window running `claude "<brief>"` — a live Claude Code CLI session starts immediately, with the
same operator brief the "Copy Cowork brief" button produces, on **this machine**. This is
Windows-only (`server/server.js` → `launchCowork()`, invoked from the `/api/tasks` POST handler
via `detectNewlyMovedToDoing()`) and fires for every task that transitions into "doing", including
from bulk edits — there is **no confirmation step and no pause to review the brief first**.

This does not weaken any of the safety rules — the launched session receives the exact same
MISSION / SAFETY RULES / STOP AND ASK BEFORE sections as the manual brief, so it still won't
publish, delete, redirect, or touch tracking/NAP without asking. What's automated is the
*handoff*, not the permission to act unsupervised.

**Known platform quirk:** `cmd.exe`'s `start` parses its arguments as a single command line —
embedded newlines silently drop the launch with no error. The brief is collapsed to a single line
(`toSingleLine()` in `server/server.js`) before being passed as the launch argument; this was
confirmed by empirical testing (a one-line argument with quotes/colons/dashes launches fine, the
identical text with real newlines launches nothing).

This is Claude Code CLI, not Claude Desktop and not Cowork specifically — this machine has no
working `claude://` protocol handler for Claude Desktop (the registry key exists with an empty
command), while `claude-cli://` → the Claude Code CLI binary is registered and fully scriptable.

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
