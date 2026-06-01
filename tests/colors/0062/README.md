# color-mix() N-color with var() cannot be resolved

`color-mix(in srgb, blue 50%, var(--foo), red 50%)` contains a var() mid-list.
Even though the known percentages sum to 100%, the var() may carry its own
percentage (e.g. `green 20%`), which would change normalization. A minifier
must not reduce this; the result is whitespace-stripped only.
