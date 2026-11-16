# Photos

Only real photos of Golgotha Fellowship, used with permission. Never stock or
AI-generated images of "church life". Photos of children need a signed release.

Drop a file here with one of these names (jpg, png, webp or avif) and it appears
on the site automatically at the next build. Missing photos fall back to a clean
typographic layout.

| Filename            | Where it appears                                  | Suggested size |
|---------------------|----------------------------------------------------|----------------|
| `hero`              | Homepage hero background (congregation, landscape) | 2400 x 1400    |
| `welcome`           | Homepage welcome section (people together)         | 1600 x 1200    |
| `pastor-marty`      | Homepage welcome inset                             | 1000 x 1250    |
| `sunday-teaching`   | Homepage "A Sunday at Golgotha" card 1             | 1200 x 900     |
| `sunday-fellowship` | Homepage "A Sunday at Golgotha" card 2             | 1200 x 900     |
| `kids`              | Homepage card 3, kids tile and kids page           | 1600 x 1200    |
| `teaching`          | Homepage navy teaching panel                       | 1800 x 1200    |
| `youth`, `men`, `women`, `outreach`, `missions` | Ministry tiles and pages | 1600 x 1200    |
| `exterior`          | I'm New page (building / entrance)                 | 1600 x 1000    |
| `community`         | About page                                         | 1600 x 1000    |
| `leadership/<id>`   | Leadership page (set `photo:` in leaders.yaml)     | 800 x 1000     |

The review build (`npm run build:review`) shows a striped "Photo needed" box wherever a
file is still missing, with the exact filename to use.
