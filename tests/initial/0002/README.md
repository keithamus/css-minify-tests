# Convert `background-origin` `padding-box` value to `initial`

The `initial` value for `background-origin` is `padding-box`, so they are equivalent.
However, `initial` is both shorter and a global value (giving more opportunities
for gzipping).

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-origin#formal_definition
