/**
 * Hold Fast episodes from the church's public Buzzsprout podcast feed, read at build time.
 * Every deploy picks up new episodes automatically. If the feed cannot be reached the
 * site keeps working with whatever is in src/content/teachings.
 */
export interface FeedEpisode {
  id: string;
  title: string;
  published: Date;
  pageUrl?: string;
  audioUrl?: string;
  summary?: string;
}

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#8217;/g, '’')
    .trim();
const strip = (html: string) => decode(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1];

export function parseRss(xml: string): FeedEpisode[] {
  const out: FeedEpisode[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = m[1];
    const title = tag(item, 'title');
    const pub = tag(item, 'pubDate');
    if (!title || !pub) continue;
    const published = new Date(decode(pub));
    if (Number.isNaN(published.getTime())) continue;
    const audioUrl = item.match(/<enclosure[^>]*url="([^"]+)"/)?.[1];
    const pageUrl = tag(item, 'link');
    const guid = tag(item, 'guid');
    const desc = tag(item, 'description') ?? tag(item, 'itunes:summary');
    let summary = desc ? strip(desc) : undefined;
    if (summary && summary.length > 220) summary = summary.slice(0, 217).replace(/\s+\S*$/, '') + '…';
    out.push({
      id: decode(guid ?? audioUrl ?? title),
      title: decode(title),
      published,
      pageUrl: pageUrl ? decode(pageUrl) : undefined,
      audioUrl: audioUrl ? decode(audioUrl) : undefined,
      summary,
    });
  }
  return out.sort((a, b) => b.published.getTime() - a.published.getTime());
}

/** "Revelation 3 Philadelphia Part 3" -> { book: 'Revelation', chapter: '3' } when the title starts with a book name. */
const BOOKS = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Psalm','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
export function bookFromTitle(title: string): { book?: string; chapter?: string } {
  const t = title
    .replace(/^(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)\.?\s+\d{1,2}\s+/, '') // leading date, e.g. "March 18 "
    .replace(/^Hold Fast\s+/i, '');
  const book = BOOKS.find((b) => t.startsWith(b + ' ') || t === b);
  if (!book) return {};
  const chapter = t.slice(book.length).match(/^\s+(\d{1,3})\b/)?.[1];
  return { book: book === 'Psalm' ? 'Psalms' : book, chapter };
}

let cache: Promise<FeedEpisode[]> | undefined;
export function getPodcastEpisodes(feedUrl: string | null): Promise<FeedEpisode[]> {
  if (!feedUrl) return Promise.resolve([]);
  cache ??= (async () => {
    try {
      const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseRss(await res.text());
    } catch (err) {
      console.warn(`[podcast] Feed unavailable (${String(err)}). Using teaching files only.`);
      return [];
    }
  })();
  return cache;
}
