# Merge equal bidirectional gap decoration rules

CSS Gaps 1 defines the gap decoration shorthands: column-rule, and row-rule
which set (row|column)-rule-width, (row|column)-rule-style,
(row|column)-rule-color. The spec also defines the _bidirectional_ shorthand
variants of `rule-width`, `rule-style` and `rule-color`. When column and row
properties are equal, they can be merged into the bidirectional shorthands.
