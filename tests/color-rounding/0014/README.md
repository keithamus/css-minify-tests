# OKLCH percentage lightness when rounding

For `oklch()`, lightness `100%` equals `1`, so `70%` becomes `.7`. Dropping the
`%` without scaling gives `70`, which clamps to `1` (maximum lightness). The
colour is outside sRGB, so it stays in oklch with C at 3dp.
