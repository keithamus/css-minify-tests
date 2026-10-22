# Border shorthand with two border-color values

If you have a singular `border-width` and `border-style`, with two
`border-color`s, then you can create a border shorthand without a color, then
override the border-color and it will still be shorter than keeping each
property separate. The shorthand sets the color to `currentcolor`, which the
following `border-color` overrides on every side, so writing the first color
in the shorthand only adds bytes.
