# Registered `<integer>` custom properties must keep number type

`--x` is registered with `<integer>` syntax, so `100.0`, which has a
`<number>` type, is invalid and `--x` takes its initial value of `0`.
Rewriting it to `100` would make the value valid and change behaviour.
`1e2` keeps the `<number>` type, so it's also acceptable.
