# Mask Shorthand Reset Hazard

The `mask` shorthand resets `mask-border` which can't be expressed with `mask`.
If a rule only uses the longhand animation properties, then compacting to the
`mask` shorthand is potentially unsafe it may inadvertently reset other rules
that use `mask-border`.
