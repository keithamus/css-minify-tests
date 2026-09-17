# Merge identical rules with children, keep distinct properties in separate rule

In this example, the `.a .x` rule can be nested under `.a`, and the `.b .x` rule
can be nested under `.b`. This results in 2 identical rules, with the exception
of one distinct property in `.b` that can be moved to its own rule.
