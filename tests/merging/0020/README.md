# Preserve distinct children when parent declarations overlap

When the similar rules overlap one another, merging them with a combinatory
selector works only if they are an exact match. This test ensures minifiers do
not exclude properties that are only in one rule.
