# Nesting across media queries that need merged (with pseudo-classes)

In this test there are two rules and media queries at the top level that
intersect. The first media query does not target the same selectors as the
following rule, allowing them to swap places. This makes the rules and the media
queries adjacent, and allows them to be merged and nested.
