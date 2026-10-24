# Resolve `calc()` in colour channels

`calc(255 / 2)` is `127.5`, which rounds to `128` in sRGB. `rgb(128 0 0)` is
`maroon`, which is shorter than `#800000`.
