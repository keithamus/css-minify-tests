# Merge 3 separate groups, keeping correct order

In this example, `.x` with `color` and `margin` can be merged, because there are
no other rules between them with a margin that could potentially override `.x` if
it's margin was moved up and merged with the first instance. After that the
second `.x` can be removed leaving two `.y` and two `.z`. This process repeats
with `.y`, then finally with `.z`.
