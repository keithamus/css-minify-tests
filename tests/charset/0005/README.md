# Do not replace unicode escapes in non-unicode charsets

If the `@charset` is not set to `UTF-16` or `UTF-8` (the default if `@charset`
is not present), then it may not be safe to convert escaped unicode values with
real unicode characters. 
