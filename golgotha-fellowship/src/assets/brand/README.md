# Logo, dove and brand colour

Put the church's own original files here (SVG, or PNG with a transparent background):

| Filename             | Used for                                              |
|----------------------|--------------------------------------------------------|
| `logo`               | Header (white background)                              |
| `logo-light`         | Footer (navy background). Optional; falls back to type. |
| `calvary-dove`       | Calvary Chapel dove: homepage beliefs section          |
| `calvary-dove-light` | Dove on navy: footer. Optional; falls back to `calvary-dove`. |

Until a file is present the site shows the church name in type, and no dove. Neither
mark is redrawn or recreated: both are the owners' artwork.

## Navy

The navy on the site is a stand-in. Sample the exact navy from the official logo and
set `--color-navy` at the top of `src/styles/global.css` (then nudge `--color-navy-soft`
lighter and `--color-navy-deep` darker to match).
