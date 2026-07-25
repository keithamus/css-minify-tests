# Merge nested child :before/:after pseudo-elements with same rules

The `:before` and `:after` pseudo-elements have the same level of specificity.
If no other selectors are included for their rules that have a different
specificity level, and the rule declarations are identical, they can be merged.
