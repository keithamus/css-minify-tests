# :where() compound merge

Adjacent `:where(A):where(B)` with single selectors merges to `:where(AB)`.
Saves exactly 8 chars (one `:where()` wrapper). `:where()` contributes zero
specificity either way, and A and B must both match simultaneously.
