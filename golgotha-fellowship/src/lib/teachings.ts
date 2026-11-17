import { getCollection } from 'astro:content';
import { church } from '../config/church';
import { getLatestVideos } from './youtube';
import { getPodcastEpisodes, bookFromTitle } from './podcast';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const thumbFiles = import.meta.glob<{ default: ImageMetadata }>('/src/assets/teachings/*.{jpg,jpeg,png,webp}', { eager: true });
async function thumbUrl(name?: string) {
  const hit = name && Object.keys(thumbFiles).find((p) => p.replace(/\.[^.]+$/, '') === `/src/assets/teachings/${name}`);
  if (!hit) return undefined;
  return (await getImage({ src: thumbFiles[hit].default, width: 1280, format: 'webp' })).src;
}

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
  /** The sermon's own page on this site. Every teaching has one. */
  href: string;
  /** Longer text for the sermon page (YouTube description or podcast notes). */
  body?: string;
  /** Where the entry came from. Only live feeds ('youtube', 'podcast') can be the homepage's latest teaching. */
  source: 'file' | 'podcast' | 'youtube';
  featured?: boolean;
}

import { cleanTitle, isDuplicateUpload, slugify, bookSlug } from './sermon-text';
export { cleanTitle, isDuplicateUpload, slugify, bookSlug };

let all: Promise<TeachingItem[]> | undefined;
export function getTeachings(): Promise<TeachingItem[]> {
  all ??= loadTeachings();
  return all;
}

async function loadTeachings(): Promise<TeachingItem[]> {
  const entries = (await getCollection('teachings')).filter((t) => t.data.published);
  const curated: TeachingItem[] = await Promise.all(entries.map(async (t) => ({
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
    thumbnail: await thumbUrl(t.data.thumbnail),
    featured: t.data.featured,
    source: 'file' as const,
  })));
  const known = new Set(curated.flatMap((c) => [c.videoUrl, c.audioUrl]).filter(Boolean));
  const knownIds = new Set(curated.map((c) => c.videoUrl?.match(/[?&]v=([\w-]{11})/)?.[1]).filter(Boolean));
  const knownTitles = new Set(curated.map((c) => c.title.toLowerCase()));
  const episodes: TeachingItem[] = (await getPodcastEpisodes(church.podcast.feedUrl))
    .filter((e) => !knownTitles.has(e.title.toLowerCase()) && !(e.pageUrl && known.has(e.pageUrl)))
    .map((e) => {
      const { book, chapter } = bookFromTitle(e.title);
      const title = cleanTitle(e.title);
      return {
        key: `pod-${e.id}`,
        href: '',
        title,
        body: e.summary,
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
    .filter((v) => !known.has(v.url) && !knownIds.has(v.id) && !isDuplicateUpload(v.title))
    .map((v) => {
      const title = cleanTitle(v.title);
      const { book, chapter } = bookFromTitle(title);
      // Ministry studies are often led by someone else; only main teachings are credited to the pastor.
      const ministry = title.match(/^(Men['’]s|Women['’]s|Youth|Kids)\b[^0-9]*?(Bible )?Study/i)?.[0];
      return {
      key: `yt-${v.id}`,
      href: '',
      title,
      speaker: ministry ? undefined : church.seniorPastor.known,
      book,
      passage: book && chapter ? `${book} ${chapter}` : undefined,
      series: ministry ?? book,
      body: v.description,
      date: v.published.toISOString(),
      videoUrl: v.url,
      thumbnail: v.thumbnail,
      source: 'youtube' as const,
    };
    });
  const items = [...curated, ...episodes, ...feed].sort((a, b) => b.date.localeCompare(a.date));
  // Every feed item gets a stable page address: /teachings/2026-11-15-revelation-20-part-2
  const used = new Set(curated.map((c) => c.href));
  for (const t of items) {
    if (t.href) continue;
    let href = `/teachings/${t.date.slice(0, 10)}-${slugify(t.title)}`;
    for (let n = 2; used.has(href); n++) href = `/teachings/${t.date.slice(0, 10)}-${slugify(t.title)}-${n}`;
    used.add(href);
    t.href = href;
  }
  return items;
}

/**
 * The newest teaching from a live feed: YouTube first (the Sunday and Wednesday
 * services), then the Hold Fast podcast. Hand-entered files never headline the
 * homepage, so it cannot go stale. Returns undefined when no feed was reachable.
 */
export async function getLatestTeaching(): Promise<TeachingItem | undefined> {
  const all = await getTeachings(); // newest first
  // A featured file counts as live until a newer upload appears in a feed.
  return all.find((t) => t.source === 'youtube' || t.featured) ?? all.find((t) => t.source === 'podcast');
}
