# Apply 3 levels of nesting with the plain rule in the middle

All 3 rules share the same parent `.a`. The middle rule is only `.a`, so it
should be moved to the top and the others nested under it. Once nested, the
child rules also contain a shared parent of `&:hover`, and once again, one of
them has no descendants, meaning its rules must come first, and the last rule
becomes nested within it using the selectors `.b,.c`. This creates 3 levels of
nesting, including properties at each level.
