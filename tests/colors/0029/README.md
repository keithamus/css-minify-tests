# color-mix in oklch resolved to oklch value

`color-mix(in oklch, red 50%, blue 50%)` can be resolved at build time to
`oklch(53.9985% .285449 326.643)`. A minifier that resolves the mix must do so
in oklch space -- mixing in srgb produces a different color. Keeping the result
in oklch avoids lossy gamut mapping to sRGB hex.
