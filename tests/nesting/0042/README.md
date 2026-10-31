# Merge consecutive nesting wrappers with the same parent selector

This validates that the similarities between `.a .c` and `.a:hover .c` are
nested by the minifier, as well as being merged and nested with `.a .b` for the
shortest possible selector.
