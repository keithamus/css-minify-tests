# Nesting across mergeable media queries with pseudo-classes/long class names

In this test there are two rules and two media queries at the top level that
intersect. Since each `@media` block only contains a matched selector that it
is adjacent to, the block can be nested under it. After each `@media` is nested,
then the `.a-very-long-class:hover` rule can be nested too.

The expectation shows the shortest representation of this code, however, it is
highly dependent on the size of the selector and the `@media` condition. See:
`nesting/0062` "Nesting across mergeable media queries with pseudo-classes/short
class names" for another example that requires a different nesting.
