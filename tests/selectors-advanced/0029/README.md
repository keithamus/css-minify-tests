# Discard selectors that end in colon

A selector that ends in a colon is invalid and ignored by the browser. If a
minifier merges these rules (`a,a: hover{color:red}`) it will cause both to be
ignored by the browser. Leaving them separate is safe, however it is also safe
to remove the ignored rule completely.
