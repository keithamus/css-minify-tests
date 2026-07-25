# Do not merge matching nested/un-nested rules with different specificty

Multiple selectors on the same level of a nested structure will be treated like
`:is`, deferring to the highest specificity.

**Example:** `#a,.b{.c{color:red}}` is equivalent to `:is(#a,.b) .c{color:red}`.
It is NOT equivalent to `#a .c,.b .c{color:red}`, which would result in a
different level of specificity, as `:is` will always use the highest specificity
found across all selectors inside it.
