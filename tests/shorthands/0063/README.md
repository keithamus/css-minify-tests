# Background shorthand after merging rules

Across these 3 rules, all properties are the same for `.a` and `.b`, except for
the `background-image`. To simplify this, the `.a` styles can be moved into the
`.a,.b` rule. Then `.b` can override the `background-image` defined in `.a,.b`
and discard the duplicate `background-repeat`. The `.a,.b` can then merge all of
the defined background properties into a single `background` shorthand.
