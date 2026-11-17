# Nest repetitive adjacent rules with multiple selectors

All rules have selectors that start with the same `p` parent and can be nested
under it. In the first nesting group, all rules start with `h1,h2` allowing all
to be nested under them. Then all begin with `&:hover .anchor` which is another
nesting level. The remaining rules now all share a common start to their
selector in `.link`, to nest them under. Finally there is a remaining `:before`
rule.
