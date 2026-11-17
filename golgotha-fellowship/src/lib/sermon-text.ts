/** Pure text helpers for sermon titles and page addresses (no site imports, so tests can load them). */

/** "Revelation 20 Pt. 2 - Teaching Only" -> "Revelation 20, Part 2". */
export function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*[-–—|]?\s*\(?teaching only\)?\s*$/i, '')
    .replace(/\s+Pt\.?\s*(\d+)/i, ', Part $1')
    .replace(/\s+Part\s+(\d+)/i, (m, n, off, str) => (str[off - 1] === ',' ? m : `, Part ${n}`))
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Full-service live streams (titled with a service time) and Shorts duplicate the teaching-only upload. */
export function isDuplicateUpload(title: string): boolean {
  return /\b\d{1,2}:\d{2}\s*(AM|PM)\b/i.test(title) || /full service/i.test(title) || /#shorts?\b/i.test(title);
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

export const bookSlug = (book: string) => slugify(book);

