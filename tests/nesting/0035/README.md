# Flatten multi-level nesting of single selectors

If a child in a nested selector is not comma separated, it can be merged with
the parent, if it is also not comma separated, removing the extra curly braces.
