# Clamp `calc()` results to the allowed range

`column-count` must be at least `1`. A top-level `calc()` outside the allowed
range is not a parse error; it is clamped when the value is computed. So
`calc(2 - 2)` is valid and computes to `1`. Folding it to a literal `0` is
invalid and drops the declaration.
