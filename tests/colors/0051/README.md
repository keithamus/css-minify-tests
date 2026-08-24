# Do not convert effectively transparent colors to transparent

All colors with an alpha of 0, are equivalent to the keyword `transparent`,
which according to the spec is technically `#0000`. However, a minifier should
not convert non-black colors with an alpha of 0 to `#0000`, as that will effect
the blending of the color when used in transitions.
