# Convert large `ms` values to `s` in scientific notation

`1000000ms` is `1000s`, which is `1e3s` in scientific notation. That is
shorter than both `1e6ms` and `1000s`. The same applies to numbers beyond
2^24: `300000000000000000000000000000ms` is `3e26s`.
