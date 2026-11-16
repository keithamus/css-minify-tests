# Reorder non-intersecting rules so adjacent rules can be nested

In this example the first and third rule share a parent selector, as does the
second and fourth rule. Because second and third rules do not effect the same
properties, they can be re-ordered. This allows the 1st and 3rd to become
adjacent, and the 2nd and 4th as well. They can then be nested under their
shared parent selector.
