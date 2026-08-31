# Do not merge rules with identical selectors separated by overlapping rules

Adjacent rules with identical selectors can always be merged. However, if there
are other rules between them, they can only be merged if the separating rules
have no property declarations that could potentially override the values in the
first rule in the merge, or if the selector is of a lower specificity.

In this example `<div class="x y">` should get `background:#0ff;color:#00f`.
