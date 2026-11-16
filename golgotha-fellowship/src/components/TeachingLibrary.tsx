import { useMemo, useState } from 'react';
import type { TeachingItem } from '../lib/teachings';

/**
 * Searchable, filterable teaching library (React island - the only one on the site).
 * Filters appear only for fields that actually exist in the data.
 */
const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Boise' });
const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort();

export default function TeachingLibrary({ items }: { items: TeachingItem[] }) {
  const [q, setQ] = useState('');
  const [book, setBook] = useState('');
  const [series, setSeries] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [media, setMedia] = useState('');
  const [sort, setSort] = useState<'new' | 'old'>('new');

  const books = useMemo(() => uniq(items.map((i) => i.book)), [items]);
  const seriesList = useMemo(() => uniq(items.map((i) => i.series)), [items]);
  const speakers = useMemo(() => uniq(items.map((i) => i.speaker)), [items]);
  const hasAudio = items.some((i) => i.audioUrl);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = items.filter((i) => {
      if (book && i.book !== book) return false;
      if (series && i.series !== series) return false;
      if (speaker && i.speaker !== speaker) return false;
      if (media === 'video' && !i.videoUrl) return false;
      if (media === 'audio' && !i.audioUrl) return false;
      if (!needle) return true;
      return [i.title, i.passage, i.book, i.series, i.speaker, i.summary].some((f) => f?.toLowerCase().includes(needle));
    });
    return sort === 'new' ? out : [...out].reverse();
  }, [items, q, book, series, speaker, media, sort]);

  const active = q || book || series || speaker || media;
  const reset = () => { setQ(''); setBook(''); setSeries(''); setSpeaker(''); setMedia(''); };

  const select = (id: string, label: string, value: string, set: (v: string) => void, options: string[], all: string) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => set(e.target.value)}>
        <option value="">{all}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <form role="search" aria-label="Search teachings" onSubmit={(e) => e.preventDefault()} className="card grid gap-5 p-5 md:grid-cols-2 md:p-6 lg:grid-cols-4">
        <div className="field md:col-span-2">
          <label htmlFor="t-q">Search by title, passage or series</label>
          <input id="t-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Revelation 3" />
        </div>
        {books.length > 0 && select('t-book', 'Book of the Bible', book, setBook, books, 'All books')}
        {seriesList.length > 0 && select('t-series', 'Series', series, setSeries, seriesList, 'All series')}
        {speakers.length > 0 && select('t-speaker', 'Speaker', speaker, setSpeaker, speakers, 'All speakers')}
        {hasAudio && (
          <div className="field">
            <label htmlFor="t-media">Format</label>
            <select id="t-media" className="input" value={media} onChange={(e) => setMedia(e.target.value)}>
              <option value="">Video and audio</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="t-sort">Order</label>
          <select id="t-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as 'new' | 'old')}>
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
          </select>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-semibold">
          {results.length} {results.length === 1 ? 'teaching' : 'teachings'}{active ? ' found' : ''}
        </p>
        {active && <button type="button" className="btn btn-secondary" onClick={reset}>Clear filters</button>}
      </div>

      {results.length === 0 ? (
        <p className="card mt-6 p-6 text-body">No teachings match those filters. Try a different search, or clear the filters.</p>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => {
            const primary = t.href ?? t.videoUrl ?? t.audioUrl;
            const external = !t.href;
            return (
              <li key={t.key} className="card flex flex-col overflow-hidden">
                {t.thumbnail && <img src={t.thumbnail} alt="" loading="lazy" decoding="async" width={480} height={360} className="aspect-video w-full object-cover" />}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.9rem] text-body">
                    {fmt.format(new Date(t.date))}{t.speaker ? ` · ${t.speaker}` : ''}
                  </p>
                  <h3 className="mt-1.5 !text-[1.3rem]">
                    {primary ? (
                      <a className="card-link no-underline hover:underline" href={primary} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
                        {t.title}{external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    ) : t.title}
                  </h3>
                  {(t.passage || t.series) && <p className="mt-1.5 text-[0.95rem] text-sage font-semibold">{[t.passage, t.series && `Series: ${t.series}`].filter(Boolean).join(' · ')}</p>}
                  {t.summary && <p className="mt-2 text-[0.95rem] text-body">{t.summary}</p>}
                  <ul className="mt-auto flex flex-wrap gap-x-5 pt-4 text-[0.95rem]">
                    {t.videoUrl && <li><a className="link inline-flex min-h-11 items-center" href={t.videoUrl} target="_blank" rel="noopener" data-goal="watch">Watch<span className="sr-only"> {t.title} (opens in a new tab)</span></a></li>}
                    {t.audioUrl && <li><a className="link inline-flex min-h-11 items-center" href={t.audioUrl} target="_blank" rel="noopener">Listen<span className="sr-only"> to {t.title} (opens in a new tab)</span></a></li>}
                    {t.notesUrl && <li><a className="link inline-flex min-h-11 items-center" href={t.notesUrl} target="_blank" rel="noopener">Notes<span className="sr-only"> for {t.title} (opens in a new tab)</span></a></li>}
                    {t.transcriptUrl && <li><a className="link inline-flex min-h-11 items-center" href={t.transcriptUrl} target="_blank" rel="noopener">Transcript<span className="sr-only"> of {t.title} (opens in a new tab)</span></a></li>}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
