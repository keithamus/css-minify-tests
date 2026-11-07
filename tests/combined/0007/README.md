# Complex border shorthand with `currentColor`

In this example, the border properties are separated. The `border-color` is
assigned to `currentColor` which is equivalent to `initial`, the default
value for this property. So it can be removed. Because the `border-width` has
multiple values, it cannot be included in the `border` shorthand. The shortest
version of this rule would be to only include the style (`dashed`) in the
`border` shorthand, followed by `border-width` as an override (this must not
occur before the `border` shorthand, or the width values will be ignored by the
browser). In this example, the `border-radius` can be placed anywhere in the
rule safely.

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-color#formal_definition


Combines:

* `initial/0009` - Convert `border-color` `currentcolor` value to `initial`
* `shorthands/0020` - Border shorthand must not clobber border-image
* `shorthands/0059` - Border shorthand containing multiple widths
