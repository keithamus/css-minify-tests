# Do not use border shorthand with double inherit

Converting to shorthand when the border color and style are both `inherit` will
result in `border:0 inherit inherit`, which is invalid CSS.
