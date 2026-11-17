# Sermon SEO plan

Status: built and waiting on access. Written 2026-11-17.

## Already built
- A page for every sermon: `/teachings/<date>-<title>`, generated at every publish from
  the YouTube channel (UC7ZJXJ3B2GQQLjolHM0Zo-Q) and the Hold Fast podcast feed.
- A hub per book of the Bible: `/teachings/book/<book>`, every teaching in chapter order.
- VideoObject / PodcastEpisode, breadcrumb and ItemList structured data; all in the sitemap.
- Full-service streams ("8:30AM") and Shorts skipped; only "Teaching Only" uploads become pages.
- Page text comes from the video's YouTube description.

## Needed before the next step
1. Unblock in the cloud environment's network settings: `youtube.com`, `www.youtube.com`,
   `i.ytimg.com`, `feeds.buzzsprout.com`, `golgothafellowship.org`, `static.wixstatic.com`.
2. A free YouTube Data API key (the public feed lists only the newest 15 videos; the key
   unlocks the full archive). Store it as a secret, `YOUTUBE_API_KEY`.
3. Pastor Marty agrees to review write-ups in batches.

## Steps, in order
1. **Revelation hub intro.** A 300-500 word introduction on `/teachings/book/revelation`
   (what Revelation is, how the church teaches it, where to start), written or approved by
   Pastor Marty. This page targets the broad searches.
2. **Revelation sermon write-ups.** For the 20-30 most recent Revelation sermons, pull the
   captions and draft from his own words: a 150-300 word summary, 3-5 key points, verses
   covered. Pastor Marty approves each batch before it goes live. Saved as files in
   `src/content/teachings/`, which replace the automatic page.
3. **Upload habit.** Whoever uploads writes a two-paragraph YouTube description (passage,
   main point, one key verse), so every new sermon page starts with real text.
4. **Measure.** Connect Google Search Console at launch. After 60-90 days, see which
   sermon and book pages get clicks, then extend write-ups to the books that pull traffic.
5. **Back catalog.** Only after step 4 shows what ranks, work further back through older series.

## Do not
- Publish hundreds of bare video pages with one line of text.
- Publish write-ups he has not approved; they appear under his name.
- Add separate blog posts that duplicate sermon pages.
