# Merge unicode ranges with wildcards that are encompassed by larger ranges

If a unicode range with wildcards is fully encompassed by other ranges, merge
them into one range. For example, `U+4??` represents the range of `U+400-4FF`.
If a larger range encompasses those values, then the wildcard could be removed.
