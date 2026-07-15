# Decisions Log

Template for each entry:

```
### YYYY-MM-DD — <short title>
- Decision:
- Rationale:
- Confidence: low | medium | high
- Reversal conditions: <what would make us undo this>
- Source: <who/what — Mikey directly, a live check, an agent's finding>
```

---

### 2026-07-15 — Bartlett Ops Brain distribution: strictly local, ever
- Decision: This repo (and its data) never goes to a public remote. No GitHub push, ever, unless this decision is explicitly revisited.
- Rationale: Mikey confirmed this directly when the repo was scaffolded. Keeps the secrets/PII bar simpler while still enforced as defense-in-depth.
- Confidence: high
- Reversal conditions: Mikey explicitly asks to push to a private remote for backup or multi-machine access.
- Source: Mikey directly, 2026-07-15 (see docs/operating-rules.md).

### 2026-07-15 — Auto-commit stays OFF by default
- Decision: Nothing commits automatically. Every commit, including the first, is a deliberate ask-first action.
- Rationale: Mikey wants to review a run of manual commits before trusting an agent to commit unattended.
- Confidence: high
- Reversal conditions: Mikey reviews several manual commits and asks for auto-commit-on-important-changes.
- Source: Mikey directly, 2026-07-15 (build plan amendment).

### 2026-07-15 — Zero-dependency Node server, not Express
- Decision: server/server.js uses only Node's built-in http/fs/path/url/crypto modules. No npm install.
- Rationale: Matches the existing searchops-helper/server.js pattern already in use, and aligns with the safety rule against running third-party code blindly.
- Confidence: high
- Reversal conditions: A concrete feature genuinely requires a dependency Node's stdlib can't reasonably provide.
- Source: Mikey directly, 2026-07-15.

### 2026-07-15 — Cowork access via brief + paste-back, not live remote sync
- Decision: Cowork read = the existing "Copy Cowork brief" flow. Write-back = structured findings pasted into the Memory tab / verification queue. No live git remote wired up yet.
- Rationale: Reconciles "wire up Cowork access" with "strictly local, ever" — true remote sync would need a private git remote, which isn't in scope now.
- Confidence: medium
- Reversal conditions: Mikey wants real-time Cowork read/write against this exact file tree; would require revisiting the local-only decision.
- Source: Mikey directly, 2026-07-15 (see docs/cowork-contract.md).

### 2026-07-15 — Moving a card to Doing fully-automatically launches a live Claude Code session
- Decision: Dragging a Cycle task into Doing spawns a new terminal running `claude "<brief>"`
  immediately, with no confirmation step. Uses the Claude Code CLI (`claude-cli://` is registered
  and scriptable on this machine) rather than Claude Desktop (no working `claude://` handler found)
  or Cowork specifically (not confirmed installed).
- Rationale: Mikey explicitly asked for this and chose "fully automatic" over a semi-automatic
  copy-to-clipboard option after being told about the technical constraint (browsers can't launch
  desktop apps; the CLI is what's actually scriptable here).
- Confidence: high
- Reversal conditions: If this proves too disruptive (e.g. multiple cards dragged quickly spawning
  many concurrent sessions), or Mikey wants a review pause before a session starts.
- Source: Mikey directly, 2026-07-15 (see docs/cowork-contract.md).
- Note: found and fixed a real bug during implementation — `cmd.exe`'s `start` silently drops the
  launch when the argument contains newlines (no error surfaced). Initially fixed by collapsing
  the brief to a single line; superseded by the file-based approach below (`dec-secure-launch`)
  which passes the brief through a temp file instead, so the original multi-line formatting is
  preserved and no longer needs collapsing.

### 2026-07-15 — Cowork launch hardened against command injection and CSRF (`dec-secure-launch`)
- Decision: `launchCowork()` no longer places any task-controlled content (title, note, exec
  steps) directly on the `cmd.exe`/`start` command line. The brief is written to a server-generated
  temp file (`bartlett-cowork-<crypto.randomUUID()>.txt`) and handed to a fixed, checked-in wrapper
  script (`server/cowork-launch.ps1`) that reads it and passes the content to `Start-Process` as a
  real parameter value, not re-parsed shell text. The spawned session runs with
  `--permission-mode plan` (read-only/planning only) rather than full default permissions. All
  mutating `/api/*` POST routes now reject requests whose `Origin` header doesn't match this
  server's own host (`isSameOriginRequest()`), closing a CSRF path where a malicious webpage could
  otherwise POST a crafted task list to trigger an unattended launch with attacker-chosen content.
- Rationale: an automated security review correctly flagged that `task.t`/`task.note`/`task.exec`
  are writable via an unauthenticated local POST, and interpolating them into a `cmd.exe`-parsed
  command line is exploitable regardless of Node's argv array quoting (`cmd.exe`'s own `start`
  re-tokenizes its full command line using rules Node's escaping doesn't account for). Verified
  the fix live: a task titled with embedded quotes/`&`/backticks/newlines launched cleanly with no
  injected process, and the temp file was cleaned up by the wrapper script after being read.
- Confidence: high
- Reversal conditions: if `--permission-mode plan` proves too restrictive for how Mikey actually
  wants launched sessions to behave, or if a future need arises to trust task content directly
  again (would require re-establishing why the injection risk no longer applies).
- Source: automated background security review, 2026-07-15; verified and implemented same day.

### 2026-07-15 — Marketing SOP library generated from data/cadence.json, mirrored to Desktop
- Decision: `npm run sops` (scripts/generate-sops.mjs) generates one markdown SOP per recurring
  `data/cadence.json` entry into `docs/sops/<phase>/`, using the SalesTrak SOP's
  Objective/Procedure/Cautionary-Notes shape (screenshots omitted — no live-UI capture available).
  The whole `docs/sops/` tree is mirrored to `Desktop/Marketing SOPs` on generation so it's
  reachable without repo access. One-off `data/tasks.json` items do NOT auto-generate an SOP.
- Rationale: Mikey asked to be treated as Marketing Director laying out which workflows need
  standing procedures for people/departments under them. Cadence items are already vetted,
  recurring, and carry real `exec` steps — promoting them to a formal SOP is low-risk and keeps
  the SOP text from drifting out of sync with the actual approved workflow (edit the cadence entry,
  regenerate, done). One-off tasks are excluded because most have no repeatable click-path;
  see the criteria written into `docs/sops/README.md` for when a one-off should be promoted
  manually instead.
- Confidence: medium
- Reversal conditions: Mikey wants SOPs authored by hand instead of templated, wants screenshots
  captured (would require a live-UI walkthrough per SOP), or wants one-off tasks included by
  default rather than promoted only when they prove repeatable.
- Source: Mikey directly, 2026-07-15.
