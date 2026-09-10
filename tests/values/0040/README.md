# Convert time lengths

A length of time can be represented in `ms` or `s`. The `s` representation is
shorter in all cases above `99ms` and should be preferred by the minifier. A
time length of 0 must not be unitless, and in this case `s` is shorter.
