# Move media query down when safe, do not move up when unsafe

The last media query has overlapping properties and selectors with the preceding
rule. This makes it unsafe to move above it. However, the first media query
targets the `display` of `.foo`. None of the following rules effect this, making
it safe to move it down to be adjacent with the next media query. Once all rules
and queries are adjacent (or cannot be safely moved) they can be merged and
nested.
