# Merge rules with identical selectors separated by rules potentially overridden

Adjacent rules with identical selectors can always be merged. However, if there
are other rules between them, they can only be merged if the separating rules
have no property declarations that could potentially override the values in the
first rule in the merge, or if the selector is of a lower specificity.

If the separating rules could potentially be overridden by the last rule, but do
not potentially override anything in the first rule, then the first rule can be
merged into the last rule. This preserves any potential property overrides,
while still reducing total character count.

In this example `<div class="x y">` should get `background:#0ff;color:#0f0`,
because `.x` overrides the color value in `.y` when applied to the same element.
