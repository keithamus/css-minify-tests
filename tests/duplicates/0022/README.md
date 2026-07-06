# Convert double-colon before/after to single and de-dupe separate selector

The `::before` and `::after` pseudo-elements can safely be converted to
`:before` or `:after`. After this conversion, the minifier should check for
duplicate selectors and properties that can be removed.
