# Complex partial merge inside overlapping nestable rules

The `.x h2` rule has higher specificity than the rules following it, so it is
safe to move it below any of them. This leaves all the `section` rules as
adjacent and ready for nesting. The `section h1` and `section > h1` rules share
partially share identical property/value pairs. The matching ones can be
combined into one rule, and the remaining unique property (`color:tan`) can be
a separate rule. Note that partial merges like this depend on the selector
length versus the length of the shared property/value pairs.
