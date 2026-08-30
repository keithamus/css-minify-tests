# Merging rules is unsafe when function arguments differ

`scale(2,3)` and `scale(3,2)` scale the two axes by swapped factors, so the
rules cannot be merged. A minifier might compare the arguments regardless of
order, and treat these two transforms as the same transform.
