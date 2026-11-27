# Nest after converting `::before`/`::after` to `:before`/`:after`

This test has two rules that can take advantage of nesting. The each have two
selectors with the same psuedo-class, but one written with `::` that can be
reduced down to match the other (`:`). After converting `::before` to `:before`,
and `::after` to `:after`, the psuedo-classes will match and become nestable.
