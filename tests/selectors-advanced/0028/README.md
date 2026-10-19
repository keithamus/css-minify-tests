# Discard rules with unescaped spaces in attribute selector

If a selector is an attribute selector with a space that is not quoted and it
is not escaped, it is considered invalid by the browser and the entire rule is
ignored. A minifier should not merge these rules, as that would cause both to
be ignored. Since the second rule in this example is ignored by the browser it
is safe to remove it completely.
