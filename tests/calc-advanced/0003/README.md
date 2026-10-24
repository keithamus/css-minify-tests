# Merge rules after flattening negative `width` calculations to 0

In the CSS spec, widths cannot have negative values, so any calculation that
would return a negative value is interpretted as `0`.

* https://drafts.csswg.org/css-values/#example-6652ed9a
