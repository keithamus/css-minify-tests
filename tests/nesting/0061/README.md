# Do not nest `a:hover` with `a,b`

This handles a nesting edgecase to ensure a psuedo-class like `:hover` is not
applied to more selectors than it should be (`.b`, in this case). Nesting would
be equivalent to `a:hover,b:hover` which is incorrect.
