# Merging rules is unsafe when the value after a slash differs

The `mask` shorthand takes the mask size after a slash, so `center/cover` and
`center/contain` scale the mask differently and the rules cannot be merged.
