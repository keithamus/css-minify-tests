# Merge rules with properties of the same color but differing representations

In this test, the `color` property is in both rules, and has the same value
(`red`) but in different representations (`rgb` function and capitalized hex).
A minifier should resolve these color representations to their shortest version
(the keyword `red` in this case), then merge the selectors on the first rule,
removing the property from the second rule for the shortest possible outcome.

Note, that this should take into account the selector length and total number
of property/value pairs, as it may be shorter to not merge. See: `merging/0029`
"Skip combining common properties across rules when it results in a larger
size".
