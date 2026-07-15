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
