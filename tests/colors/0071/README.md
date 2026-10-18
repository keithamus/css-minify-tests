# color-mix() with none alpha premultiplies after filling alpha

A alpha of `none` in `color-mix()` takes the other color's alpha (0.5) before
premultiplication, so both colors are premultiplied by 0.5. Treating `none` as
`0` instead gives incorrect results.

**References:**

* https://github.com/w3c/csswg-drafts/issues/13994
* https://github.com/csskit/csskit/issues/1195
