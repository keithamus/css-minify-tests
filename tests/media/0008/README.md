# Convert `max-height` to range syntax

`(max-height: 900px)` can be shortened to `(height<=900px)` using Media Queries
Level 4 range syntax. Do not minify to `height<899px` as this is not technically
accurate, because fractional units, like `899.5px` are valid in CSS and would be
included with `<899px`, but would not be included with `<=900px`.
