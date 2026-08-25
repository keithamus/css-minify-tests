# Border shorthand with double inherit

Converting to shorthand when the border color and style are both `inherit` will
result in `border:2px inherit inherit`, which is invalid CSS. Instead, just use
`border:inherit;` as the shorthand. This causes the element to inherit all
border properties. You can then override the `border-width`.
