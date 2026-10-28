# Unitless `<number>` values use scientific notation when shorter

Unlike `<integer>`, a `<number>` can be written in scientific notation.
`animation-iteration-count`, `flex-grow`, `tab-size` and `scale()` take a
`<number>`, so `1000000` is shorter as `1e6`.
