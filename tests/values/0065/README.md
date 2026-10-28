# Convert small `s` values to `ms` when shorter

`0.0001s` is `0.1ms`. `.1ms` is shorter than the scientific form `1e-4s`, so
the minifier should convert to `ms`.
