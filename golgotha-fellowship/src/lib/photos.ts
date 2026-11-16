import type { ImageMetadata } from 'astro';

/**
 * Photo lookup by filename. Drop a real, church-approved photo into
 * src/assets/photos/ (e.g. hero.jpg) and the matching slot on the site fills in.
 * When a photo is missing the site falls back to a typographic layout - it never
 * shows stock or generated imagery in place of the real congregation.
 */
const photos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);
const brand = import.meta.glob<{ default: ImageMetadata }>('/src/assets/brand/*.{png,webp,svg,PNG}', {
  eager: true,
});

function find(files: Record<string, { default: ImageMetadata }>, prefix: string, name?: string) {
  if (!name) return undefined;
  const hit = Object.keys(files).find((p) => p.replace(/\.[^.]+$/, '') === `${prefix}${name}`);
  return hit ? files[hit].default : undefined;
}

export const getPhoto = (name?: string) => find(photos, '/src/assets/photos/', name);
/** "logo" for light backgrounds, "logo-light" for dark; "calvary-dove(-light)" is the affiliation mark. */
export const getLogo = (variant: 'logo' | 'logo-light' | 'calvary-dove' | 'calvary-dove-light') => find(brand, '/src/assets/brand/', variant);
