# Merge and nest rules and media queries separated by each other

In this example, the first media query does not have anything that would
override the following rule, so it is safe to move it above the query. This then
groups the two rules and two queries to be adjacent to each other. The media
query conditions are identical, and can therefor be merged. The rules above, and
inside the queries, can be nested.

Combines:

* `merging/00xx` - Merge rules and media queries separated by each other
* `nesting/0010` - Introduce nesting
