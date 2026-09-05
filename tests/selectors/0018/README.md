# Remove usesless `:is()`

If a `:is()` function only contains one element, and there is no comma-separated
list of other selectors, then the `:is` offers no value and can be removed from
the rule.
