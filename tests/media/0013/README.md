# Merge identical media queries with differing whitespace

This tests validates that minifiers do not treat media queries differently when
there is, or is not, a space following `@media` before the start of the
conditions parenthesis (`(`).
