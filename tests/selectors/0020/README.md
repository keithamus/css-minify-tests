# Remove usesless `:is()` around pseudo-classes

If an `:is()` wraps well-known pseudo-classes (`:hover`, `:required`, etc), it
can safely be removed. The selectors have the same level of specificity. and
there is no risk of the browser ignoring the rule because the selectors are
common.
