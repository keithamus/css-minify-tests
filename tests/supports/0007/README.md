# Keep `color-mix()` with three colours in `@supports not`

Resolving the color-mix to `#555` makes `not` always false, so browsers which
support the `color-mix()` value would *not* apply these rules.
