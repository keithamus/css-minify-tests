# Simplify useless light-dark functions

The `light-dark(a, b)` CSS functions allows defining two possible colors based
on the `color-scheme` setting. These will automatically switch when the
`color-scheme` changes. However, if both values supplied are identical, then
the entire function can be replaced with the value.
