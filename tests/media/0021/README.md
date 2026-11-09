# Do not remove a sub-pixel `@media` range

`(767px<width<768px)` looks empty but is not: viewport widths can be
fractional. Firefox at a device pixel ratio of 2 gives a `767.5px` wide frame,
which matches. The block must be kept, not removed as dead code.
