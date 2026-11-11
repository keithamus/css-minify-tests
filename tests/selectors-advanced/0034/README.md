# Remove `nth-child` rules without arguments

The pseudo-class `:nth-child` expects at least one argument. If it is not given
any arguments, then it is considered an invalid selector and the entire rule
will be ignored (unless the selector is wrapped with `:is()`).

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child
