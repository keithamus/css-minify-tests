# Round `calc()` results for `<integer>` properties

`z-index` accepts only integers. `calc(7 / 3)` is rounded to `2`, but the
unrounded `2.33333` is invalid and drops the declaration.
