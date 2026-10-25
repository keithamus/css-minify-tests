# `:is` replaces `:-moz-any`, `:-webkit-any`, `:matches` when 2 or more present

The psuedo-classes `:-moz-any()`, `:-webkit-any()`, and `:matches()` are all
browser specific precursors to `:is()`, which all browsers now support. The
older versions are only understood by certain browsers, so combining these
selectors into one rule will cause that rule to be ignored by all browsers
(unless wrapped in an `:is()`). If there are at least 2 out of the 3 outdated
selectors with matching rules, they can be merged and replaced with `:is`. If
the rule is unique, it should be considered as a vendor-specific rule and not
converted to `:is` which would change the functionality to work in all browsers
instead of just a subset.
