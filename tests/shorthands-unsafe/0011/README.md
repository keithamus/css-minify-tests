# Repeated var() in a shorthand value cannot be deduplicated

`margin: 1px 1px` reduces to `margin: 1px`, but the same reduction across two
`var()` references is unsafe because the variable could contain an unknown
number of components, for example if `--a` expands to three or four values the
doubled form has six or eight components and is invalid at computed-value time,
while the reduced form remains valid.
