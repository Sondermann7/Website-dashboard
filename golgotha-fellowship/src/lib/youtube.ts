/**
 * Latest uploads from the church's public YouTube feed, fetched at build time.
 * No API key. If the channel ID is not configured, or YouTube cannot be reached,
 * this returns an empty list and the site simply links to the channel.
 */
export interface FeedVideo {
  id: string;
  title: string;
  published: Date;
  url: string;
  thumbnail: string;
  description?: string;
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");

export function parseFeed(xml: string): FeedVideo[] {
  const out: FeedVideo[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = e.match(/<title>([^<]*)<\/title>/)?.[1];
    const published = e.match(/<published>([^<]+)<\/published>/)?.[1];
    const description = e.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1];
    if (!id || !title || !published) continue;
    const date = new Date(published);
    if (Number.isNaN(date.getTime())) continue;
    out.push({
      id,
      title: decode(title),
      published: date,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      description: description ? decode(description).trim() || undefined : undefined,
    });
  }
  return out.sort((a, b) => b.published.getTime() - a.published.getTime());
}

let cache: Promise<FeedVideo[]> | undefined;

export function getLatestVideos(channelId: string | null): Promise<FeedVideo[]> {
  if (!channelId) return Promise.resolve([]);
  cache ??= (async () => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseFeed(await res.text());
    } catch (err) {
      console.warn(`[youtube] Feed unavailable (${String(err)}). Falling back to channel link.`);
      return [];
    }
  })();
  return cache;
}
