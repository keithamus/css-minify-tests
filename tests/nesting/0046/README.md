# Nest selector lists into an existing non-adjacent parent

Every selector in `a .y, a .z` shares the parent `a`, which already exists
earlier in the stylesheet. The list should be nested into that existing `a`
rule rather than creating a second `a` wrapper.
