# Fold in-range `calc()` results without clamping

`column-count` must be at least `1`. `calc(5 - 2)` is already in range, so it
folds to `3`. Clamping only applies to results outside the allowed range.
