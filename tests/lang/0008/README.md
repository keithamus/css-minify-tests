# Discard rules where the `:lang` selector contains an unespaced space

If a value in the `:lang()` psuedo-class contains an unescaped space that is not
in quotes, then it is an invalid locale and the entire rule will be ignored by
the browser (unless wrapped in a `:is()`). In this example, merging the two
rules would result in both being ignored. Since the second rule is invalid and
ignored by browsers it is safe to remove it.
