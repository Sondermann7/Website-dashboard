import { church, addressOneLine, directionsUrl, allGatherings } from '../config/church';

const TZ = 'America/Boise';

export const formatDate = (d: Date | string, opts: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
    ...opts,
  }).format(new Date(d));

export const formatTime = (d: Date | string) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ }).format(new Date(d));

export const joinTimes = (times: readonly string[]) =>
  times.length <= 1 ? (times[0] ?? '') : `${times.slice(0, -1).join(', ')} and ${times.at(-1)}`;

const g = (id: string) => allGatherings.find((x) => x.id === id);

/** Fills {tokens} in content files from the church config so facts stay in one place. */
export function fillTokens(text: string): string {
  const youth = g('youth');
  const map: Record<string, string> = {
    address: addressOneLine,
    directions: directionsUrl,
    phone: church.phone.display,
    email: church.email.general,
    youtube: church.youtube.channelUrl,
    sunday: joinTimes(g('sunday')?.times ?? []),
    wednesday: joinTimes(g('wednesday')?.times ?? []),
    youth: youth ? `${youth.day}s at ${joinTimes(youth.times)}` : '',
  };
  return text.replace(/\{(\w+)\}/g, (m, k: string) => map[k] ?? m);
}

/** Clean route path ("/about", "/") regardless of how the build names the file. */
export const cleanPath = (pathname: string) =>
  pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1') || '/';
