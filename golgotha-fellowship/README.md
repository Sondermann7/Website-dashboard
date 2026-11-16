# Golgotha Fellowship website

Rebuilt website for Golgotha Fellowship, Nampa, Idaho.
Astro + TypeScript + Tailwind CSS, static HTML, one React island (teaching search),
deployable to Cloudflare Pages.

**Status: built and tested, NOT launch-ready.** Three blockers need church input —
see [docs/LAUNCH_REPORT.md](docs/LAUNCH_REPORT.md). The live church site and DNS have
not been touched.

## Run it

```bash
npm install
npm run dev            # local preview at http://localhost:4321
npm run build          # production build -> dist/
npm run build:review   # staged build WITH orange TODO_VERIFY flags for church review
npm test               # form backend + YouTube feed parser tests
npm run launch-check   # fails until every launch blocker is cleared
node scripts/qa.cjs    # screenshots at 390/768/1024/1440 + axe accessibility scan (needs `npx astro preview` running)
```

## Where things live

| What | Where |
|---|---|
| Service times, address, phone, links (single source of truth) | `src/config/church.ts` |
| Ministries, events, teachings, announcements, leadership, visitor FAQ, beliefs | `src/content/` |
| Photos and logo (drop-in by filename) | `src/assets/photos/`, `src/assets/brand/` |
| Design tokens (colors, type scale) | `src/styles/global.css` |
| Form backend (Cloudflare Pages Function) | `functions/api/forms.ts` |
| Old-URL redirects, security headers | `public/_redirects`, `public/_headers` |
| Audit, content checklist, launch report, editing guide | `docs/` |

## Deploy (Cloudflare Pages)

- Root directory: `golgotha-fellowship` · Build command: `npm run build` · Output: `dist`
- Use a **preview** project/branch with `PUBLIC_REVIEW_MODE=true` for church review.
- Environment variables: see `.env.example`.
- Do not attach the production domain until `npm run launch-check` passes and the
  church has approved the staged site.
