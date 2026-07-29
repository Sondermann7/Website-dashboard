# Google Search Console

**Category:** Measurement

## What it's for

Google's own index/coverage/ranking data source — what's indexed, what's erroring, what's ranking and for which queries.

## How we use it

- Weekly: pull the last 7 days for new coverage errors and top gaining/losing pages or queries (see the Technical & Site Health SOP).
- Used to confirm which page currently ranks for a given query before doing internal-linking or content work (e.g. the 'roofer near me' URL-targeting fix).
- The 'Why pages aren't indexed' report is the primary tool for investigating the 351-of-626-pages-excluded issue.
- Provides the submission target for the Yoast XML sitemap, and cross-checks Bing Webmaster Tools coverage.

## What's actually confirmed vs. still open

Access confirmed working (task t74893df606e34be5, done) with a 90-day baseline pulled — see memory/log.md for that snapshot. Known tracking gaps remain unverified (data/site-facts.json: fact-tracking-gaps) — treat GSC as reliable for indexing/ranking data but don't assume it reconciles perfectly with GA4/CallRail yet.

## Cautionary Notes

- One data pull is a snapshot, not a trend — always compare to the prior week/month before drawing a conclusion.
- Confirm which GSC property (with/without www, http/https) is verified before citing numbers.
- Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.
- Confirm a working, restorable backup exists before any live-site change — never assume one does.
- Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.
- Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.

---

Source: `data/tool-reference.json` (id: `tool-ref-gsc`). data/cadence.json, data/tasks.json, data/site-facts.json Edit the tool-reference entry, then regenerate with `npm run sops` — don’t hand-edit this file, it will be overwritten.
