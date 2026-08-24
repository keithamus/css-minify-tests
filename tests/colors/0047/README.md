# color-mix() with 3 colors (N-color support)

`color-mix(in oklab, red, orange, purple)` mixes three equal-weight colors.
CSS Color 5 allows N colors in color-mix(); no percentages means each gets 1/3.

These colours have been carefully chosen so that the mix remains in-gamut,
meaning the result can safely be reduced to `#d45456`.
