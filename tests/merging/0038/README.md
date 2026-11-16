# Merge unrelated media queries and rules intersecting each other

There are 3 media queries with the same condition. Two rules, (`.x`, `.y`)
separate them. The selectors and properties used in the separating rules are
not included in any of the media queries, making it safe to reorder them so the
rules and media queries can be adjacent. Once re-ordered the identical `.x` and
`.y` rules can be merged, and the matching media queries can be as well. The
merged rules can go above or below the merged media query.
