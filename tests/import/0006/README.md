# Keep `color-mix()` with three colours in `@import supports()`

The `supports()` condition on `@import` follows the same rules as `@supports`.
Resolving the mix to `#555` would load the stylesheet in browsers which might
not support `color-mix()`, or not support color-mix with with three or more
colours.
