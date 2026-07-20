# Hoist identical vendor-prefix fallback value into a custom property

`mask-image` and `-webkit-mask-image` share an identical, very long `url()`
data-URI value. Writing the value once as a custom property and referencing it
with `var()` from both declarations avoids duplicating it, which matters a lot
for large inline data URIs like this SVG mask. This is safe because every
browser that still needs the `-webkit-` fallback for `mask-image` also
supports CSS custom properties (custom property support predates unprefixed
`mask-image` support in every relevant engine), so no fallback is broken by
introducing `var()`.
