# Avoid unsafe partial font shorthand merge

Although the `.a` and `.b` both have a `font-weight: 700` and you could merge
`.a,.b` together, it's actually shorter to just use a `font` shorthand in `.b`.
Moving the font-weight out of the `font` shorthand and reusing it from the first
rule is shorter, but incorrect as the `font-weight` would be overridden by
`font`.
