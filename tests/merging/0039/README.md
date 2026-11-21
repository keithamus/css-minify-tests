# Merge rules in media query after deduping properties

In this test, `a` and `b` contain two `color` properties with safe values that
do not require fallbacks. The earlier `color` property in each rule is therefore
redundant and removabled. After removing it, the declarations for `a` and `b`
are now identical and can be merged.
