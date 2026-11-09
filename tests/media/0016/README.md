# Do not merge nested `@media` into a `not` query

`not` negates the whole query, so `not print and (width>=768px)` means "not
(print and wide)" and would also match narrow screens. A media type cannot be
negated on its own inside a condition, so the nesting must be kept.
