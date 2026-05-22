# a:not(:link) to a:visited

On hyperlink elements (`<a>`, `<area>`, `<link>` with href) `:link` and
`:visited` are a complete partition. `a:not(:link)` can be replaced with
the shorter `a:visited`. However, this should not apply to non-hyperlink
elements (`<div>`, `<h1>`, etc), and should not apply to non-tag selectors,
for example, a class could be applied to both `<a class="x">` and
`<div class="x">`. HREF attribute selectors should only receive this
minification if they have a qualifying element of `a`, `area`, or `link`.
