# Border Shorthand Reset Hazard

The `border` shorthand resets `border-image`, which can't be expressed with
`border`. If a rule only uses the longhand border properties, then compacting
to the `border` shorthand is potentially unsafe it may inadvertently reset other
rules that use `border-image`.
