# Convert `min-height` to range syntax

`(min-height: 600px)` can be shortened to `(height>=600px)` using Media Queries
Level 4 range syntax. Do not minify to `height>599px` as this is not technically
accurate, because fractional units, like `599.5px` are valid in CSS and would be
included with `<599px`, but would not be included with `<=600px`.
