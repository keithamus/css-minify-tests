# Merge matching nested attribute selectors and `:not()`

The nested selectors `[disabled]` and `:not(:active)` both have the same `0-1-0`
specificity. Since they also have an identical rule declaration, they can be
merged.
