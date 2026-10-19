# Convert `border-*-color` `currentcolor` value to `initial`

The `initial` value for `border-top-color`, `border-right-color`,
`border-bottom-color`, `border-left-color`, and `border-color` is
`currentcolor`. This makes `currentcolor` (or `currentColor`) equivalent to
`initial` for these properties. However, `initial` is both shorter and a global
value (giving more opportunities for gzipping), so it should be used instead.

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-bottom-color#formal_definition
