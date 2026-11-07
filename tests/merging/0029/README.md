# Skip combining common properties across rules when it results in a larger size

If adjacent rules have matching properties with none missing, then their
selectors can be combined on the first rule. Then any properties in the
subsequent rules that have matching values can be eliminated. However, in some
cases (particularly those with longer selectors, or with very few properties
with matching values) this can result in a larger output, which should be
avoided.
