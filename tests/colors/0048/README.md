# color-mix() all-zero percentages become transparent black

`color-mix(in srgb, red 0%, green 0%, blue 0%)` has all percentages at 0%,
so the sum is 0% and leftover is 100%. Per CSS Color 5, when leftover equals
100% the result is transparent black. The shortest representation is `#0000`.
