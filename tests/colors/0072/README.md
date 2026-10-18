# color-mix() with none alpha in legacy rgb() premultiplies after filling alpha

Like `color(srgb ...)`, `rgb()` with an alpha of `none` must keep the missing
alpha through interpolation, which means color-mix must adopt 0.5 from the
other color. Losing `none` early gives an incorrect result.

**References:**

* https://github.com/w3c/csswg-drafts/issues/13994
* https://github.com/csskit/csskit/issues/1195
