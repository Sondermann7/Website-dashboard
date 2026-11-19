# Wording sources — whose words are on the site

Written 2026-11-19. The goal: never present my paraphrase as Pastor Marty's or the
church's official words. The old site (golgothafellowship.org, a Wix site) could not be
reached from the build environment, so its full copy has not been imported. Below is exactly
what is verbatim from the church, what is placeholder in the church's voice (awaiting his
words), and what is plain fact.

## Verbatim — the church's own words (verified from their site / app / radio feed)

- **Self-description:** "a gathering of believers in Jesus Christ … part of the Calvary Chapel
  family of churches." Stored in `church.selfDescription` and used in the homepage welcome.
- **Hold Fast tagline:** "Hold Fast is a radio ministry of Golgotha Fellowship in Nampa,
  Idaho. … verse by verse, chapter by chapter, and book by book." Used on Pastor Marty's page
  and in `pastor.ts`.

## Placeholder — written in the church's / pastor's voice, awaiting his exact words

Each of these shows an orange review flag on the staged build. Replace with his wording, or
confirm it, before launch. None of it should be read as his until he approves it.

| Where | What to replace | File |
|---|---|---|
| Homepage welcome | Headline ("A church family that opens the Bible together") and the closing sentence | `src/pages/index.astro` |
| Homepage hero | Sub-line ("casual, Bible-teaching church … come as you are") | `src/pages/index.astro` |
| About — mission | Mission wording drawn from themes on the current site | `src/pages/about.astro` |
| About — our story | Church history is not yet written | `src/pages/about.astro` |
| Beliefs | **Launch blocker.** A labeled topic summary stands in until his full Statement of
  Faith is pasted verbatim into `src/content/beliefs/statement.md` | `src/pages/beliefs.astro` |
| Pastor Marty | Bio, education and book blurbs assembled from public listings (Treasure Valley
  Men's Conference, Amazon, Audible) | `src/pages/pastor-marty.astro`, `src/config/pastor.ts` |

## Plain facts (not voice) — verified, low risk

Address, phone, email, service times, affiliation, ministry names, redirects. These come from
the official site and directories and are marked `verified` or `confirm` in `church.ts`.

## To finish this properly

The complete fix is his real copy. Two ways to get the old site's exact text into the build:
1. Paste the old pages' text (Home, About, What We Believe, Missions) and I'll place it verbatim.
2. Allow `golgothafellowship.org` and `web.archive.org` in the environment's network settings,
   and I'll pull the original wording myself.
Until then, the placeholders above stay flagged so nothing I wrote is mistaken for his.
