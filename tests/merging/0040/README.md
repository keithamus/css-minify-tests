# Merging across a nestable rule in a media query

In this test the first and last rule have an identical declaration, the rule
between them does not target any of the same properties of those before or
after, so it is safe to move it above the first or after the last rule. Once
adjacent, the `.a .b,.c` rule and `.e` rule can be merged. The remaining rule
has an internally shared common parent (`.a`) that can be used for nesting.
