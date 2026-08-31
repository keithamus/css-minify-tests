# Merge rules with identical selectors separated by rules that get overridden

Adjacent rules with identical selectors can always be merged. However, if there
are other rules between them, they can only be merged if the separating rules
have no property declarations that could potentially override the values in the
first rule in the merge, or if the selector is of a lower specificity.

If the separating rules could potentially override the first rule, but the last
rule to merge has no conflicts, it can be merged into the first rule. This
preserves any potential property overrides, while still reducing total
character count.

In this example `<div class="x y">` should get `background:#0ff;color:#00f`,
because `.y` overrides the color value in `.x` when applied to the same element.
