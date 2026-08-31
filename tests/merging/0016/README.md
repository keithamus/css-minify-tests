# Do not merge rules with identical selectors separated by overlapping rules

Adjacent rules with identical selectors can always be merged. However, if there
are other rules between them, they can only be merged if the separating rules
have no property declarations that could potentially override the values in the
first rule in the merge, or if the selector is of a lower specificity.

In this example `<div class="x">` should get `background:#0ff;color:#00f`,
because `:where(.x)` is a selector with `0 0 0` specificty, where as `div` has
a higher specificity of `0 0 1`.
