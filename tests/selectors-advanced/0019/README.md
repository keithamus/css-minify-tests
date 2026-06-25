# :where() merge when shorter

`:where(A):where(B,C)` merges to `:where(AB,AC)` when the cartesian product is
shorter. Here the saved `:where()` wrapper (8 chars) outweighs the cost of
duplicating A across 2 selectors. The break even point is the product of the
combined selectors needs to be less than 8.
