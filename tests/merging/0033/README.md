# Merge common properties of adjacent rules

In this example there are two rules that have `width:1px`. They can be merged
into one rule, however the `color:red` must remain in a separate rule. Because
there are no specificity changes, the merged rule can go before or after the
other rule. This rule should be conditionally applied, as longer class names
or larger amounts of properties may be longer when merged, See: `merging\0029`
"Skip combining common properties across rules when larger".
