# Clamp `calc()` inside a `var()` fallback

`calc(5px - 10px)` is clamped to the allowed range of `width`, so it resolves
to `0`. Folding it to `-5px` would be wrong: a literal negative `width` is
invalid at computed-value time, so the declaration would compute to `unset`
instead of `0`.

The fallback is only used as the whole `width` value, so it can be folded to
`0`.

* https://drafts.csswg.org/css-values/#calc-range
* https://drafts.csswg.org/css-variables/#invalid-at-computed-value-time
