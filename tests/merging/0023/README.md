# Merge matching rules with `!important` properties separated by another rule

If two rules use the same selectors, they can be merged. Even with another rule
between them. In this case both matching rules and the separating rule use the
same property, but he separating rule's property has a higher specificity via
`!important`. If the an element has both a class of `a` and `b` applied, it will
recieve `gold` whether `.a` is above or below it, so the placement of the merge
can appear in either place.
