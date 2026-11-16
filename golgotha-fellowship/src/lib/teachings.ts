import { getCollection } from 'astro:content';
import { church } from '../config/church';
import { getLatestVideos } from './youtube';

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
}

export async function getTeachings(): Promise<TeachingItem[]> {
  const entries = (await getCollection('teachings')).filter((t) => t.data.published);
  const curated: TeachingItem[] = entries.map((t) => ({
    key: t.id,
    title: t.data.title,
    date: t.data.date.toISOString(),
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
  }));
  const known = new Set(curated.map((c) => c.videoUrl).filter(Boolean));
  const feed: TeachingItem[] = (await getLatestVideos(church.youtube.channelId))
    .filter((v) => !known.has(v.url))
    .map((v) => ({
      key: `yt-${v.id}`,
      title: v.title,
      date: v.published.toISOString(),
      videoUrl: v.url,
      thumbnail: v.thumbnail,
    }));
  return [...curated, ...feed].sort((a, b) => b.date.localeCompare(a.date));
}
