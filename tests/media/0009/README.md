# Combined `min-width`/`max-width` to range syntax

`(min-width: 768px) and (max-width: 1024px)` can be collapsed into a single
range condition `(768px<=width<=1024px)`, eliminating the `and` keyword and
one pair of parentheses. Do not minify to `767px<width<1025px` as this is not
technically accurate, because fractional units, like `767.5px` are valid in CSS.
