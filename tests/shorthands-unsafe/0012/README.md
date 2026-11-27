# Unsafe background shorthand

This is the inverse of `shorthands/0016` "Background longhand merge with
defaults". The source CSS only changes 2 background properties. If a shorthand
is applied of `background:red` or `background:red none` it would override
additional properties not intended in the source CSS (`background-repeat`,
`background-position`, and `background-attachment`).
