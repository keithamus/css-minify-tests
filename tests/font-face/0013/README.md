# Merge overlapping unicode ranges into wildcard

When unicode ranges map to a set of values that could be represented with
wildcards, they should be replaced with the wildcard to reduce character count.
