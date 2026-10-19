# Remove quotes in `font` shorthand and convert `bold` to `700`

In the `font` shorthand `font-weight` keywords, like `normal` and `bold`, can be
converted to their numeric equivalent (`400`, `700`, etc). In this example the
`font-family` values are wrapped in quotes touching the `font-size`. This is
valid and works, however adding a space and removing the quotes is also valid
and will always be fewer characters.
