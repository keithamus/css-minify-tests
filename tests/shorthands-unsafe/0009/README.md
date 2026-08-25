# Animation Shorthand Reset Hazard

The `animation` shorthand encompasses only eight of the ten animation-related
longhands, it cannot express `animation-timeline` and `animation-range`. If a
rule only uses the longhand animation properties, then compacting to the
`animation` shorthand is potentially unsafe it may inadvertently reset other
rules that use `animation-timeline` or `animation-range`.
