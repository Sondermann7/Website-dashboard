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

## Current files are stand-ins

`logo`, `logo-light`, `calvary-dove` and `calvary-dove-light` were lifted from phone
screenshots of the church's own graphics (white artwork separated from its background;
the dark versions are the same artwork tinted navy). They are low resolution. Replace
them with the original vector files under the same names.

## Navy

`#313D65`, sampled from the church's "Join us" graphic. Set in `--color-navy` at the top
of `src/styles/global.css`.
