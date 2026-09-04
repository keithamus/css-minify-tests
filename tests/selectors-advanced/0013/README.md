# h1-h6 is not changed to :heading

`h1,h2,h3,h4,h5,h6` can be replaced with `:heading` per CSS Selectors Level 5.
The `:heading` pseudo-class matches any element with a heading level. However,
its specificity is that of a class (`0 1 0`). Replacing the H1-H6 tags that have
a lower specificity (`0 0 1`), with `:heading` may override styles that come
later in the CSSOM, including other files or inserted style from browser
extensions. For correctness, a minifier should not perform this optimization.
