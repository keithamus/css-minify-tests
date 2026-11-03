# Nest selector lists into an existing non-adjacent parent

Every selector in `a .y, a .z` shares the parent `a`, which already exists
earlier in the stylesheet. Between these two points in the code no other rules
apply the same property at the same or higher specificity. This means a minifier
may move the nested rule up to the first `a` rule. There are also no rules with
the same property at the same or higher specificity after the first `a` rule,
meaning a minifier could move the first `a` rule after the `b` rule in this
example. The list should be nested under the existing `a` rule rather. A second
`a` wrapper should not be created.
