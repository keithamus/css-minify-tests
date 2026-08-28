# Border side shorthands collapse to multi-value longhands

`margin-top`/`right`/`bottom`/`left` collapse into one to four `margin` values,
but `border` is not a four-sided shorthand: it takes a width, a style and a
colour. Four differing `border-top`/`right`/`bottom`/`left` declarations can't
be represented by `border` effectively, so treating it like a shorthand with
sides would result in an invalid declaration such as
`border: 1px solid red 2px dotted blue`.

They can, however, be reduced to a shorter value by using the `border-color`,
`border-style`, `border-width` syntax, which will result in overall smaller CSS.
