# `background-color: initial` must not shorten

The initial value of `background-color` is `transparent`, which is longer than
`initial`. So it should not be replaced with the `transparent` keyword. However,
`transparent` is equivalent to `#0000`, which is shorter than `initial`
(**See:** `color/0063`).
