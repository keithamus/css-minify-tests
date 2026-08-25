# Font Shorthand Reset Hazard

The `font` shorthand resets font-kerning, which can't be expressed with `font`.
If a rule only uses the longhand font properties, then compacting to the `font`
shorthand is potentially unsafe it may inadvertently reset other rules that use
`font-kerning`.
