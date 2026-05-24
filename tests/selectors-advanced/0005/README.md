# input:not(:invalid) to input:valid

On form elements `:valid` and `:invalid` are a complete partition -- every input
is one or the other. So `input:not(:invalid)` can be replaced with the shorter
`input:valid`. This only holds when the type selector restricts to elements that
participate in constraint validation (`input`, `textarea`, `button`, etc). It
does not apply to classes that could be applied to multiple element types. For
example, `div:not(:invalid)` selects all `div`s, however `div:valid` selects
none.
