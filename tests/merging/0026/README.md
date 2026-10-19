# Merge complexly overlapping separate groups, keeping correct order

In this example, `.x` has two rules, however moving the `margin` up could
potentially break specificity if `z` and `x` applied to the same element.
Similarly moving the `color` down is blocked by `.y`. However, you can safely
move the `.y` color` down to merge with `margin`. After doing this, `.x` is now
free to move the `color` down to merge with `margin` in the later `.x` rule.
