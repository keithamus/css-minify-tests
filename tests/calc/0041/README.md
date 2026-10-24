# Fold `calc()` inside a `var()` fallback

The fallback is only used as the whole `width` value, so `calc(5px + 5px)` can
be folded to `10px` without changing the result.
