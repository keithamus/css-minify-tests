# Numbers beyond `f32` precision must be preserved

`16777217` is larger than 2^24 and can't be represented exactly as an `f32`.
A minifier that writes numbers back out from an `f32` would produce
`16777216`, and `4e38` overflows to infinity, producing `infpx`. These
numbers must be kept as written.
