# OKLCH percentage chroma kept when shorter

For `oklch()`, chroma `100%` equals `0.4` (not `150` as in `lch()`), so `80%`
equals `.32`. Keeping the percentage is shorter, as `%` ends the token and no
space is needed before the hue. The colour is outside sRGB, so it stays in
oklch with hue at 1dp.
