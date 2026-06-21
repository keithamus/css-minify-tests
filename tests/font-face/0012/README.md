# Merge overlapping unicode ranges with wildcards

If unicode ranges with wildcards has a partial overlap with other ranges, merge
them into one range. For example, `U+4??` represents the range of `U+400-4FF`.
If another range contains some of the same values, replace them both with a
single range that handles all associated values.
