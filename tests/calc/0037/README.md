# Resolve `clamp()` when the value exceeds the maximum

All three arguments share a unit, so `clamp(10px, 50px, 20px)` resolves to its
maximum, `20px`.
