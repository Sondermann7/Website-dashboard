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

### 2026-07-16 — SOP library extended to standing procedures (not just recurring cadence)
- Decision: Added `data/procedures.json` — repeatable, safety/reversal-critical, or cross-tool
  procedures that don't run on a fixed cadence but recur across many tasks (301 redirects, schema
  verification, NAP/GBP updates, new-page builds, the Cowork auto-launch flow, new-agent
  onboarding, direct data-file edits). `scripts/generate-sops.mjs` now renders these alongside the
  cadence-based SOPs into the same `docs/sops/<department>/` tree (as `proc-*.md`, vs.
  `weekly-*.md`/`monthly-*.md` for cadence items), added a new `OPS` department for
  dashboard/repo-operations procedures that don't map to a marketing phase, and validated via a
  new `validateProcedures()` check in `scripts/validate.mjs`. Fixed two generator bugs found while
  doing this: `slugify()` was truncating filenames mid-word, and the Desktop mirror never deleted
  files that a prior run had created — both fixed (word-boundary truncation; mirror dir is now
  wiped before each copy).
- Rationale: Mikey asked to build SOP systems for "anything I think" needs one, acting as Marketing
  Director. Every procedure's steps and cautionary notes are derived from content already in this
  repo (safety docs, task exec arrays, server.js comments, prior decisions) — nothing invented.
- Confidence: medium
- Reversal conditions: a procedure turns out to not match how the step is actually done once
  observed live; Mikey wants procedures.json entries reorganized under a different department
  scheme.
- Source: Mikey directly, 2026-07-16.

### 2026-07-16 — Auto-launch feature removed; handoff goes fully manual
- Decision: Removed the auto-launch entirely — moving a card to Doing no longer spawns a Claude
  Code CLI session. `detectNewlyMovedToDoing()` and `launchCowork()` are deleted from
  `server/server.js`, `server/cowork-launch.ps1` is deleted, and `/api/tasks` now just writes and
  validates. Handoff is the existing manual "Copy Cowork brief" → paste-into-a-session flow
  (`proc-cowork-task-launch` in `data/procedures.json`, rewritten to match). This supersedes the
  2026-07-15 "Moving a card to Doing fully-automatically launches a live Claude Code session"
  decision, and supersedes the launch-mechanism half of `dec-secure-launch` — the CSRF guard
  (`isSameOriginRequest()`) that decision also introduced stays in force, since it protects all
  mutating routes, not just the removed launch.
- Rationale: (1) moving several cards to Doing at once would spawn several concurrent sessions
  unattended, which Mikey doesn't want; (2) the actual goal is a **Claude Code on the web** handoff
  — a browser session opened with the specific task pre-loaded and live access to repo files — but
  that requires connecting this repo to a GitHub remote, which revisits "strictly local, ever"
  (`dec-local-only`) and needs its own design pass rather than being bolted onto the local
  auto-launch. Going manual now is the simplest correct state in the meantime.
- Confidence: high
- Reversal conditions: Mikey decides on and approves a specific web-handoff design (repo on a
  private GitHub remote, `claude.ai/code?prompt=...&repositories=...` pre-fill or equivalent) and
  asks for it to be wired up.
- Source: Mikey directly, 2026-07-16.

