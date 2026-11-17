# Content guide (for church staff)

You never need to edit page code. Everything below is a plain text file. After a change
is saved (committed), the site rebuilds itself.

## Change a service time, phone number, address or link
Edit `src/config/church.ts`. It is the only place these facts live; the header, footer,
every page and Google's structured data all read from it.

## Add an event
1. Copy `src/content/events/_template.md`.
2. Rename it, e.g. `2027-01-17-baptism.md` (no leading underscore).
3. Fill in the title, date and summary. Save.

Events disappear on their own once they are over. With nothing scheduled, the Events page
says so plainly and shows the weekly schedule.

## Add a teaching
Copy `src/content/teachings/_template.md`, rename, fill in. Only `title` and `date` are
required; add `book`, `passage`, `series`, `speaker`, `videoUrl`, `audioUrl`, `notesUrl`,
`transcriptUrl` when you have them. Search filters appear automatically for whatever
fields are used.

Setting `youtube.channelId` in `src/config/church.ts` also pulls the newest YouTube
uploads in automatically at each build.

## Post an announcement banner
Copy `src/content/announcements/_template.md`, rename, set the message and the
start/end dates.

## Edit a ministry page
Edit the matching file in `src/content/ministries/`. Meeting times come from
`church.ts` (`gatheringIds`), so they cannot drift out of sync.

## Leadership
Edit `src/content/leadership/leaders.yaml`. Add a `bio:` only when it is approved. For a
portrait, put the image in `src/assets/photos/leadership/` and set `photo:` to the
filename without its extension.

## "I'm New" questions
Edit `src/content/visitor/faq.yaml`. A question with `status: todo` shows its `fallback`
text until a real `answer` is supplied and the status is changed to `verified`.

## Photos and logo
See `src/assets/photos/README.md` and `src/assets/brand/README.md`. Real, permitted
photos only; children's photos need a signed release.

## Status labels
- `verified` – confirmed correct.
- `confirm` – shown publicly, but still needs church sign-off (flagged on the review build).
- `todo` – not known; never shown publicly.

## Connecting a CMS later
Content is already structured (Astro content collections with schemas in
`src/content.config.ts`). A Git-based CMS such as Decap, Sveltia or Keystatic can be
pointed at `src/content/` without rebuilding the site.

## Sermon pages (automatic)
Every sermon gets its own page at `/teachings/<date>-<title>`, and every book of the
Bible gets a hub at `/teachings/book/<book>` (for example `/teachings/book/revelation`).
They are built from the YouTube channel and the Hold Fast podcast at every publish:
- Only "Teaching Only" uploads become pages. Full-service streams titled with a time
  (8:30AM, 10:30AM) and Shorts are skipped as duplicates.
- The book and chapter are read from the video title, so title videos the way the
  channel already does: "Revelation 20 Pt. 2 - Teaching Only".
- The page text is the video's YouTube description. A good two- or three-paragraph
  description on YouTube becomes a good page, and helps the sermon show up in Google.
- Men's, women's and youth studies are not credited to Pastor Marty automatically.

To add notes, key points, a transcript or a fuller write-up for any sermon, create a
file in `src/content/teachings/` with the same date and title (see `_template.md`).
The file replaces the automatic page.
