# `utf-16` is a UTF-16LE label, so it also means UTF-8

The Encoding Standard maps `utf-16`, `utf-16le`, `ucs-2`, `unicode`,
`unicodefeff` and `iso-10646-ucs-2` to UTF-16LE, and `utf-16be` / `unicodefffe`
to UTF-16BE. Every one of them becomes `utf-8` when [determining the fallback
encoding](https://drafts.csswg.org/css-syntax-3/#determine-the-fallback-encoding),
so the rule is redundant and removable.

A minifier that string-matches only `utf-16be`/`utf-16le` keeps this rule and
misses the optimisation.
