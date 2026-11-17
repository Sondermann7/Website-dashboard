import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed } from '../src/lib/youtube.ts';

const xml = `<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"><title>Channel</title>
<entry><id>yt:video:aaa</id><yt:videoId>aaa</yt:videoId><title>Older &amp; wiser</title><published>2026-01-04T18:00:00+00:00</published></entry>
<entry><id>yt:video:bbb</id><yt:videoId>bbb</yt:videoId><title>Newer</title><published>2026-01-11T18:00:00+00:00</published></entry>
<entry><title>No id</title><published>2026-01-12T18:00:00+00:00</published></entry></feed>`;

test('parses entries, newest first, decoding entities and skipping malformed ones', () => {
  const v = parseFeed(xml);
  assert.equal(v.length, 2);
  assert.equal(v[0].id, 'bbb');
  assert.equal(v[1].title, 'Older & wiser');
  assert.equal(v[0].url, 'https://www.youtube.com/watch?v=bbb');
});
test('garbage input yields an empty list', () => assert.deepEqual(parseFeed('<html>blocked</html>'), []));

import { parseRss, bookFromTitle } from '../src/lib/podcast.ts';
const rss = `<?xml version="1.0"?><rss><channel><title>Hold Fast</title>
<item><title>Feb 25 Hold Fast Revelation 2 Pergamos Part 3</title><pubDate>Wed, 25 Feb 2026 08:00:00 -0700</pubDate>
<link>https://golgothafellowship.buzzsprout.com/2180061/episodes/1</link><guid isPermaLink="false">Buzzsprout-1</guid>
<enclosure url="https://www.buzzsprout.com/2180061/1.mp3" length="1" type="audio/mpeg"/><description><![CDATA[<p>Teaching &amp; more</p>]]></description></item>
<item><title>Revelation 3 Philadelphia Part 3</title><pubDate>Wed, 18 Mar 2026 08:00:00 -0600</pubDate><guid>Buzzsprout-2</guid></item>
<item><title>No date</title></item></channel></rss>`;
test('podcast feed: newest first, entities decoded, undated items skipped', () => {
  const e = parseRss(rss);
  assert.equal(e.length, 2);
  assert.equal(e[0].title, 'Revelation 3 Philadelphia Part 3');
  assert.equal(e[1].audioUrl, 'https://www.buzzsprout.com/2180061/1.mp3');
  assert.equal(e[1].summary, 'Teaching & more');
});
test('book and chapter read from episode titles', () => {
  assert.deepEqual(bookFromTitle('Revelation 3 Philadelphia Part 3'), { book: 'Revelation', chapter: '3' });
  assert.deepEqual(bookFromTitle('The Resurrection Part 5'), {});
  assert.deepEqual(bookFromTitle('1 John 4 God is Love'), { book: '1 John', chapter: '4' });
  assert.deepEqual(bookFromTitle('Mark 5 Healing'), { book: 'Mark', chapter: '5' });
  assert.deepEqual(bookFromTitle('Feb 25 Hold Fast Revelation 2 Pergamos Part 3'), { book: 'Revelation', chapter: '2' });
});
