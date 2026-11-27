# Merge and nest rules and media query with redundant property

The last rule contains a property not affected by the above media query making
it safe to move above it. Once adjacent the two top level `a` rules can be
merged. Then the media query, which only contains a rule with the same selector
as the rule it is adjacent to can be nested into that rule. The rule inside the
`@media` block contains a duplicate `margin` property that can be cleaned up.
