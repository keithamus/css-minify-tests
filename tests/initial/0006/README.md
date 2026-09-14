# Convert `mask-origin` `border-box` value to `initial`

The `initial` value for `mask-origin` is `border-box`, so they are equivalent.
However, `initial` is both shorter and a global value (giving more opportunities
for gzipping).

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-origin#formal_definition
