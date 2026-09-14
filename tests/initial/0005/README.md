# Convert `mask-clip` `border-box` value to `initial`

The `initial` value for `mask-clip` is `border-box`, so they are equivalent.
However, `initial` is both shorter and a global value (giving more opportunities
for gzipping).

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-clip#formal_definition
