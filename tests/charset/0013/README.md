# A single-quoted @charset is not an encoding declaration

`@charset` must use single quotes, as the byte sequence - not "tokenized" syntax
is detected. `@charset 'gbk';` is therefore inert, and will be discarded in
engines. Minifiers can therefore safely remove this.

Normalising the quotes instead - which minifiers do to ordinary strings - turns
a rule the browser ignored into a live encoding declaration. This is incorrect
and may cause bugs.
