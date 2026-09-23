# Merge matching rules with `!important` properties separated by another rule

If two rules use the same selectors, they can be merged. Even with another rule
between them. In this case of a property has a higher specificity via
`!important`. Since the separating rule also applies to the same property, but
has a lower specificity, it does not matter if the `.a` class is merged above or
below the separator.
