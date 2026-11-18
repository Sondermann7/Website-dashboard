# Watch Live, Hold Fast player, 97.5 FM and giving

Built 2026-11-18. Every link that still needs the church's confirmation is in one file,
`src/config/church.ts`, and is flagged with an orange box on the review build.

## Watch Live

**What visitors see**
- **During a service:** a red **"● LIVE NOW · Watch the service on YouTube →"** bar shows
  under the header on every page. On phones the **Watch** button in the bottom bar turns into
  **Live now** with a pulsing red dot. The homepage teaching panel gets a red "Live now" button.
- **The rest of the week:** nothing extra appears. The homepage teaching panel lists the live
  times with a "How to watch live" link, and the **Watch Live** page says when the next live
  service is ("Today, 6:00 PM", "Tomorrow, 8:30 & 10:30 AM", "Sunday, …").
- **Watch Live page (`/live`)**, linked in the top bar, the footer, the Teachings page and the
  homepage. It has:
  1. The live or next-service card.
  2. The weekly live times.
  3. Four steps: Tap Watch live; Get a reminder; Watch on your TV; Missed it?
  4. The 97.5 FM card.
- **Short addresses:** `/watch`, `/livestream` and `/stream` all go to `/live`.

**How it works**
- YouTube gives every channel a permanent live address:
  `youtube.com/@Golgothafellowship/live`. It always opens whatever is streaming, so the
  website never needs updating when you go live.
- The site decides "live or not" on the visitor's own device from the schedule in
  `church.live.windows` (Idaho time). There's no YouTube key, cost or setup.
  - **Sunday:** 8:15 AM to 12:15 PM.
  - **Wednesday:** 5:45 PM to 7:30 PM.
- If a service is cancelled, the bar still shows during that window and opens YouTube's live
  page, which says the channel isn't live. To change times, edit `church.live.windows`.
- Facebook is a secondary button ("Watch on Facebook", which opens the Facebook page's live
  videos). YouTube is the main one because it works without logging in.

**To confirm:** which services stream (both Sundays? Wednesday?), and the Facebook page used
for live video.

**Preview tip:** on the Watch Live page of the preview, tap "see how the site looks during a
service" to turn on the live look across the whole preview.

## Hold Fast player

- **Where:**
  - **Listen page (`/listen`):** the five newest episodes.
  - **Teachings page:** the three newest.
  - **Pastor Marty page:** the three newest, under his photo.
- **Short addresses:** `/radio`, `/podcast` and `/hold-fast` go to `/listen`.
- **Controls:** play/pause, back 15 seconds, forward 30 seconds, a seek bar, and a list of
  recent episodes (tap one to play it). Links to Apple Podcasts and all episodes sit underneath.
- **Audio source:** it plays straight from the church's podcast feed (Buzzsprout), with no
  embed box and no third-party script. New episodes appear automatically on every build.
- **If the feed is ever unreachable at build time:** the public site shows Apple Podcasts and
  "All episodes" buttons instead. The preview shows two sample titles, because the preview
  environment can't reach the feed.

## 97.5 FM (plays on the page)

- **Where:** a bold navy "97.5 FM · On air now" player sits on the homepage (right after the
  latest teaching), at the top of the Listen page, on the Watch Live page and on the Teachings
  page. The top bar has a "● 97.5 FM Live" link on every page.
- **Short addresses:** `/radio` goes to the Listen page.
- **How it plays:** pressing **Listen live** plays the station right there; nobody leaves the
  site. Press **Stop** to end it.
  - **Now:** it loads the station's Zeno.fm player in place (`church.station.embedUrl`),
    because the station's direct stream address isn't public.
  - **Once you have the direct stream link** from whoever runs the station (it looks like
    `https://stream.zeno.fm/...`), paste it into `church.station.streamUrl`. The site then uses
    its own player, with no Zeno box.
- **Research:** 97.5 is KIDH-LP, licensed to Meridian. Public listings still call it Higher Rock
  Radio, owned by Calvary Chapel Meridian. One forum post mentions the license moving to
  Golgotha Fellowship.
- **Until the new name is set,** the player is titled "Golgotha Fellowship radio". Set
  `church.station.name` when the station has its new name.
- **The church app** is built on ChMeetings. Add a "Listen live 97.5" tab in the ChMeetings
  admin, using the same stream link.
- **The shareable preview** can't load other sites, so there "Listen live" opens the station
  page. The real site plays in place.

## Giving

- The church's giving runs through **ChMeetings**, the same system as the church app. Its site,
  golgotha.chmeetings.com, has a **Give** tab.
- The Give page now has:
  - **Give online:** opens golgotha.chmeetings.com for now.
  - **Give in the app:** iPhone and Android app links.
  - **Give in person.**
  - **Questions about giving:** call or email.
- **To confirm:** open the app's Give tab, copy its exact web address into `giving.url`, and
  set `giving.status` to `'verified'`.

## Researched but not built

- **Email or text sign-up:** skipped, as you decided. ChMeetings already handles bulletin email
  and text.
- **A separate church app or online-church page:** not needed. The website works well on phones
  and the ChMeetings app already exists.
