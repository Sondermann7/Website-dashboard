import { getCollection } from 'astro:content';
import { church } from '../config/church';
import { getLatestVideos } from './youtube';
import { getPodcastEpisodes, bookFromTitle } from './podcast';

/** One shape for the teaching library, whether it came from a content file or YouTube. */
export interface TeachingItem {
  key: string;
  title: string;
  date: string; // ISO
  speaker?: string;
  book?: string;
  passage?: string;
  series?: string;
  videoUrl?: string;
  audioUrl?: string;
  notesUrl?: string;
  transcriptUrl?: string;
  summary?: string;
  thumbnail?: string;
  /** Internal page for curated entries; YouTube-only items link straight out. */
  href?: string;
  /** Where the entry came from. Only live feeds ('youtube', 'podcast') can be the homepage's latest teaching. */
  source: 'file' | 'podcast' | 'youtube';
}

export async function getTeachings(): Promise<TeachingItem[]> {
  const entries = (await getCollection('teachings')).filter((t) => t.data.published);
  const curated: TeachingItem[] = entries.map((t) => ({
    key: t.id,
    title: t.data.title,
    // Date-only entries (2026-02-25) parse as UTC midnight, which is the evening before in Idaho. Pin them to midday.
    date: (t.data.date.getUTCHours() === 0 && t.data.date.getUTCMinutes() === 0 ? new Date(t.data.date.getTime() + 12 * 3600e3) : t.data.date).toISOString(),
    speaker: t.data.speaker,
    book: t.data.book,
    passage: t.data.passage,
    series: t.data.series,
    videoUrl: t.data.videoUrl,
    audioUrl: t.data.audioUrl,
    notesUrl: t.data.notesUrl,
    transcriptUrl: t.data.transcriptUrl,
    summary: t.data.summary,
    href: `/teachings/${t.id}`,
    source: 'file' as const,
  }));
  const known = new Set(curated.flatMap((c) => [c.videoUrl, c.audioUrl]).filter(Boolean));
  const knownTitles = new Set(curated.map((c) => c.title.toLowerCase()));
  const episodes: TeachingItem[] = (await getPodcastEpisodes(church.podcast.feedUrl))
    .filter((e) => !knownTitles.has(e.title.toLowerCase()) && !(e.pageUrl && known.has(e.pageUrl)))
    .map((e) => {
      const { book, chapter } = bookFromTitle(e.title);
      return {
        key: `pod-${e.id}`,
        title: e.title,
        date: e.published.toISOString(),
        speaker: church.seniorPastor.known,
        book,
        passage: book && chapter ? `${book} ${chapter}` : undefined,
        series: church.podcast.name,
        audioUrl: e.pageUrl ?? e.audioUrl,
        summary: e.summary,
        source: 'podcast' as const,
      };
    });
  const feed: TeachingItem[] = (await getLatestVideos(church.youtube.channelId))
    .filter((v) => !known.has(v.url))
    .map((v) => ({
      key: `yt-${v.id}`,
      title: v.title,
      date: v.published.toISOString(),
      videoUrl: v.url,
      thumbnail: v.thumbnail,
      source: 'youtube' as const,
    }));
  return [...curated, ...episodes, ...feed].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The newest teaching from a live feed: YouTube first (the Sunday and Wednesday
 * services), then the Hold Fast podcast. Hand-entered files never headline the
 * homepage, so it cannot go stale. Returns undefined when no feed was reachable.
 */
export async function getLatestTeaching(): Promise<TeachingItem | undefined> {
  const all = await getTeachings();
  return all.find((t) => t.source === 'youtube') ?? all.find((t) => t.source === 'podcast');
}
