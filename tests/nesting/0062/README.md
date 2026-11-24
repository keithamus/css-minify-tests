# Nesting across mergeable media queries with pseudo-classes/short class names

In this test there are two rules and two media queries at the top level that
intersect. Since the first media query does not impact the following rule, their
positions can be swapped. This makes the rules and `@media` blocks adjacent. The
rules can be nested. The media queries can be merged, then the rules in the
singular `@media` block can be nested.

The expectation shows the shortest representation of this code, however, it is
highly dependent on the size of the selector and the `@media` condition. See:
`nesting/0061` "Nesting across mergeable media queries with pseudo-classes/long
class names" for another example that requires a different nesting.
