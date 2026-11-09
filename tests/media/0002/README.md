# Merge nested `@media` into one query

A `@media` nested directly inside another only applies when both match, so the
two can be joined with `and`. `screen and (width>=768px)` is shorter than
keeping the inner `@media` block. Rule order is unchanged, so the cascade is
unaffected.
