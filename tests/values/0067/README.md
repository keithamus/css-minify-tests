# Custom property integers must not use scientific notation

An unregistered custom property doesn't know where it will be substituted.
Here `--x` is used by `z-index`, which takes an `<integer>`. `1e6` is a
`<number>`, so writing `--x:1e6` would make `z-index` invalid.
