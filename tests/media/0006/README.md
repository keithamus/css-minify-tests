# Convert `max-width` to range syntax

`(max-width: 1024px)` can be shortened to `(width<=1024px)` using Media Queries
Level 4 range syntax.  Do not minify to `width<1025px` as this is not
technically accurate, because fractional units, like `1024.5px` are valid in
CSS.
