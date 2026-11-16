# Merge media queries separated by non-intersecting rule

There are 3 media queries with the same condition. One rule separates the second
and third media queries. Although this rule's selector (`.c`) is used in a rule
in the following media query, the properties in it are not affected by any of
the queries. This means they can all be safely merged, and the `.c` rule can be
placed before or after them.
