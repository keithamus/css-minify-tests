# Reorder non-intersecting rules so adjacent rules can be nested

In this example the first and third rule share a parent selector, as does the
second and fourth rule. Because the second and third rules do not effect the
same properties, they can be re-ordered. This allows the first and third to
become adjacent, and the second and fourth as well. They can then be nested
under their shared parent selector.