### 2026-07-16 — SOP library split into Marketing & Media vs. Internal Ops; added tool reference + AI-work doc
- Decision: Restructured `docs/sops/` into `marketing-media/` (recurring SOPs, standing
  procedures, a new `data/tool-reference.json`-driven programs/tools reference, and a hand-written
  `ai-assisted-work.md`) and `internal-ops/` (the 3 OPS/dashboard-tooling procedures, moved out of
  the marketing library per Mikey's explicit call). Desktop mirror renamed from `Marketing SOPs` to
  `SOPs`, with only the `Marketing and Media` subfolder mirrored — internal-ops stays repo-only.
  The old `Desktop/Marketing SOPs` folder was deleted (not just superseded) to avoid a stale
  duplicate.
- Rationale: Mikey wants a genuine "hit by a bus" continuity bar — someone with zero context should
  be able to open this folder and know which program does what and how marketing/media actually
  runs, without wading through internal dashboard-tooling docs that aren't content/media work.
  Tool-reference entries are grounded only in what's already verified/documented in this repo
  (`data/site-facts.json`, task `where`/`exec` fields, `data/tool-registry.json`) — anything not
  yet confirmed live is explicitly marked open/pending rather than invented, consistent with this
  system's core rule.
- Confidence: medium
- Reversal conditions: Mikey wants OPS docs back inside the marketing library after all; a
  tool-reference entry turns out to describe a tool/workflow incorrectly once observed live.
- Source: Mikey directly, 2026-07-16.

### 2026-07-28 — Disavow ~319 spam backlinks as the first Authority Score lever
- Decision: Prioritize disavowing ~319 identified spam backlinks (~140 domains) as the first move
  to raise Authority Score, ahead of new link-building outreach.
- Rationale: Authority Score is ~90% a backlink-profile metric and a realistic strong target is
  ~mid-30s-40s (100 is unreachable for a local business — it's a log-scale metric where national
  brands sit in the 80s-90s). Cleaning up confirmed toxic links is the more contained first step
  before investing in new outreach.
- Confidence: medium
- Reversal conditions: Semrush toxicity data turns out to require manual export with no reliable
  way to confirm which domains are actually toxic, making the disavow list unreliable to compile
  safely.
- Source: 2026-07-28 Cowork debrief. See data/tasks.json (task t3f1b2e6a9c74d0a) for the pending
  execution steps.

### 2026-07-29 — Deployed live to Railway for home/remote access
- Decision: Deploy the Bartlett Ops Brain dashboard live on Railway (private, HTTP Basic
  Auth-gated, persistent volume) so it's reachable from home, while keeping local
  http://localhost:4178 available unauthenticated for on-machine work. No GitHub remote was
  created — deployed via direct `railway up` CLI upload, not a git-linked service.
- Rationale: Mikey wants to work on this from home, not just this machine. This is the reversal
  condition explicitly named in dec-local-only ("Mikey explicitly asks to push to a private remote
  for backup or multi-machine access"), but only partially: the code/data now also lives on
  Railway's private infrastructure, but never touched a public (or even private) GitHub remote,
  since gh CLI wasn't available. Basic Auth and a persistent volume were added first since the
  server had zero authentication and no durable storage across container restarts/redeploys.
- Confidence: high
- Reversal conditions: Mikey wants GitHub-linked continuous deployment added (needs gh CLI
  installed, or the repo connected via Railway's own dashboard), or wants the live deploy taken
  down and to go back to local-only.
- Source: Mikey directly, 2026-07-29. See memory/log.md (2026-07-29 entry) for the full deploy
  record, including the persistence verification (restart test) and two Railway CLI quirks hit
  along the way.

### 2026-07-29 — Standing content-writing rules: no dashes, human voice, Google fundamentals over AI-detector scores
- Decision: All written output follows three standing rules: no dashes (em/en dashes or hyphens
  used as punctuation), write in a human voice, and follow Google's actual content-quality
  fundamentals rather than trying to defeat AI-detector scores.
- Rationale: Google's published gen-AI content guidance penalizes low-value, unoriginal, at-scale
  content, not content because it was AI-assisted. Optimizing to fool an AI-detector targets the
  wrong signal entirely; optimizing for genuine quality and voice addresses what Google actually
  penalizes.
- Confidence: high
- Reversal conditions: Mikey explicitly asks for a different style rule, or Google's guidance
  changes in a way that contradicts this framing.
- Source: Mikey directly, 2026-07-29 — see memory/log.md (2026-07-29 entry, second session,
  Murray-Boise-Content-Drafts.md v3).
