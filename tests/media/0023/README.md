# Merge identical media queries separated by comment and another `@media` block

The second media query has a class with the same specificity and with the same
property as in the first media query. To preserve the cascade, it cannot be
moved above the first `@media` block. However, the following (last) media query
does not have any potential conflicts, so it can be moved up to be adjacent to
the first `@media` block with a matching query. Once adjacent they can be
merged. The comment can be removed at any point.
