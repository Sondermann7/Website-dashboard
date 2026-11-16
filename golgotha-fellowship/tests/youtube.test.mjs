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
