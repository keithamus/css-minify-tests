# Convert `min-width` to range syntax

`(min-width: 768px)` can be shortened to `(width>=768px)` using Media Queries
Level 4 range syntax. Do not minify to `width>767px` as this is not technically
accurate, because fractional units, like `767.5px` are valid in CSS and would be
included with `>767px`, but would not be included with `>=768px`.
