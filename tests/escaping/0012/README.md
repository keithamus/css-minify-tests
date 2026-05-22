# Hex escape in custom property name

`\66 ` encodes `f` as a hex escape in a custom property name, resolving `--\66 oo` to
`--foo`. The same escape appears in `var(--\66 oo)` and must resolve consistently.
