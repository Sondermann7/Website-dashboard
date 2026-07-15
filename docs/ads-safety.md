# Ads & Tracking Safety Rules

- **Do not run live Google Ads scripts** without a full code review first. See
  `data/tool-registry.json` — `GeertGR/google-ads-conversion-audit-script` is explicitly flagged
  `needs-review` for this reason.
- **Do not change GA4/GTM/CallRail/Meta tracking or form destinations** without explicit approval.
  A working tracking setup is the only way to know if anything else in this plan is succeeding —
  breaking it silently breaks every other measurement.
- **Verify test events, don't assume.** Use GA4 DebugView, Tag Assistant, or a real test lead
  submission to prove one clean event/lead path per change, not just "should work now."
- **Meta domain verification and pixel wiring** require the account owner (Mikey) to complete
  the actual Meta Business Manager steps — an agent can guide, not log in on his behalf.
- **UTM conventions must be defined before landing pages go live**, so lead-source attribution
  doesn't have to be reverse-engineered later.
- **Ad landing pages in `/lp/` must be set to noindex** — they exist for paid traffic only, not
  organic search.
- **Never invent stats, service areas, local facts, certifications, rankings, review counts, or
  AI-search guarantees** in ad copy or landing pages. If a number isn't verified, don't use it.

See `data/measurement-map.json` (currently `status: "pending"`) — this file will hold the actual
tracking audit once one is run. Until then, treat GA4/GSC/Google Ads/CallRail tracking as having
known, unconfirmed gaps (see `data/site-facts.json` → `fact-tracking-gaps`).
