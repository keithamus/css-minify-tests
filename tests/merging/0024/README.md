# Merge matching rules with `!important` properties separated by another rule

If two rules use the same selectors, they can be merged. Even with another rule
between them. In this case both matching rules and the separating rule use the
same property, and all use `!important`. If the an element has both a class of
`a` and `b` applied, it will recieve `tan`. This requires the merged `.a` rule
to occur after the `.b` rule.
