import type { APIRoute } from 'astro';

/** Review builds are never indexable. Production allows everything and points to the sitemap. */
export const GET: APIRoute = ({ site }) => {
  const review = import.meta.env.PUBLIC_REVIEW_MODE === 'true';
  const body = review
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /thanks\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
